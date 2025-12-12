import express from "express";
import { verifyCSRFToken } from "../middlewares/csrf.js";
import {
  allCategory,
  categoryById,
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubcategory,
  getActiveCategories,
  getSubcategoriesByCategoryId,
  subcategoryById,
  updateCategory,
  updateCategoryStatus,
  updateSubcategory,
  updateSubcategoryStatus,
} from "../controllers/category.js";
import { isAdminAuth } from "../middlewares/isAdminAuth.js";

const router = express.Router();

router.post("/category/create", isAdminAuth, verifyCSRFToken, createCategory);
router.get("/category/all", allCategory);
router.get("/category/:id", categoryById);
router.put("/category/update", isAdminAuth, verifyCSRFToken, updateCategory);
router.put(
  "/category/status/:id",
  isAdminAuth,
  verifyCSRFToken,
  updateCategoryStatus
);
router.delete(
  "/category/delete/:id",
  isAdminAuth,
  verifyCSRFToken,
  deleteCategory
);
router.post(
  "/subcategory/create",
  isAdminAuth,
  verifyCSRFToken,
  createSubCategory
);
router.get("/subcategory/all/:categoryId", getSubcategoriesByCategoryId);
router.get("/subcategory/:id", subcategoryById);
router.put(
  "/subcategory/update",
  isAdminAuth,
  verifyCSRFToken,
  updateSubcategory
);
router.put(
  "/subcategory/status/:id",
  isAdminAuth,
  verifyCSRFToken,
  updateSubcategoryStatus
);
router.delete(
  "/subcategory/delete/:id",
  isAdminAuth,
  verifyCSRFToken,
  deleteSubcategory
);
router.get("/categories", getActiveCategories);

export default router;
