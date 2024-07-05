import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

class Product {
  constructor() {
    this.id = faker.datatype.uuid();
    this.title = faker.commerce.productName();
    this.description = faker.commerce.productDescription();
    this.price = faker.commerce.price();
    this.status = true;
    this.code = uuidv4();
    this.stock = faker.datatype.number({ min: 1, max: 100 });
    this.category = faker.commerce.department();
    this.thumbnails = faker.image.imageUrl();
  }
}

export default class Mocking {
  #products = [];

  static getProducts() {
    const products = [];
    for (let i = 0; i < 100; i++) {
      const product = new Product();
      products.push(product);
    }
    return products;
  }
}
