import authRoute from "@/routes/auth.route";
import notificationRoute from "@/routes/notification.route";
import userRoute from "@/routes/user.route";
import { Hono } from "hono";

const routes = new Hono();

routes.route("/auth", authRoute);
routes.route("/users", userRoute);
routes.route("/notifications", notificationRoute);

export default routes;
