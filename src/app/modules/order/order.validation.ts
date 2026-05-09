import { z } from "zod";

const createOrderValidationSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().uuid("Invalid product ID"),
          quantity: z.number().int().positive("Quantity must be at least 1"),
        }),
      )
      .min(1, "At least one item is required"),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
};
