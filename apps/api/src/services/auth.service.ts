import { Context } from "hono";
import { loginSchema } from "@repo/validation";
import { authLib } from "@/lib/auth.lib";
import { redis } from "@/redis";
import { env } from "@/env";
import { setSignedCookie } from "hono/cookie";
import type { LoginResponse } from "@repo/types";

export const authService = {
  signIn: async (c: Context) => {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ success: false, message: parsed.error.flatten }, 400);
    }

    const { email, password } = parsed.data;
    const user = await authLib.findUserByEmail(email);
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    const isPasswordValid = await authLib.verifyPassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return c.json({ message: "Invalid password" }, 401);
    }

    const { accessToken, refreshToken } = await authLib.generateTokens({
      sub: user.id!,
      email: user.email!,
      role: user.role!,
    });

    await Promise.all([
      redis.set(
        `refresh:${refreshToken}`,
        refreshToken,
        "EX",
        env.REFRESH_TOKEN_TTL_SECONDS
      ),
      setSignedCookie(
        c,
        env.REFRESH_COOKIE_NAME,
        refreshToken,
        env.COOKIE_SECRET
      ),
    ]);

    const { password: _pw, ...userWithoutPassword } = user;

    return c.json<LoginResponse>({
      accessToken,
      user: userWithoutPassword,
    });
  },
};
