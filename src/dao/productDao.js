import productsModel from "../model/products.model.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *       example:
 *         name: Product Name
 *         description: Product Description
 *         price: 9.99
 *         stock: 100
 */
export default class ProductsDao {
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
   */
  static async createNewProduct(newProduct) {
    return productsModel.create(newProduct);
  }

  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Get all products
   *     parameters:
   *       - in: query
   *         name: query
   *         schema:
   *           type: string
   *         description: Query object as a JSON string
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of items per page
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Sort order (asc or desc)
   *     responses:
   *       '200':
   *         description: Successful response
   */
  static async getAllProducts(
    query = "{}",
    page = 1,
    limit = 10,
    sort = "asc"
  ) {
    query = JSON.parse(query);
    const data = await productsModel.paginate(query, {
      limit,
      page,
      sort,
      lean: true,
    });
    const baseUrl = `/products?query=${JSON.stringify(
      query
    )}&limit=${limit}&sort=${sort}&page=`;
    const res = {
      status: "success",
      payload: data.docs,
      totalPages: data.totalPages,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: data.hasPrevPage ? baseUrl + (data.page - 1) : baseUrl + 1,
      nextLink: data.hasNextPage ? baseUrl + (data.page + 1) : baseUrl + 1,
    };
    return res;
  }

  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     summary: Get a product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Product ID
   *     responses:
   *       '200':
   *         description: Successful response
   */
  static async getProductByID(_id) {
    return await productsModel.findOne({ _id }).lean();
  }

  /**
   * @swagger
   * /products/limit/{limit}:
   *   get:
   *     summary: Get products with a limit
   *     parameters:
   *       - in: path
   *         name: limit
   *         required: true
   *         schema:
   *           type: integer
   *         description: Number of products to retrieve
   *     responses:
   *       '200':
   *         description: Successful response
   */
  static async getAllProductswhitLimits(limit) {
    return productsModel
      .find()
      .limit(limit)
      .lean();
  }

  /**
   * @swagger
   * /products/{id}:
   *   put:
   *     summary: Update a product
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       '200':
   *         description: Successful response
   */
  static async updateProduct(_id, modifiedProduct) {
    return productsModel.findByIdAndUpdate(_id, modifiedProduct, {
      new: true,
    });
  }

  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     summary: Delete a product
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Product ID
   *     responses:
   *       '200':
   *         description: Successful response
   */
  static async deleteProduct(_id) {
    return productsModel.findByIdAndDelete({ _id });
  }

  /**
   * @swagger
   * /products/multiple:
   *   get:
   *     summary: Get products by multiple IDs
   *     parameters:
   *       - in: query
   *         name: ids
   *         required: true
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Array of product IDs
   *     responses:
   *       '200':
   *         description: Successful response
   */
  static async getProductsByManyIDs(ids) {
    return await productsModel.find({ _id: { $in: ids } });
  }

  /**
   * @swagger
   * /products/{id}/stock:
   *   put:
   *     summary: Update product stock
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               newQuantity:
   *                 type: number
   *             required:
   *               - newQuantity
   *     responses:
   *       '200':
   *         description: Successful response
   */
  static async consumeStock(_id, newQuantity) {
    return productsModel.findOneAndUpdate(
      { _id },
      { $set: { stock: newQuantity } },
      { new: true }
    );
  }

  static async getProductsByOwner(ownerEmail) {
    try {
      const products = await productsModel.find({ owner: ownerEmail }).lean();
      return products;
    } catch (error) {
      console.error('Error getting products by owner:', error);
      throw error;
    }
  }

}
