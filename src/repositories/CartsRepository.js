/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     responses:
 *       200:
 *         description: Successful response
 *   get:
 *     summary: Get a cart by ID
 *     parameters:
 *       - in: query
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *   delete:
 *     summary: Delete a cart by ID
 *     parameters:
 *       - in: query
 *         name: cartID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 * /carts/{cartID}/products:
 *   post:
 *     summary: Add a product to a cart
 *     parameters:
 *       - in: path
 *         name: cartID
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: quantity
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successful response
 *   delete:
 *     summary: Delete a product from a cart
 *     parameters:
 *       - in: path
 *         name: cartID
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: productID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *   put:
 *     summary: Update a product quantity in a cart
 *     parameters:
 *       - in: path
 *         name: cartID
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: productID
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: quantity
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successful response
 * /carts/{cartID}:
 *   put:
 *     summary: Update a cart
 *     parameters:
 *       - in: path
 *         name: cartID
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: newData
 *         required: true
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     summary: Purchase a cart
 *     parameters:
 *       - in: path
 *         name: cartID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 */

import CartDao from "../dao/cartDao.js";

export default class CartRepository {
  static async createNewcart() {
    return await CartDao.createNewcart();
  }
  static async addToCart(_id, pid, quantity) {
    return await CartDao.addToCart(_id, pid, quantity);
  }
  static async getCartById(cid) {
    return await CartDao.getCartById(cid);
  }

  static async getCartByUserId(id) {
    return await CartDao.getCartByUserId(id);
  }

  static async deleteCartProductByID(cartID, productID) {
    return await CartDao.deleteCartProductByID(cartID, productID);
  }
  static async deleteCartByID(cartID) {
    return await CartDao.deleteCartByID(cartID);
  }
  static async updateCartByID(cartID, newData) {
    return await CartDao.updateCartByID(cartID, newData);
  }
  static async updateCartProductsByID(cartID, productID, quantity) {
    return await CartDao.updateCartProductsByID(cartID, productID, quantity);
  }
  static async purchase(cartID) {
    const cart = await CartDao.purchase(cartID);
    return cart;
  }
}
