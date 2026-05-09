import { z } from "zod";

const updateUserValidationSchema = z.object({
  body: z.object({
    role: z.enum(["ADMIN", "MANAGER", "STAFF"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
  }),
});

export const UserValidations = {
  updateUserValidationSchema,
};