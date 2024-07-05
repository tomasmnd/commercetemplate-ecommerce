import express from 'express';
import nodemailer from 'nodemailer';
import UsersRepository from '../repositories/UsersRepository.js';
import RestoreDao from '../dao/restore.Dao.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Ruta para solicitar el restablecimiento de contraseña
router.post('/password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UsersRepository.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hash = uuidv4();
    await RestoreDao.createNewRestore(user._id, hash);

    const resetLink = `http://localhost:8080/reset-password/${hash}`;

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `
        <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al enviar el correo' });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Correo enviado correctamente' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para restablecer la contraseña
router.post('/reset-password/:hash', async (req, res) => {
  const { hash } = req.params;
  const { newPassword } = req.body;

  try {
    const restore = await RestoreDao.getRestoreByHash(hash);

    if (!restore) {
      return res.status(404).json({ message: 'Enlace inválido o expirado' });
    }

    const user = await UsersRepository.getUserByID(restore.user);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isSamePassword = await UsersRepository.validateNewPassword(user._id, newPassword);

    if (isSamePassword) {
      return res.status(400).json({ message: 'No puedes usar la misma contraseña' });
    }

    await UsersRepository.restorePasswordWithID(user._id, newPassword);
    await RestoreDao.deleteRestoreByHash(hash);

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;