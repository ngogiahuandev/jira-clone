import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL_SECONDS: z.coerce.number(),
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production"]),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
