import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getMockingProducts } from "../controller/products.controller.js";
import upload from "../middlewares/multerConfig.js";
import { onlyPremiumUsersAccess } from "../middlewares/permissions.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", upload.single("img"), onlyPremiumUsersAccess, createProduct);
router.put("/:pid", onlyPremiumUsersAccess, updateProduct);
router.delete("/:pid", onlyPremiumUsersAccess, deleteProduct);
router.get("/mockingproducts", getMockingProducts);

export default router;
