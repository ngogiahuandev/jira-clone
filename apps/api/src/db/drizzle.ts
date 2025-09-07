import { env } from "@/env";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db-schema";
import { reset } from "drizzle-seed";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, {
  schema,
  casing: "snake_case",
});

export const resetDb = async () => {
  console.log("Resetting database...");
  try {
    await reset(db, schema);
    console.log("Database reset complete");
  } catch (error) {
    console.error("Failed to reset database:", error);
    throw error;
  }
};
