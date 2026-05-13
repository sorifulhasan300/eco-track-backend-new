import { z } from "zod";

const updateUserValidationSchema = z.object({
  body: z.object({
    role: z.enum(["ADMIN", "MANAGER", "STAFF"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
  }),
});

const updateUserProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    image: z.string().url().optional(),
  }),
});

export const UserValidations = {
  updateUserValidationSchema,
  updateUserProfileValidationSchema,
};