import { authLib } from "@/lib/auth.lib";
import type { Context, MiddlewareHandler, Next } from "hono";

export const bearerMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next
) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const verify = await authLib.verifyToken(token);
    c.set("tokenPayload", { ...verify });
    await next();
  } catch (error) {
    console.log(error);
    return c.json({ message: "Unauthorized" }, 401);
  }
};
