import cartsModel from "../model/carts.model.js";
import UserDao from "../dao/usersDao.js"
import { ObjectId } from 'mongodb'
import { ProductsServices } from "../repositories/Repositories.js";

export default class CartDao {
  static async createNewcart() {
    return cartsModel.create({});
  }

  static async getCartById(cartId) {
    return cartsModel.findById(cartId).lean()
  }

  static async addToCart(cartId, pid, quantity) {
    const cart = await cartsModel.findById(cartId).lean();
  
    if (!cart) {
      return "Cart Not Found";
    }
  
    const existingProduct = cart.products.find(
      p => p.productId.toString() === pid
    );
  
    if (existingProduct) {
      existingProduct.quantity += Number(quantity);
    } else {
      cart.products.push({ productId: pid, quantity: Number(quantity) });
    }
  
    return cartsModel.findByIdAndUpdate(
      cartId,
      { products: cart.products },
      { new: true }
    );
  }

  static async getCartByUserId(userId) {
    const user = await UserDao.getUserCartId(userId);

    if (!user || !user.cart) {
      return null;
    }

    const cart = await cartsModel.findById(user.cart).populate("products.productId").lean();

    if (!cart) {
      return null;
    }

    cart.total = cart.products.reduce((total, product) => {
      return total + (product.productId ? product.productId.price * product.quantity : 0);
    }, 0);
    return cart;
  }
  
  static async createNewCart(userId) {
    const existingCart = await cartsModel.findOne({ user: userId, active: true });

    if (existingCart) {
      throw new Error('El usuario ya tiene un carrito activo');
    }

    const newCart = await cartsModel.create({ user: userId, products: [], active: true });
    await UserDao.updateUserCart(userId, newCart._id);

    return newCart;
  }
  
  static async deleteCartProductByID(cartID, productID) {
    console.log('deleteCartProductByID called with cartID:', cartID, 'and productID:', productID);
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    console.log('Cart found:', cart);
    cart.products = cart.products.filter(
      product => {
        const shouldKeep = product.productId.toString() !== productID;
        console.log(`Keeping product ${product.productId}? ${shouldKeep}`);
        return shouldKeep;
      }
    );
    console.log('Updated cart products:', cart.products);
    const updatedCart = await cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
    console.log('Updated cart:', updatedCart);
    return updatedCart;
  }

  static async deleteCartByID(cartID) {
    return cartsModel.findByIdAndDelete({ _id: cartID });
  }

  static async updateCartByID(cartID, newData) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = newData;
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  static async updateCartProductsByID(cartID, productID, quantity) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = cart.products.filter(
      product => product.productId !== productID
    );
    cart.products.push({ productId: productID, quantity });
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  static async purchase(cartID) {
    try {
      const cart = await this.getCartById(cartID);
      const ids = cart.products.map(p => new ObjectId(p.productId));
  
      let amount = 0;
      const products = await ProductsServices.getProductsByManyIDs(ids);
      const leftiesCart = [];
      const cartProductsMap = new Map(cart.products.map(p => [p.productId.toString(), p.quantity]));
  
      const consumeStockPromises = products.map(product => {
        const quantity = cartProductsMap.get(product._id.toString());
        console.log('Product:', product._id, 'Quantity in cart:', quantity);
  
        if (product.stock >= quantity) {
          const newQuantity = product.stock - quantity;
          amount += product.price * quantity;
          console.log('Consuming stock for product:', product._id, 'New quantity:', newQuantity);
          return ProductsServices.consumeStock(product._id, newQuantity);
        } else {
          leftiesCart.push(product._id);
          console.log('Not enough stock for product:', product._id);
          return Promise.resolve();
        }
      });
  
      await Promise.all(consumeStockPromises);

      return { leftiesCart, amount };
    } catch (err) {
      console.error('Error purchasing cart:', err);
      throw err;
    }
  }
  
  static async deleteCartProductsByIDs(cartID, productIDs) {
    try {
      const cart = await this.getCartById(cartID);
      const updatedProducts = cart.products.filter(p => !productIDs.includes(p.productId.toString()));
      const updatedCart = await this.updateCartByID(cartID, { products: updatedProducts });
      return updatedCart;
    } catch (err) {
      console.error('Error deleting cart products:', err);
      throw err;
    }
  }

  static async updateUserCart(userId, cartId) {
    return usersModel.findByIdAndUpdate(userId, { cartId }, { new: true });
  }
}