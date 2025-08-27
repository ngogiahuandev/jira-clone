import { env } from "@/env";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schemas";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, {
  schema,
  casing: "snake_case",
  logger: true,
});
