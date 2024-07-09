import { Router } from "express";
import ProductsDao from "../dao/productDao.js";

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

export default router;
