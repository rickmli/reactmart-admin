import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  deleteAllProducts,
  seedProducts,
} from "../controller/productController.js";

const router = express.Router();

router.get("/:id", getProduct);
router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.delete("/", deleteAllProducts);

// seeding Products
router.post("/seedProducts", seedProducts);

export default router;
