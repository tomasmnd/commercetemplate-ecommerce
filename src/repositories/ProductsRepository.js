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
