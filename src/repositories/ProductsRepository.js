/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Successful response
 *   get:
 *     summary: Get all products
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Successful response
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 * /products/limit/{limit}:
 *   get:
 *     summary: Get products with a limit
 *     parameters:
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 * /products/ids:
 *   post:
 *     summary: Get products by multiple IDs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       '200':
 *         description: Successful response
 * /products/{id}/stock:
 *   put:
 *     summary: Consume stock for a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newQuantity:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 */
import ProductsDao from "../dao/productDao.js";

export default class ProductsRepository {
  static async createNewProduct(newProduct) {
    return await ProductsDao.createNewProduct(newProduct);
  }
  static async getAllProducts(query, page, limit, sort) {
    return await ProductsDao.getAllProducts(query, page, limit, sort);
  }
  static async getProductByID(_id) {
    return await ProductsDao.getProductByID(_id);
  }
  static async getAllProductswhitLimits(limit) {
    return await ProductsDao.getAllProductswhitLimits(limit);
  }
  static async updateProduct(_id, modifiedProduct) {
    return await ProductsDao.updateProduct(_id, modifiedProduct);
  }
  static async deleteProduct(_id) {
    return await ProductsDao.deleteProduct(_id);
  }
  static async getProductsByManyIDs(ids) {
    return await ProductsDao.getProductsByManyIDs(ids);
  }
  static async consumeStock(_id, newQuantity) {
    return await ProductsDao.consumeStock(_id, newQuantity);
  }
}
