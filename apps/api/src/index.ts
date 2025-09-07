import routes from "@/routes";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env";

const app = new Hono();
app.use(logger());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["X-Total-Count", "X-Page", "X-Limit"],
    credentials: true,
  })
);

app.route("/api", routes);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
