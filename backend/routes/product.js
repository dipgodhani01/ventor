import express from "express";
import { isAdminAuth } from "../middlewares/isAdminAuth.js";
import { verifyCSRFToken } from "../middlewares/csrf.js";
import {
  allProducts,
  createProduct,
  deleteProduct,
  getActiveProducts,
  productById,
  updateProduct,
  updateProductStatus,
} from "../controllers/product.js";

const router = express.Router();

// For Admins
router.post("/product/create", isAdminAuth, verifyCSRFToken, createProduct);
router.get("/product/all", allProducts);
router.get("/product/:id", productById);
router.put("/product/update", isAdminAuth, verifyCSRFToken, updateProduct);
router.put(
  "/product/status/:id",
  isAdminAuth,
  verifyCSRFToken,
  updateProductStatus
);
router.delete(
  "/product/delete/:id",
  isAdminAuth,
  verifyCSRFToken,
  deleteProduct
);

// For Users
router.get("/products", getActiveProducts);

export default router;
