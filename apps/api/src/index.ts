import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { env } from "./env";
import { db } from "@/db/drizzle";
import { users } from "@repo/db-schema";
import { loginSchema } from "@repo/validation";

const app = new Hono();
app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const user = await db.select().from(users);
console.log(user);
console.log(
  loginSchema.safeParse({ email: "test@test.com", password: "test" })
);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
