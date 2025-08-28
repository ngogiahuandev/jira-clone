import { bearerMiddleware } from "@/middleware/bearer";
import { authService } from "@/services/auth.service";
import { Hono } from "hono";

const authRoute = new Hono();

authRoute.post("/sign-in", authService.signIn);
authRoute.post("/sign-up", authService.signUp);
authRoute.post("/sign-out", authService.signOut);
authRoute.get("/me", bearerMiddleware, authService.me);
authRoute.post("/rotate-tokens", authService.rotateTokens);

export default authRoute;
