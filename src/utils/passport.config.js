import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UsersDao from "../dao/usersDao.js";
import PasswordManagement from "./passwordManagement.js";
import GithubStrategy from "passport-github2";
import { v4 as uuidv4 } from "uuid";

const initializaPassport = () => {
  //Register local
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        try {
          let { first_name, last_name, age } = req.body;
          age = parseInt(age);
          if (!first_name || !last_name || !email || !password || !age) {
            return done(null, false);
          }

          // Verifica si el correo electrónico ya existe
          const existingUser = await UsersDao.getUserByEmail(email);
          if (existingUser) {
            console.log("PASSPORT: Email ya existente: ", existingUser)
            return done(null, false);
          }

          // Si el correo electrónico no existe, crea un nuevo usuario
          const user = await UsersDao.register(
            first_name,
            last_name,
            email,
            age,
            password,
            confirmationToken
          );
          return done(null, user);
        } catch (error) {
          return done(error);
          }
        }
      )
    );

  // Login Local
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          if (!email || !password) {
            return done(null, false);
          }
  
          const user = await UsersDao.getUserByEmail(email);
          console.log("PASSPORT LOGIN", user)
          console.log(user.role)

          if (!user.confirmed) {
            return done(null, false, { message: "Por favor, confirma tu registro antes de iniciar sesión" });
          }
  
          if (PasswordManagement.validatePassword(password, user?.password)) {
            console.log("PASSPORT: User logged in: ", user);
            return done(null, user);
          } else {
            return done(null, false, { message: "Credenciales inválidas" });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.a4e074b7057f062f",
        clientSecret: "3fca71b77346b74b1be965509b45134fd2f92350",
        callbackURL: "http://localhost:8080/api/sessions/githubCallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await UsersDao.getUserByEmail(profile._json.email || "");
          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: " ",
              age: 18,
              email: profile._json.email ? profile._json.email : uuidv4(),
              password: " ",
            };

            const result = await UsersDao.register(
              newUser.first_name,
              newUser.last_name,
              newUser.email,
              newUser.age,
              newUser.password
            );
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Serializadores
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await UsersDao.getUserByID(_id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

};

export default initializaPassport;
