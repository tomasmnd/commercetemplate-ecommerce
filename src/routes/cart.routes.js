import { Router } from "express";
import { onlyUsersAccess } from "../middlewares/permissions.js";
import { getCartById, getCartByUserId, createCart, addProductToCart, removeProductFromCart, purchaseCart, renderCart } from "../controller/cart.controller.js";

const router = Router();

router.get("/:cid", getCartById);
router.get("/user/:id", getCartByUserId);
router.post("/", createCart);
router.post("/:cid/products/:pid/:quantity", onlyUsersAccess, addProductToCart);
router.delete("/:cid/products/:pid", onlyUsersAccess, removeProductFromCart);
router.post("/:cid/purchase", onlyUsersAccess, purchaseCart);
router.post("/", renderCart);

export default router;
