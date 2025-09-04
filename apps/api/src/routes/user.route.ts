import { adminMiddleware } from "@/middleware/admin.mw";
import { bearerMiddleware } from "@/middleware/bearer.mw";
import { userService } from "@/services/user.service";
import { Hono } from "hono";

const userRoute = new Hono();

userRoute.get("/", bearerMiddleware, adminMiddleware, userService.findAllUsers);
userRoute.post("/", bearerMiddleware, adminMiddleware, userService.createUser);
userRoute.patch(
  "/:id",
  bearerMiddleware,
  adminMiddleware,
  userService.updateUser
);
userRoute.delete(
  "/:id",
  bearerMiddleware,
  adminMiddleware,
  userService.deleteUser
);

export default userRoute;
