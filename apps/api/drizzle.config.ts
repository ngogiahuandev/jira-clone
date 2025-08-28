import type { Config } from "drizzle-kit";
import { env } from "process";

export default {
  schema: "../../packages/db-schema/src/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
} satisfies Config;
