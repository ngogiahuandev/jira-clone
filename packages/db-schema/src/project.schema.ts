import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type IProject = typeof projects.$inferSelect;
