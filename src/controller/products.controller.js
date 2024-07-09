import ProductsServices from "../repositories/ProductsRepository.js";
import { InsufficientDataError, ProductNotFoundError } from "../utils/CustomErrors.js";
import UsersDao from "../dao/usersDao.js";
import NodeMailer from "../utils/NodeMailer.js";
import ProductsDao from "../dao/productDao.js";
import productsModel from "../model/products.model.js";
import MockingProductsServices from "../repositories/MockingProductsRepository.js";

export async function getProducts(req, res) {
  const { query, limit, page, sort } = req.query;

  try {
    const data = await ProductsServices.getAllProducts(query, page, limit, sort);
    if (!data) throw ProductNotFoundError();
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function getProductById(req, res) {
  try {
    const { pid } = req.params;
    if (!pid) throw new InsufficientDataError("product", ["ProductID"]);
    const data = await ProductsServices.getProductByID(pid);
    if (!pid) throw new ProductNotFoundError();

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function createProduct(req, res) {
  try {
    const { body } = req;
    const { title, description, price, code, stock, category } = body;
    const file = req.file.path;
    const user = req.user;

    const userData = await UsersDao.getUserByEmail(user.email);
    console.log('userData:', userData); // Debug log

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category ||
      !file
    )
      throw new InsufficientDataError("product", [
        "title",
        "description",
        "price",
        "code",
        "stock",
        "category",
        "file",
      ]);

    if (userData.role === "premium") {
      const existingProduct = await productsModel.findOne({ code: code });
      console.log('existingProduct:', existingProduct); // Debug log
      if (existingProduct) {
        return res.status(400).json({ message: "Ya existe un producto con este código" });
      }

      //body.thumbnails = ["images/products/" + file.trim()];
      body.thumbnails = [file.trim()];
      body.owner = userData.email;

      const newProduct = await ProductsDao.createNewProduct(body);
      console.log('newProduct:', newProduct); // Debug log

      if (!newProduct) {
        throw new Error('Failed to create new product');
      }

      const newProductsList = await ProductsServices.getAllProducts();
      console.log('newProductsList:', newProductsList); // Debug log

      if (!newProductsList) {
        throw new ProductNotFoundError();
      }

      res.status(201).json({ message: "Producto creado correctamente", product: newProduct });
    } else {
      res.status(403).json({ message: "Solo los usuarios premium pueden crear productos" });
    }
  } catch (error) {
    console.log('Error:', error); // Debug log
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      res.status(500).json({ message: "Error al crear el producto", error: error.message });
    }
  }
}

export async function updateProduct(req, res) {
  try {
    const { body } = req;
    const { pid } = req.params;
    const { title, description, price, code, stock, category } = body;
    const user = req.user;

    if (
      !pid ||
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category
    )
      throw new InsufficientDataError("product", [
        "ProductID",
        "title",
        "description",
        "price",
        "code",
        "stock",
        "category",
      ]);

    const product = await ProductsServices.getProductByID(pid);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (
      user.role === "ADMIN" ||
      (user.role === "PREMIUM" && product.owner === user.email)
    ) {
      const updatedProduct = {
        title,
        description,
        price,
        code,
        stock,
        category,
        owner: product.owner,
      };

      const result = await ProductsServices.updateProduct(pid, updatedProduct);
      res.status(200).json(result);
    } else {
      res
        .status(403)
        .json({ message: "No tienes permiso para actualizar este producto" });
    }
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function deleteProduct(req, res) {
  try {
    const { pid } = req.params;
    const user = req.user;
    const userData = await UsersDao.getUserByEmail(user.email);

    if (!pid) throw new InsufficientDataError("product", ["ProductID"]);

    const product = await ProductsServices.getProductByID(pid);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if(userData.role === "ADMIN") {
      console.log("EL USUARIO ES ADMINISTRADOR Y PUEDE BORRAR")
    }

    if (userData.role === "ADMIN" || (userData.role === "premium" && product.owner === userData.email)) {
      await ProductsServices.deleteProduct(pid);

      const ownerEmail = product.owner;
      const imagePath = path.resolve('public', 'email-resources', 'fakelibre-logo.png');

      await NodeMailer.sendMail({
        from: "FakeLibre",
        to: ownerEmail,
        subject: "Tu producto ha sido eliminado",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Producto eliminado en FakeLibre</title>
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
          <h1>Tu producto ha sido eliminado de FakeLibre</h1>
          <p>Te informamos que tu producto "${product.title}" ha sido eliminado de FakeLibre.</p>
          <p>Si crees que esto es un error, por favor contáctanos.</p>
          <p>Gracias por usar FakeLibre.</p>
          <p>El equipo de FakeLibre</p>
        </body>
        </html>`,
        attachments: [{
          filename: "fake-libre-logo.png",
          path: imagePath,
          cid: "unique@nodemailer.com"
        }]
      });

      console.log("Correo enviado al dueño del producto eliminado");

      res.status(200).json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(403).json({ message: "No tienes permiso para eliminar este producto" });
    }
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function getMockingProducts(req, res) {
  try {
    const fakeProducts = MockingProductsServices.getProducts();
    if (!fakeProducts) throw ProductNotFoundError();
    res.status(200).json(fakeProducts);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}