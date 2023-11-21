import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ProductsRouter = Router();

const Manager = new ProductManager();

ProductsRouter.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let products = await Manager.getProducts();
    if (!limit) return res.send(products);
    let limitedProducts = products.filter(
      (product) => products.indexOf(product) < Number(limit)
    );
    res.send(limitedProducts);
  } catch (error) {
    res.send(error);
  }
});

ProductsRouter.get("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let product = await Manager.getProductById(productId);
    res.send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

ProductsRouter.post("/", async (req, res) => {
  try {
    let newProduct = req.body;
    let result = await Manager.addProduct(newProduct);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

ProductsRouter.put("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let newProduct = req.body;
    let result = await Manager.updateProduct(productId, newProduct);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

ProductsRouter.delete("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let result = await Manager.deleteProduct(productId);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default ProductsRouter;
