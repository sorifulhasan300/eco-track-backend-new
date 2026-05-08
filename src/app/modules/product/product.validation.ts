import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .max(255, "Title is too long"),

    description: z
      .string()
      .min(10, "Description should be at least 10 characters long"),

    image: z.string().url("Invalid image URL"),

    price: z.number().positive("Price must be a positive number"),

    stockLevel: z
      .number()
      .int("Stock level must be an integer")
      .nonnegative("Stock cannot be negative")
      .default(0),

    location: z.string().min(2, "Location is too short"),

    category: z.string().min(1, "Category is required"),

    supplierId: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .max(255, "Title is too long")
      .optional(),

    description: z
      .string()
      .min(10, "Description should be at least 10 characters long")
      .optional(),

    image: z.string().url("Invalid image URL").optional(),

    price: z.number().positive("Price must be a positive number").optional(),

    stockLevel: z
      .number()
      .int("Stock level must be an integer")
      .nonnegative("Stock cannot be negative")
      .optional(),

    location: z.string().min(2, "Location is too short").optional(),

    category: z.string().min(1, "Category is required").optional(),

    supplierId: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
