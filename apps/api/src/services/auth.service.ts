import { env } from "@/env";
import { authLib } from "@/lib/auth.lib";
import { setRefreshCookie } from "@/lib/cookie";
import { redis } from "@/redis";
import type { LoginResponse } from "@repo/types";
import { loginSchema } from "@repo/validation";
import { Context } from "hono";

export const authService = {
  signIn: async (c: Context) => {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ message: parsed.error.issues }, 400);
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
        `refresh:${user.id!}`,
        refreshToken,
        "EX",
        env.REFRESH_TOKEN_TTL_SECONDS
      ),
      setRefreshCookie(c, {
        uuid: user.id!,
        refreshToken,
      }),
    ]);

    const { password: _pw, ...userWithoutPassword } = user;

    return c.json<LoginResponse>({
      accessToken,
      user: userWithoutPassword,
    });
  },
};
