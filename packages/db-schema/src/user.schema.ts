import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roles = pgEnum("roles", ["admin", "regular"]);
export type IRole = (typeof roles.enumValues)[number];

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: roles("role").notNull().default("regular"),
  imageUrl: text("image_url").default(""),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
export type IUser = typeof users.$inferInsert;
