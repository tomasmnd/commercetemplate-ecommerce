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
