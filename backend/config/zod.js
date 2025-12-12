import { z } from "zod";

// Admin Schema
export const createAdminSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 character long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Passwrd must be at least 6 character long"),
  role: z.string("Role is required"),
});
export const adminLoginSchema = z.object({
  email: z.string("Email is required!").email("Invalid email format"),
  password: z
    .string("Password is required!")
    .min(6, "Passwrd must be at least 6 character long"),
});

// Category Schema
export const createCategorySchema = z.object({
  categoryName: z
    .string()
    .min(3, "Category name must be at least 3 character long"),
  categoryImg: z.string("Category image is required!"),
});
export const updateCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  categoryName: z
    .string()
    .min(3, "Category name must be at least 3 character long"),
  categoryImg: z.string("Category image is required!"),
});

// Subcategory Schema
export const createSubCategorySchema = z.object({
  categoryId: z.number().int(),
  subcategory: z.string().min(2, "Subcategory name required"),
});
export const updateSubCategorySchema = z.object({
  id: z.string(),
  categoryId: z.number().int(),
  subcategory: z.string().min(2),
  status: z.boolean().optional(),
});

// Product Schema
export const createProductSchema = z.object({
  thumbnail: z
    .string("Thumbnail is required!")
    .min(1, "Thumbnail is required!"),
  images: z
    .array(z.string().min(1, "Invalid image"))
    .min(1, "At least 1 product image is required!"),
  productName: z
    .string("Product name is required!")
    .min(3, "Product name must be at least 3 character long"),
  categoryId: z.number().int(),
  status: z.boolean().optional(),
});
export const updateProductSchema = z.object({
  id: z.string().min(1, "product ID is required"),
  thumbnail: z
    .string("Thumbnail is required!")
    .min(1, "Thumbnail is required!"),
  images: z
    .array(z.string().min(1, "Invalid image"))
    .min(1, "At least 1 product image is required!"),
  productName: z
    .string("Product name is required!")
    .min(3, "Product name must be at least 3 character long"),
  categoryId: z.number().int(),
});

// User Schema
export const registerUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 character long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Passwrd must be at least 6 character long"),
  role: z.string("Role is required"),
});
export const loginUserSchema = z.object({
  email: z.string("Email is required!").email("Invalid email format"),
  password: z
    .string("Password is required!")
    .min(6, "Passwrd must be at least 6 character long"),
});
