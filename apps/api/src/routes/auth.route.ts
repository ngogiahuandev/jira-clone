import { authService } from "@/services/auth.service";
import { Hono } from "hono";

const authRoute = new Hono();

authRoute.post("/sign-in", authService.signIn);

export default authRoute;
