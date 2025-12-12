import {
  createCategorySchema,
  createSubCategorySchema,
  updateCategorySchema,
  updateSubCategorySchema,
} from "../config/zod.js";
import { validationErrors } from "../helper/errors.js";
import { Category } from "../models/Category.js";
import TryCatch from "../middlewares/TryCatch.js";
import { sanitize } from "../utils/sanitize.js";
import { Subcategory } from "../models/Subcategory.js";

// ============================================  Create Category  ============================================ //
export const createCategory = TryCatch(async (req, res) => {
  const sanitizeBody = sanitize(req.body);
  const validation = createCategorySchema.safeParse(sanitizeBody);
  if (!validation.success) {
    const zodError = validationErrors(validation.error);
    return res.status(400).json({
      status: false,
      message: zodError.message,
      errors: zodError,
    });
  }

  const { categoryName, categoryImg } = validation.data;

  const existingCategory = await Category.findOne({
    where: { categoryName },
  });

  if (existingCategory) {
    return res.status(409).json({
      status: false,
      message: "Category name already exists!",
    });
  }

  const category = await Category.create({
    categoryName,
    categoryImg,
  });

  return res.status(201).json({
    status: true,
    message: "Category created successfully",
    data: category,
  });
});

// ============================================  Get All-category  ============================================ //
export const allCategory = TryCatch(async (req, res) => {
  const categories = await Category.findAll({
    order: [["createdAt", "ASC"]],
  });

  return res.status(200).json({
    status: true,
    total: categories.length,
    message: "Categories fetched successfully.",
    data: categories,
  });
});

// ============================================  Get all products  ============================================ //
export const getActiveCategories = TryCatch(async (req, res) => {
  const categories = await Category.findAll({
    where: { status: true },
    order: [["createdAt", "ASC"]],
  });

  return res.status(200).json({
    status: true,
    total: categories.length,
    message: "Categories fetched successfully.",
    data: categories,
  });
});

// ============================================  Get category by ID  ============================================ //
export const categoryById = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid category ID!",
    });
  }

  const category = await Category.findByPk(id);

  if (!category) {
    return res.status(404).json({
      status: false,
      message: "Category not found!",
    });
  }

  return res.status(200).json({
    status: true,
    message: "Category fetched successfully.",
    data: category,
  });
});

// ============================================  Update category  ============================================ //
export const updateCategory = TryCatch(async (req, res) => {
  const sanitizeBody = sanitize(req.body);
  const validation = updateCategorySchema.safeParse(sanitizeBody);
  if (!validation.success) {
    const zodError = validationErrors(validation.error);
    return res.status(400).json({
      success: false,
      message: zodError.message,
      errors: zodError,
    });
  }

  const { id, categoryImg, categoryName } = validation.data;

  const existing = await Category.findByPk(id);
  if (!existing) {
    return res.status(404).json({
      status: false,
      message: "Category not found!",
    });
  }

  await existing.update({
    categoryImg,
    categoryName,
  });

  return res.status(200).json({
    status: true,
    message: "Category updated successfully.",
    data: existing,
  });
});

// ============================================  Update category status  ============================================ //
export const updateCategoryStatus = TryCatch(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);
  if (!category) {
    return res.status(404).json({
      status: false,
      message: "Category not found!",
    });
  }

  const newStatus = !category.status;
  await category.update({ status: newStatus });

  return res.status(200).json({
    status: true,
    message: `Category ${newStatus ? "activated" : "deactivated"}.`,
    data: { id: category.id, status: newStatus },
  });
});

// ============================================  Delete category  ============================================ //
export const deleteCategory = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid category ID!",
    });
  }

  const category = await Category.findByPk(id);

  if (!category) {
    return res.status(404).json({
      status: false,
      message: "Category not found!",
    });
  }

  await category.destroy();

  return res.status(200).json({
    status: true,
    message: "Category deleted successfully.",
  });
});

// ============================================  SubCategories  ============================================ //

// ============================================  Create subcategory  ============================================ //
export const createSubCategory = TryCatch(async (req, res) => {
  const sanitizeBody = sanitize(req.body);
  const validation = createSubCategorySchema.safeParse(sanitizeBody);

  if (!validation.success) {
    return res.status(400).json({
      status: false,
      message: "Validation failed!",
      errors: validationErrors(validation.error),
    });
  }

  const { categoryId, subcategory } = validation.data;

  const categoryExists = await Category.findByPk(categoryId);
  if (!categoryExists) {
    return res.status(404).json({
      status: false,
      message: "Category not found!",
    });
  }

  await Subcategory.create({
    categoryId,
    subcategory,
  });

  return res.status(201).json({
    status: true,
    message: "Subcategory created.",
    data: { categoryId, subcategory },
  });
});

// ============================================  Get subcategories by category ID  ============================================ //
export const getSubcategoriesByCategoryId = TryCatch(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId || isNaN(categoryId)) {
    return res.status(400).json({
      status: false,
      message: "Invalid category ID!",
    });
  }

  const category = await Category.findByPk(categoryId);
  if (!category) {
    return res.status(404).json({
      status: false,
      message: "Category not found!",
    });
  }

  const subcategories = await Subcategory.findAll({
    where: {
      categoryId,
    },
    order: [["subcategory", "ASC"]],
  });

  return res.status(200).json({
    status: true,
    message: "Subcategories retrieved successfully",
    data: subcategories,
  });
});

// ============================================  Get subcategory by ID  ============================================ //
export const subcategoryById = TryCatch(async (req, res) => {
  const { id } = req.params;

  const subcategory = await Subcategory.findByPk(id);

  if (!subcategory) {
    return res.status(404).json({
      status: false,
      message: "Subcategory not found!",
    });
  }

  return res.status(200).json({
    status: true,
    message: "Subcategory fetched successfully.",
    data: subcategory,
  });
});

// ============================================  Update subcategory  ============================================ //
export const updateSubcategory = TryCatch(async (req, res) => {
  const sanitizeBody = sanitize(req.body);
  const validation = updateSubCategorySchema.safeParse(sanitizeBody);
  if (!validation.success) {
    const zodError = validationErrors(validation.error);
    return res.status(400).json({
      status: false,
      message: zodError.message,
      errors: zodError,
    });
  }

  const { id, categoryId, subcategory } = validation.data;

  const existing = await Subcategory.findByPk(id);
  if (!existing) {
    return res.status(404).json({
      status: false,
      message: "Subcategory not found!",
    });
  }

  await existing.update({
    categoryId,
    subcategory,
    status: existing.status,
  });

  return res.status(200).json({
    status: true,
    message: "Subcategory updated successfully.",
    data: existing,
  });
});

// ============================================  Update subcategory status  ============================================ //
export const updateSubcategoryStatus = TryCatch(async (req, res) => {
  const { id } = req.params;

  const subcategory = await Subcategory.findByPk(id);
  if (!subcategory) {
    return res.status(404).json({
      status: false,
      message: "Subcategory not found!",
    });
  }

  const newStatus = !subcategory.status;
  await subcategory.update({ status: newStatus });

  return res.status(200).json({
    status: true,
    message: `Subcategory ${newStatus ? "activated" : "deactivated"}.`,
    data: { id: subcategory.id, status: newStatus },
  });
});

// ============================================  Delete subcategory  ============================================ //
export const deleteSubcategory = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid subcategory ID!",
    });
  }

  const subcategory = await Subcategory.findByPk(id);

  if (!subcategory) {
    return res.status(404).json({
      status: false,
      message: "Subcategory not found!",
    });
  }

  await subcategory.destroy();

  return res.status(200).json({
    status: true,
    message: "Subcategory deleted successfully.",
  });
});
