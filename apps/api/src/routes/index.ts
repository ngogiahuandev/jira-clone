import authRoute from "@/routes/auth.route";
import { Hono } from "hono";

const routes = new Hono();

routes.route("/auth", authRoute);

export default routes;
