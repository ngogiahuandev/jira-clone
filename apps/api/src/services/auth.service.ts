import { db } from "@/db/drizzle";
import { env } from "@/env";
import { authLib } from "@/lib/auth.lib";
import {
  deleteRefreshCookie,
  getRefreshCookie,
  setRefreshCookie,
} from "@/lib/cookie";
import { slugify } from "@/lib/slugify";
import { getRemainingTtlSeconds, redis } from "@/redis";
import { Get } from "@/types/middleware";
import { users } from "@repo/db-schema";
import type {
  JwtPayload,
  MeResponse,
  RotateTokensResponse,
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
} from "@repo/types";
import { signInSchema, signUpSchema } from "@repo/validation";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

export const authService = {
  signIn: async (c: Context) => {
    const body = await c.req.json();
    const parsed = signInSchema.safeParse(body);

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

    return c.json<SignInResponse>({
      accessToken,
      user: userWithoutPassword,
    });
  },
  signUp: async (c: Context) => {
    const body = await c.req.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ message: parsed.error.issues }, 400);
    }

    const { email, name, password } = parsed.data;

    const existingUser = await authLib.findUserByEmail(email);

    if (existingUser) {
      return c.json({ message: "User already exists" }, 409);
    }

    const hashedPassword = await authLib.hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        password: hashedPassword,
        slug: slugify(name),
      })
      .returning();

    if (!newUser) {
      return c.json({ message: "Failed to create user" }, 500);
    }

    const { accessToken, refreshToken } = await authLib.generateTokens({
      sub: newUser.id!,
      email: newUser.email!,
      role: newUser.role!,
    });

    await Promise.all([
      redis.set(
        `refresh:${newUser.id!}`,
        refreshToken,
        "EX",
        env.REFRESH_TOKEN_TTL_SECONDS
      ),
      setRefreshCookie(c, { uuid: newUser.id!, refreshToken }),
    ]);

    const { password: _pw, ...userWithoutPassword } = newUser;

    return c.json<SignUpResponse>({
      accessToken,
      user: userWithoutPassword,
    });
  },
  signOut: async (c: Context) => {
    const { userId } = await getRefreshCookie(c);
    if (!userId) {
      return c.json({ message: "User not found" }, 404);
    }
    await Promise.all([redis.del(`refresh:${userId}`), deleteRefreshCookie(c)]);
    return c.json<SignOutResponse>({ message: "Signed out successfully" });
  },
  me: async (c: Context) => {
    const tokenPayload = c.get("tokenPayload") as Get<JwtPayload>;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, tokenPayload.payload.sub))
      .limit(1);

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    const { password: _pw, ...userWithoutPassword } = user;

    return c.json<MeResponse>({ user: userWithoutPassword });
  },
  rotateTokens: async (c: Context) => {
    const { userId, refreshToken } = await getRefreshCookie(c);

    if (!userId || !refreshToken) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const redisRefreshToken = await redis.get(`refresh:${userId}`);

    if (redisRefreshToken !== refreshToken) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await authLib.generateTokens({
        sub: userId,
        email: user.email!,
        role: user.role!,
      });

    const ttlSeconds = await getRemainingTtlSeconds(
      `refresh:${userId}`,
      env.REFRESH_TOKEN_TTL_SECONDS
    );

    await Promise.all([
      redis.set(`refresh:${userId}`, newRefreshToken, "EX", ttlSeconds),
      setRefreshCookie(c, {
        uuid: userId,
        refreshToken: newRefreshToken,
        maxAgeSeconds: ttlSeconds,
      }),
    ]);

    const { password: _pw, ...userWithoutPassword } = user;

    return c.json<RotateTokensResponse>({
      accessToken,
      user: userWithoutPassword,
    });
  },
};
