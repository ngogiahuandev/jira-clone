import authRoute from "@/routes/auth.route";
import userRoute from "@/routes/user.route";
import { Hono } from "hono";

const routes = new Hono();

routes.route("/auth", authRoute);
routes.route("/users", userRoute);

export default routes;
