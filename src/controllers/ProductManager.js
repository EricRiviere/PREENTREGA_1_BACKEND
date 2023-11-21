import fs from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
    if (fs.existsSync(this.path)) {
      let products = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(products);
    } else {
      this.products = [];
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"));
    }
  }

  writeProducts = async (products) => {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
  };

  readProducts = async () => {
    let products = await fs.promises.readFile(this.path, "utf-8");
    this.products = JSON.parse(products);
    return this.products;
  };

  getProducts = async () => {
    let products = await this.readProducts();
    return products;
  };

  addProduct = async ({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  }) => {
    let products = await this.readProducts();
    let existingProduct = products.find((prod) => prod.code === code);
    if (existingProduct) {
      throw new Error("Repeated product code");
    } else {
      let productId = nanoid(10);
      let NewProduct = {
        id: productId,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      };
      products.push(NewProduct);
      await this.writeProducts(products);
      return {
        message: "Product added to product list",
        NewProduct,
      };
    }
  };

  findProductById = async (id) => {
    let products = await this.readProducts();
    let product = products.find((prod) => prod.id === id);
    return product;
  };

  getProductById = async (id) => {
    let productById = await this.findProductById(id);
    if (!productById) {
      throw new Error("Product not found");
    } else {
      return productById;
    }
  };

  updateProduct = async (id, updateData) => {
    let productToUpdate = await this.findProductById(id);
    if (!productToUpdate) {
      throw new Error("Product not found");
    } else {
      for (const key in updateData) {
        if (Object.prototype.hasOwnProperty.call(updateData, key)) {
          productToUpdate[key] = updateData[key];
        } else {
          throw new Error("Invalid property");
        }
      }
      let products = await this.readProducts();
      let oldProducts = products.filter((prod) => prod.id !== id);
      let updatedProducts = [...oldProducts, { id, ...productToUpdate }];
      await this.writeProducts(updatedProducts);
      return {
        message: "Product updated",
        productToUpdate,
      };
    }
  };

  deleteProduct = async (id) => {
    let productToDelete = await this.findProductById(id);
    if (!productToDelete) {
      throw new Error("Product not found");
    } else {
      let products = await this.readProducts();
      let newProducts = products.filter((product) => product.id !== id);
      await this.writeProducts(newProducts);
      return {
        message: "Product deleted",
      };
    }
  };
}

export default ProductManager;
