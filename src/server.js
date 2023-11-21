import express from "express";
import ProductsRouter from "./routers/products.routes.js";
import CartsRouter from "./routers/carts.routes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", ProductsRouter);
app.use("/api/carts", CartsRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
