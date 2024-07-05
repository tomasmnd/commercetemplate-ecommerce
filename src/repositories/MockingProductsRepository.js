import Mocking from "../dao/mocking.dao.js";
export default class MockingProductsRepository {
  static getProducts() {
    return Mocking.getProducts();
  }
}
