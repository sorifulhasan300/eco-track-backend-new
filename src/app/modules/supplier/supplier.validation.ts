import { z } from "zod";

const createSupplierValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    contact: z.string().min(1, "Contact is required"),
    email: z.string().email("Invalid email address"),
    category: z.string().min(1, "Category is required"),
    reliability: z.number().min(0, "Reliability must be at least 0").max(10, "Reliability cannot exceed 10").default(5.0),
    basePrice: z.number().positive("Base price must be positive").optional(),
    deliveryTime: z.string().min(1, "Delivery time is required").optional(),
  }),
});

const updateSupplierValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long").optional(),
    contact: z.string().min(1, "Contact is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    category: z.string().min(1, "Category is required").optional(),
    reliability: z.number().min(0, "Reliability must be at least 0").max(10, "Reliability cannot exceed 10").optional(),
    basePrice: z.number().positive("Base price must be positive").optional(),
    deliveryTime: z.string().min(1, "Delivery time is required").optional(),
  }),
});

export const SupplierValidations = {
  createSupplierValidationSchema,
  updateSupplierValidationSchema,
};