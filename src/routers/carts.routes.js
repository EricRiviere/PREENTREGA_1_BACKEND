import { Router } from "express";
import { CartManager } from "../controllers/CartManager.js";

const CartsRouter = Router();

const CartsManager = new CartManager();

CartsRouter.get("/", async (req, res) => {
  try {
    let result = await CartsManager.getCarts();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

CartsRouter.get("/:cid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let result = await CartsManager.getCartById(cartId);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

CartsRouter.post("/", async (req, res) => {
  try {
    let result = await CartsManager.addCart();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

CartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let result = await CartsManager.addProductToCart(cartId, productId);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default CartsRouter;
