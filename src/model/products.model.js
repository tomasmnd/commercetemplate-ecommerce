/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description  
 *         - price
 *         - code
 *         - stock
 *         - category
 *         - owner
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         status:
 *           type: boolean
 *           description: The status of the product (true or false)
 *           default: true
 *         code:
 *           type: string
 *           description: The unique code of the product
 *         stock:
 *           type: number
 *           description: The stock quantity of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         thumbnails:
 *           type: array
 *           items:
 *             type: string
 *           description: The URLs of the product thumbnails
 *         owner:
 *           type: string
 *           description: The email of the product owner
 *           default: admin@admin.com
 */

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: [{ type: String }],
  owner: {
    type: String,
    required: true,
    default: "admin@admin.com",
  },
});

productSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model("products", productSchema);
export default productsModel;
