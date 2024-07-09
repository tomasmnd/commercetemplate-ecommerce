import { UserServices } from "../repositories/Repositories.js";
import passport from "passport";
import path from "path";
import Logger from "../utils/Logger.js";
import NodeMailer from "../utils/NodeMailer.js";
import {
  AlreadyPasswordInUseError,
  InvalidLinkError,
  UserNotFoundError,
} from "../utils/CustomErrors.js";
import RestoreRepository from "../repositories/RestoreRepository.js";
import UsersDao from "../dao/usersDao.js";
import UsersRepository from "../repositories/UsersRepository.js";
import { generateToken } from "../utils/TokenUtils.js";

export async function registerUser(req, res) {
  try {
    const { email } = req.body;

    // Verifica si el correo ya existe
    console.log("REGISTRO: Verificando email.");
    const existingUser = await UsersDao.getUserByEmail(email);
    if (existingUser) {
      console.log("REGISTRO: Email ya existente: ", existingUser);
      return res.status(400).send("El correo electrónico ya está registrado.");
    }

    // Genera un token único para el usuario recién registrado.
    const confirmationToken = generateToken();

    // Registra al usuario al no encontrar un email similar.
    const userId = await UsersRepository.register(
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.age,
      req.body.password,
      confirmationToken
    );

    // Construye el link para la confirmación del registro.
    const protocol = req.protocol;
    const host = req.get('host');
    const link = `${protocol}://${host}/api/sessions/confirm-register/${confirmationToken}`;

    // Construye y envía el correo de confirmación.
    const imagePath = path.resolve('public', 'email-resources', 'fakelibre-logo.png');
    NodeMailer.sendMail({
      from: "FakeLibre",
      to: req.body.email,
      subject: "¡Te damos la bienvenida!",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Bienvenido a FakeLibre</title>
        <style>
          .button {
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
          }

          .image-container {
            text-align: center;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="image-container">  
          <img src="cid:unique@nodemailer.com" alt="Logo de FakeLibre" style="max-width: 200px; ">
        </div>
        <h1>¡Bienvenido a FakeLibre!</h1>
        <p>Te damos la bienvenida a FakeLibre, tu registro está por terminar. Para ello te pedimos que confirmes tu dirección de e-mail</p>
        <p>Estamos emocionados de tenerte a bordo, recuerda que el equipo de FakeLibre nunca te pedirá datos personales.</p>
        <a href="${link}" class="button text-color:white" target="_blank">¡Completar registro!</a>
        <p>Nuestros mejores deseos,</p>
        <p>El equipo de FakeLibre</p>
      </body>
      </html>`,
      attachments: [{
        filename: "fake-libre-logo.png",
        path: imagePath,
        cid: "unique@nodemailer.com"
      }]
    });

    // Confirma el registro del usuario.
    return res.redirect("/confirmPassword");
  } catch (error) {
    console.error(error);
    res.send("Error en el proceso de registro.");
  }
}

export async function confirmUserRegistration(req, res) {
  try {
    const { token } = req.params;
    console.log("CONFIRMAR REGISTRO: Token recibido: ", token);

    // Buscar el usuario por el token
    const user = await UsersDao.findUserByToken(token);
    console.log("CONFIRMAR REGISTRO: Usuario encontrado: ", user);

    if (!user) {
      // No se envía una respuesta aquí
      throw new Error("Token inválido");
    }

    // Confirmar el registro del usuario
    await UsersDao.confirmUserRegistration(user._id);

    // Actualizar el campo 'confirmed' a true
    await UsersDao.updateConfirmedStatus(user._id, true);

    // Redirigir al usuario a la página de inicio de sesión
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message || "Error al confirmar el registro");
  }
}

export async function initiatePasswordReset(req, res) {
  try {
    const { email } = req.body;
    const userId = await UserServices.getusersIdByEmail(email);
    if (!userId) throw UserNotFoundError();
    const restore = await RestoreRepository.createNewRestore(userId);
    const link = `http://${req.headers.host}/api/sessions/reset/${restore.hash}`;

    NodeMailer.sendMail({
      from: "FakeLibre",
      to: email,
      subject: "password reset",
      html: `<h1>Click <a href="${link}" target="_blanc">HERE</a> to reset your Fake Market's password</h1>`,
    });
    res.redirect("/linkSended");
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
}

export async function validatePasswordResetLink(req, res) {
  try {
    const { hash } = req.params;
    const restore = await RestoreRepository.getRestoreByHash(hash);
    if (!restore) {
      res.status(404).send("Invalid link");
    } else {
      const now = Date.now();
      const diff = now - restore.createdAt;
      if (diff > 1000 * 60 * 60) {
        res.send("Link expired, please generate a new one");
      } else {
        res.redirect(`/restore-password/${hash}`);
      }
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}

export async function setNewPassword(req, res) {
  try {
    const { hash } = req.params;
    const { password } = req.body;

    const restore = await RestoreRepository.getRestoreByHash(hash);
    if (!restore) {
      throw InvalidLinkError();
    } else {
      const validateNewPassword = await UserServices.validateNewPassword(
        restore.user,
        password
      );
      if (!validateNewPassword) {
        throw new AlreadyPasswordInUseError();
      }
      await UserServices.restorePasswordWithID(restore.user, password);
      await RestoreRepository.deleteRestoreByHash(hash);
      res.redirect("/password-success");
    }
  } catch (error) {
    if (
      error instanceof InvalidLinkError ||
      error instanceof AlreadyPasswordInUseError
    ) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
}

export async function logoutUser(req, res) {
  req.session.destroy((err) => {
    res.redirect("/");
  });
}

export async function loginUser(req, res) {
  try {
    if (!req.user) {
      res
        .status(500)
        .send({ status: "error", message: "Invalid credentials" });
    } else {
      req.session.userId = req.user._id;
      res.redirect("/products");
    }
  } catch (error) {
    Logger.error("Error:", error);
    res.status(500).send({ status: "error", message: "Invalid credentials" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const userId = req.session.userId;

    if (userId) {
      const currentUser = await UserServices.getUserByID(userId);
      res.status(200).send(currentUser);
    } else {
      res.status(401).send({ message: "No active session" });
    }
  } catch (error) {
    // Manejo de errores
    Logger.error("Error:", error);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
}

export async function initiateGitHubAuth(req, res, next) {
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
}

export async function handleGitHubAuthCallback(req, res, next) {
  passport.authenticate("github", { failureRedirect: "/login" })(req, res, next);
}

export async function handleGitHubAuthSuccess(req, res) {
  req.session.userId = req.user._id;
  res.redirect("/products");
}

export async function serializeUser(user, done) {
  done(null, user._id);
}

export async function deserializeUser(id, done) {
  try {
    const user = await UserServices.getUserByID(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
}