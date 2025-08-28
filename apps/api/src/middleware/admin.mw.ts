import { Get } from "@/types/middleware";
import type { JwtPayload } from "@repo/types";
import type { Context, MiddlewareHandler, Next } from "hono";

export const adminMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next
) => {
  const tokenPayload = c.get("tokenPayload") as Get<JwtPayload>;

  if (!tokenPayload) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  if (tokenPayload.payload.role !== "admin") {
    return c.json({ message: "Unauthorized" }, 401);
  }

  await next();
};
