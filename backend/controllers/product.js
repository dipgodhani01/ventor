import { createProductSchema, updateProductSchema } from "../config/zod.js";
import { validationErrors } from "../helper/errors.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { sanitize } from "../utils/sanitize.js";

// ============================================  Create Product  ============================================ //
export const createProduct = TryCatch(async (req, res) => {
  const sanitizeBody = sanitize(req.body);
  const validation = createProductSchema.safeParse(sanitizeBody);
  if (!validation.success) {
    const zodError = validationErrors(validation.error);
    return res.status(400).json({
      status: false,
      message: zodError.message,
      errors: zodError,
    });
  }

  const { thumbnail, images, productName, categoryId } = validation.data;

  await Product.create({
    productName,
    thumbnail,
    images,
    categoryId,
  });

  return res.status(201).json({
    status: true,
    message: "Product created.",
  });
});

// ============================================  Get all products  ============================================ //
export const allProducts = TryCatch(async (req, res) => {
  const products = await Product.findAll({
    include: [
      {
        model: Category,
        attributes: ["categoryName"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return res.status(200).json({
    status: true,
    total: products.length,
    message: "Products fetched successfully.",
    data: products,
  });
});

// ============================================  Get all products  ============================================ //
export const getActiveProducts = TryCatch(async (req, res) => {
  const products = await Product.findAll({
    where: { status: true },
    order: [["createdAt", "ASC"]],
  });

  return res.status(200).json({
    status: true,
    total: products.length,
    message: "Products fetched successfully.",
    data: products,
  });
});

// ============================================  Get product by ID  ============================================ //
export const productById = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid product ID!",
    });
  }

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      status: false,
      message: "Product not found!",
    });
  }

  return res.status(200).json({
    status: true,
    message: "Product fetched successfully.",
    data: product,
  });
});

// ============================================  Update product  ============================================ //
export const updateProduct = TryCatch(async (req, res) => {
  const sanitizeBody = sanitize(req.body);
  const validation = updateProductSchema.safeParse(sanitizeBody);
  if (!validation.success) {
    const zodError = validationErrors(validation.error);
    return res.status(400).json({
      status: false,
      message: zodError.message,
      errors: zodError,
    });
  }

  const { id, thumbnail, images, productName, categoryId } = validation.data;

  const existing = await Product.findByPk(id);
  if (!existing) {
    return res.status(404).json({
      status: false,
      message: "Product not found!",
    });
  }

  await existing.update({
    thumbnail,
    images,
    productName,
    categoryId,
  });

  return res.status(200).json({
    status: true,
    message: "Product updated successfully.",
    data: existing,
  });
});

// ============================================  Update product status  ============================================ //
export const updateProductStatus = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid product ID!",
    });
  }

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({
      status: false,
      message: "Product not found!",
    });
  }

  const newStatus = !product.status;
  await product.update({ status: newStatus });

  return res.status(200).json({
    status: true,
    message: `Product ${newStatus ? "activated" : "deactivated"}.`,
    data: { id: product.id, status: newStatus },
  });
});

// ============================================  Delete product  ============================================ //
export const deleteProduct = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid product ID!",
    });
  }

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      status: false,
      message: "Product not found!",
    });
  }

  await product.destroy();

  return res.status(200).json({
    status: true,
    message: "Product deleted successfully.",
  });
});
