import CartDao from "../dao/cartDao.js";
import TicketsDao from "../dao/TicketDao.js";
import ProductsDao from "../dao/productDao.js";
import UserDao from "../dao/usersDao.js";
import CartServices from "../repositories/CartsRepository.js";
import { generateTicketPDF } from "../utils/ticketGenerator.js";
import NodeMailer from "../utils/NodeMailer.js";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import {
  CartNotFoundError,
  InsufficientDataError,
  ProductCartNotDeletedError,
} from "../utils/CustomErrors.js";

export async function getCartById(req, res) {
  try {
    const { cid } = req.params;
    if (!cid) throw new InsufficientDataError("Cart", ["CartID"]);

    console.log(`Fetching cart with ID: ${cid}`);

    const data = await CartServices.getCartById(cid);
    if (!data) throw new CartNotFoundError();

    console.log(`Cart data retrieved: ${JSON.stringify(data)}`);
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching cart: ${error.message}`);

    if (error instanceof CartNotFoundError || error instanceof InsufficientDataError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function getCartByUserId(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw new InsufficientDataError("Cart", ["CartID"]);

    console.log(`Fetching cart with ID: ${id}`);

    const data = await CartServices.getCartByUserId(id);
    if (!data) throw new CartNotFoundError();

    console.log(`Cart data of user retrieved: ${JSON.stringify(data)}`);
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching cart: ${error.message}`);

    if (error instanceof CartNotFoundError || error instanceof InsufficientDataError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function createCart(req, res) {
  try {
    const userId = req.session.userId;
    console.log("User ID from session:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("CART CONTROLLER: Creating cart for user, checking if it exists:", userId);

    let cart = await CartDao.getCartByUserId(userId);
    console.log("CART CONTROLLER: What I found:", cart);

    if (!cart) {
      console.log("CART CONTROLLER: No existing cart found, creating new cart");
      cart = await CartDao.createNewCart(userId);
    } else {
      console.log("CART CONTROLLER: Existing cart found:", cart);
    }

    console.log("CART CONTROLLER: Returning cart:", cart);
    res.status(201).json(cart);
  } catch (error) {
    console.error("CART CONTROLLER: Error creating cart:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function addProductToCart(req, res) {
  try {
    const { cid, pid, quantity } = req.params;
    const user = req.user;

    console.log("Request params:", req.params);
    console.log("User:", user);

    if (!quantity || !cid || !pid) {
      throw new InsufficientDataError("product", ["quantity", "cartID", "ProductID"]);
    }

    let cart = await CartDao.getCartById(cid);
    console.log("Cart:", cart);

    if (!cart) {
      console.log("Cart not found, creating cart");
      cart = await CartDao.createNewCart(user._id);
    }

    const product = await ProductsDao.getProductByID(pid);
    console.log("Product:", product);

    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.owner === user.email) {
      console.log("Premium user cannot add their own products to cart");
      return res.status(403).json({ message: "No puedes agregar tus propios productos al carrito" });
    }

    if (product.stock < quantity) {
      console.log("Insufficient stock");
      return res.status(400).json({ message: "Cantidad insuficiente en stock" });
    }

    const updatedCart = await CartDao.addToCart(cid, pid, quantity);
    console.log("Updated cart:", updatedCart);

    res.status(201).json(updatedCart);
  } catch (error) {
    console.log("Error:", error);

    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).json(error.getErrorData());
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export async function removeProductFromCart(req, res) {
  try {
    const { cid, pid } = req.params;
    console.log("Received request to delete product", pid, "from cart", cid);

    if (!cid || !pid)
      throw new InsufficientDataError("Cart", ["cartID", "ProductID"]);

    const data = await CartServices.deleteCartProductByID(cid, pid);
    console.log("Product deleted from cart:", data);

    if (!data) throw new ProductCartNotDeletedError();

    res.json(data);
  } catch (error) {
    if (error instanceof InsufficientDataError || error instanceof ProductCartNotDeletedError) {
      console.log("Error:", error.message);
      res.status(error.statusCode).json(error.getErrorData() || error.message);
    } else {
      console.log("Unexpected error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export async function purchaseCart(req, res) {
  try {
    const { cid } = req.params;
    const { userId } = req.session;

    // Obtenemos el carrito...
    const cart = await CartDao.getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Obtenemos la información del usuario
    const user = await UserDao.getUserByID(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Calcular la compra y blablabla...
    const { leftiesCart, amount } = await CartDao.purchase(cid);
    console.log("Lefties cart:", leftiesCart, "Amount:", amount);

    if (leftiesCart.length > 0) {
      await CartDao.deleteCartProductsByIDs(cid, leftiesCart);
      console.log("Lefties cart deleted");
      const updatedCart = await CartDao.getCartById(cid);
      console.log("Updated cart:", updatedCart);
      return res.redirect(`/cart/${cid}`);
    }

    // Creamos el ticket de compra.
    console.log("CREATING ORDER");

    // Obtenemos la información detallada de los productos.
    const productPromises = cart.products.map(async (product) => {
      const productDetails = await ProductsDao.getProductByID(product.productId);
      return {
        title: productDetails.title,
        quantity: product.quantity,
        price: productDetails.price
      };
    });

    const products = await Promise.all(productPromises);

    const userName = user.first_name;
    const userLastname = user.last_name;

    console.log("User:", userName + " " + userLastname);

    const ticketData = {
      code: uuidv4(),
      purchase_datetime: Date.now(),
      amount: amount,
      purchaser: userId,
      purchaser_name: userName,
      purchaser_lastname: userLastname,
      items: [cart._id],
      products: products
    };

    console.log("Order:", ticketData);
    const ticket = await TicketsDao.createNewTicket(ticketData);
    console.log("Order created:", ticket);

    try {
      console.log("Creating PDF");
      const pdfPath = await generateTicketPDF(ticketData);
      console.log("PDF generated:", pdfPath);
      if (user.email && pdfPath) {
        console.log("Sending PDF with mail.");
        const imagePath = path.resolve('public', 'email-resources', 'fakelibre-logo.png');
        const info = await NodeMailer.sendMail({
          from: "FakeLibre",
          to: user.email,
          subject: "Gracias por tu compra en FakeLibre",
          html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>¡Gracias por tu compra en FakeLibre!</title>
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
            <h1>¡Gracias por tu compra en FakeLibre!</h1>
            <p>Tu compra ha sido procesada exitosamente. Aquí tienes los detalles de tu compra:</p>
            <ul>
              <li>Código de ticket: ${ticketData.code}</li>
              <li>Fecha de compra: ${new Date(ticketData.purchase_datetime).toLocaleString()}</li>
              <li>Monto total: $${ticketData.amount}</li>
            </ul>
            <p>Hemos adjuntado el ticket de tu compra a este correo electrónico.</p>
            <p>Gracias por confiar en FakeLibre. Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Nuestros mejores deseos,</p>
            <p>El equipo de FakeLibre</p>
          </body>
          </html>`,
          attachments: [
            {
              filename: "fake-libre-logo.png",
              path: imagePath,
              cid: "unique@nodemailer.com"
            },
            {
              filename: `ticket_${ticketData.code}.pdf`,
              path: pdfPath,
            }
          ]
        });
      } else {
        console.log("User email not found, skipping email send");
      }
    } catch (pdfError) {
      console.error("Error generating PDF or something:", pdfError);
    }

    await CartDao.deleteCartByID(cid);
    console.log("Cart deleted");

    await UserDao.updateUserCart(userId, null);
    console.log("User cart updated");

    res.status(200).json({ message: 'Carrito comprado exitosamente', amount, items: ticket.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function renderCart(req, res) {
  try {
    const { userId } = req.session;
    console.log("Searching cart from");
    let cart = await CartDao.getCartByUserId(userId);

    if (!cart) {
      console.log("No cart found, needs to be created.");
      cart = await CartDao.createNewCart();
      await UserDao.updateUserCart(userId, cart._id);
    }

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}