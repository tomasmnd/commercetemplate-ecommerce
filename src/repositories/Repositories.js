import CartRepository from "./CartsRepository.js";
import MockingProductsRepository from "./MockingProductsRepository.js";
import ProductsRepository from "./ProductsRepository.js";
import TicketsRepository from "./TicketsRepository.js";
import UsersRepository from "./UsersRepository.js";

export const UserServices = UsersRepository;
export const CartServices = CartRepository;
export const ProductsServices = ProductsRepository;
export const TicketsServices = TicketsRepository;
export const MockingProductsServices = MockingProductsRepository;