import fs from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const products = new ProductManager();

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
    if (fs.existsSync(this.path)) {
      let carts = fs.readFileSync(this.path, "utf-8");
      this.carts = JSON.parse(carts);
    } else {
      this.carts = [];
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"));
    }
  }

  writeCarts = async (carts) => {
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
  };

  readCarts = async () => {
    let carts = await fs.promises.readFile(this.path, "utf-8");
    this.carts = JSON.parse(carts);
    return this.carts;
  };

  getCarts = async () => {
    let carts = await this.readCarts();
    return carts;
  };

  addCart = async () => {
    let carts = await this.readCarts();
    let cId = nanoid(5);
    let cart = {
      cartId: cId,
      products: [],
    };
    carts.push(cart);
    await this.writeCarts(carts);
    return {
      message: "Cart added",
      cart,
    };
  };

  getCartById = async (id) => {
    let carts = await this.readCarts();
    let foundCart = carts.find((cart) => cart.cartId === id);
    if (!foundCart) {
      throw new Error("Cart not found");
    }
    return foundCart;
  };

  addProductToCart = async (cartId, productId) => {
    let carts = await this.readCarts();
    let foundCart = carts.find((cart) => cart.cartId === cartId);
    if (!foundCart) throw new Error("Cart not found");
    let productFound = await products.findProductById(productId);
    if (!productFound) throw new Error("Product not found");
    let productAlreadyInCart = foundCart.products.find(
      (product) => product.id === productId
    );
    if (productAlreadyInCart) {
      productAlreadyInCart.amount++;
      await this.writeCarts(carts);
      return {
        message: "Product amount updated",
        foundCart,
      };
    } else {
      foundCart.products.push({
        id: productId,
        amount: 1,
      });
      await this.writeCarts(carts);
      return {
        message: "Product added to cart",
        foundCart,
      };
    }
  };
}

export { CartManager };
