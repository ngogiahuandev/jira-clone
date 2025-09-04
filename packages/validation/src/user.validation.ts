import { roles } from "@repo/db-schema";
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  password: z.string().min(6, "Password must be at least 8 characters long"),
  role: z.enum(roles.enumValues),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  password: z.string().optional(),
  role: z.enum(roles.enumValues).optional(),
  isActive: z.boolean().optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters long").optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
