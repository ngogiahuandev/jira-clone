import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { env } from "./env";
import routes from "@/routes";
import { cors } from "hono/cors";

const app = new Hono();
app.use(logger());
app.use(cors());

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
