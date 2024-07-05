import express from 'express';
import upload from '../middlewares/multerConfig.js';
import User from '../model/users.model.js';
import UsersDao from "../dao/usersDao.js"
import Product from '../model/products.model.js';
import { onlyAdminAccess } from '../middlewares/permissions.js';
import NodeMailer from '../utils/NodeMailer.js';
import path from "path";

const router = express.Router();

// Ruta para actualizar el rol del usuario a "premium"
router.put('/users/premium/:uid/', async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await User.findById(userId);

    console.log('User:', user)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario ha subido los documentos requeridos
    const requiredDocuments = ['identificacion', 'comprobante_domicilio', 'comprobante_cuenta'];
    const hasUploadedRequiredDocuments = requiredDocuments.every(doc =>
      user.documents.some(d => d.name.includes(doc))
    );

    if (!hasUploadedRequiredDocuments) {
      console.log("El usuario no ha cargado todos los documentos requeridos");
      return res.status(400).json({ error: 'El usuario no ha cargado todos los documentos requeridos' });
    }

    // Actualizar el rol del usuario a "premium" :B
    user.role = 'premium';
    await user.save();
    console.log('User updated to premium')
    res.status(200).json({ message: 'Usuario actualizado a premium' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
});

// Ruta para subir la documentación para ser 'premium'
router.post('/users/:uid/documents', upload.array('documents'), async (req, res) => {
  try {
    const userId = req.params.uid;
    const files = req.files;
    const user = await User.findById(userId);
    console.log('User:', user)

    if (!user) {
      console.log('User not found')
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const documents = files.map(file => ({
      name: file.originalname,
      reference: file.path
    }));
    console.log('Documents:', documents)
    user.documents.push(...documents);
    user.hasUploadedDocuments = true; // Actualizar el estado del usuario
    console.log('User updated with new documents')
    await user.save();

    res.status(200).json({ message: 'Documentos cargados exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar los documentos' });
  }
});

router.post('/users/:uid/profile-image', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.params.uid;
    const file = req.file;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    user.profileImage = file.path;
    await user.save();

    res.status(200).json({ message: 'Imagen de perfil cargada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar la imagen de perfil' });
  }
});

// Subir imagen del producto 
// Sube correctamente la imagen a uploads/products
//TO DO: Subir una imagen del producto DESDE los productos del usuario y modificar para que exista en el array de imagenes del producto en la vista.
router.post('/products/:pid/image', upload.single('productImage'), async (req, res) => {
  try {
    const productId = req.params.pid;
    const file = req.file;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar la imagen del producto
    product.image = file.path;
    await product.save();

    res.status(200).json({ message: 'Imagen de producto cargada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar la imagen del producto' });
  }
});


router.post('/users/:uid/change-role', onlyAdminAccess, async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const newRole = user.role === 'USER' ? 'premium' : 'USER';
    user.role = newRole;
    await user.save();

    res.status(200).json({ message: `Rol de usuario actualizado a ${newRole}` });
  } catch(e) {
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
});

router.delete('/users/:uid/delete', onlyAdminAccess, async (req, res) => {
  try {
    console.log('Deleting user...')
    const userId = req.params.uid
    console.log('User ID:', userId)
    const userMail = await User.findById(userId)
    if(userMail.role === 'ADMIN') {
      return res.status(403).json({ error: 'You cant delete an admin' })
    }
    const user = await UsersDao.findByIdAndDelete(userId)
    const imagePath = path.resolve('public', 'email-resources', 'fakelibre-logo.png');
    NodeMailer.sendMail({
      from: "FakeLibre",
      to: userMail.email,
      subject: "Tu cuenta en FakeLibre ha sido eliminada",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Tu cuenta en FakeLibre ha sido eliminada</title>
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
        <h1>Estado de tu cuenta en FakeLibre</h1>
        <p>Te informamos que tu cuenta en FakeLibre ha sido eliminada.</p>
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

    console.log('User deleted:', user)

    if (!user) {
      console.log('User not found')
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    console.log('User deleted successfully')
    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar el usuario:', error)
    res.status(500).json({ error: 'Error al eliminar el usuario' })
  }
});

router.delete('/users/:uid/delete', onlyAdminAccess, async (req, res) => {
  try {
    console.log('Deleting user...')
    const userId = req.params.uid
    console.log('User ID:', userId)
    const userMail = await User.findById(userId)
    if(userMail.role === 'ADMIN') {
      return res.status(403).json({ error: 'You cant delete an admin' })
    }
    const user = await UsersDao.findByIdAndDelete(userId)
    const imagePath = path.resolve('public', 'email-resources', 'fakelibre-logo.png');
    NodeMailer.sendMail({
      from: "FakeLibre",
      to: userMail.email,
      subject: "Tu cuenta en FakeLibre ha sido eliminada",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Tu cuenta en FakeLibre ha sido eliminada</title>
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
        <h1>Estado de tu cuenta en FakeLibre</h1>
        <p>Te informamos que tu cuenta en FakeLibre ha sido eliminada.</p>
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

    console.log('User deleted:', user)

    if (!user) {
      console.log('User not found')
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    console.log('User deleted successfully')
    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar el usuario:', error)
    res.status(500).json({ error: 'Error al eliminar el usuario' })
  }
});

router.delete('/users/inactive', onlyAdminAccess, async (req, res) => {
  console.log("ASD")
  try {
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

    // Encuentra usuarios inactivos excluyendo a administradores
    const inactiveUsers = await User.find({ 
      last_connection: { $lt: thirtySecondsAgo },
      role: { $ne: 'ADMIN' } // Excluir usuarios con role 'ADMIN'
    });

    console.log('Inactive users:', inactiveUsers);

    if (inactiveUsers.length === 0) {
      console.log('No hay usuarios inactivos');
      return res.status(404).json({ message: 'No hay usuarios inactivos' });
    }

    console.log(`Encontrados ${inactiveUsers.length} usuarios inactivos`);

    const imagePath = path.resolve('public', 'email-resources', 'fakelibre-logo.png');

    const emailPromises = inactiveUsers.map(user => 
      NodeMailer.sendMail({
        from: "FakeLibre",
        to: user.email,
        subject: "Tu cuenta fue suspendida por inactividad",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Información sobre el estado de tu cuenta en FakeLibre</title>
          <style>
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
          <h1>Tu cuenta en FakeLibre se encuentra suspendida.</h1>
          <p>Te informamos que debido a tu inactividad, tu cuenta de FakeLibre se encuentra suspendida.</p>
          <p>Por favor, escríbenos a FakeLibre@fakelibre.com o crea una cuenta desde cero.</p>
          <p>Nuestros mejores deseos,</p>
          <p>El equipo de FakeLibre</p>
        </body>
        </html>`,
        attachments: [{
          filename: "fake-libre-logo.png",
          path: imagePath,
          cid: "unique@nodemailer.com"
        }]
      })
    );

    await Promise.all(emailPromises);

    console.log(`${inactiveUsers.length} correos enviados a usuarios inactivos.`);

    // Eliminar usuarios inactivos excluyendo a administradores
    const deleteResult = await User.deleteMany({ 
      _id: { $in: inactiveUsers.map(user => user._id) }, // Borrar solo los IDs de usuarios inactivos que no sean administradores
      role: { $ne: 'ADMIN' } // Asegurar que no se borren usuarios administradores
    });

    console.log(`${deleteResult.deletedCount} usuarios inactivos eliminados.`);

    res.status(200).json({ message: `${deleteResult.deletedCount} usuarios inactivos eliminados` });
  } catch (error) {
    console.error('Error al eliminar usuarios inactivos:', error);
    res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
  }
});

export default router;
