import { Router } from "express";
import CartDao from "../dao/cartDao.js";
import ProductsDao from "../dao/productDao.js";
import UsersDao from "../dao/usersDao.js";
import auth from "../middlewares/auth.js";
import { onlyAdminAccess } from "../middlewares/permissions.js"

// Create a new router instance
const router = Router();

// Redirect to login page
router.get("/", async (req, res) => {
  const { query, limit, page, sort } = req.query;
  const data = await ProductsDao.getAllProducts(query, page, limit, sort);
  res.render("home", { data });
});

// Render login page or redirect to products page if user is logged in
router.get("/login", async (req, res) => {
  try {
    const { userId } = req.session;
    if (userId) {
      res.redirect("/products");
    } else {
      res.render ("login")
    }
  } catch (error) {
    res.send("Error interno en el servidor");
  }
});

// Render register page
router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/restore", async (req, res) => {
  res.render("restore");
});

router.get("/restore-password/:hash", async (req, res) => {
  res.render("restorePassword");
});

router.get("/confirmPassword", async (req, res) => {
  res.render("confirmPassword");
});


// Render user profile page
router.get("/profile", async (req, res) => {
  const { userId } = req.session;
  const userData = await UsersDao.getUserByID(userId);
  res.render("profile", { userData });
});

// Render products page with filtering and sorting options
router.get("/products", auth, async (req, res) => {
  const { query, limit, page, sort } = req.query;
  const data = await ProductsDao.getAllProducts(query, page, limit, sort);
  const { userId } = req.session;
  let userData = null

  if(userId) {
    userData = await UsersDao.getUserByID(userId);
  }

  res.render("home", { data, userData });
});

// Render product details page
router.get("/product/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  const data = await ProductsDao.getProductByID(_id);
  const { userId } = req.session;
  const userData = await UsersDao.getUserByID(userId);
  console.log(userData);
  res.render("product", { data, userData });
});

// Render real-time products page
router.get("/realtimeproducts", auth, (req, res) => {
  res.render("realTimeProducts");
});

// Render admin page
router.get("/admin", auth, onlyAdminAccess, async (req, res) => {
  const usersData = await UsersDao.getAllUsers();
  res.render("admin", { usersData });
});

// Render chat page
router.get("/chat", auth, (req, res) => {
  res.render("chat");
});

// Render password change success page
router.get("/password-success", async (req, res) => {
  res.render("passwordChanges");
});

router.get("/linkSended", async (req, res) => {
  res.render("linkSended");
});


// Render cart page
router.get(`/cart/:cid`, auth, async (req, res) => {
  const { userId } = req.session;

  try {
    const cart = await CartDao.getCartByUserId(userId);
    const userData = await UsersDao.getUserByID(userId);
    res.render("cart", { cart, userData });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get(`/premium/store/:uid`, auth, async (req, res) => {
  const { userId } = req.session;

  try {
    const userData = await UsersDao.getUserByID(userId);
    const userProducts = await ProductsDao.getProductsByOwner(userData.email);
    const { query, limit, page, sort } = req.query;
    const productsData = await ProductsDao.getAllProducts(query, page, limit, sort);
    res.render("premiumUserStore", { userData, productsData, userProducts });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
