import { db } from "@/db/drizzle";
import { users, type IUser } from "@repo/db-schema";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";
import * as jose from "jose";
import { env } from "@/env";
import type { JwtPayload } from "@repo/types";
import { createHash, randomBytes } from "crypto";
import { sha256 } from "hono/utils/crypto";
import { redis } from "@/redis";
import { setSignedCookie } from "hono/cookie";

export const authLib = {
  findUserByEmail: async (email: string): Promise<IUser | null> => {
    if (!email || !email.length) return null;

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      return user ?? null;
    } catch (error) {
      console.error(`Drizzle Error: ${error}`);
      throw new Error(`Failed to find user by email: ${email}`);
    }
  },

  hashPassword: async (password: string): Promise<string> => {
    return await argon2.hash(password);
  },

  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    return await argon2.verify(hash, password);
  },

  generateAccessToken: async (payload: JwtPayload): Promise<string> => {
    const token = await new jose.SignJWT({ payload })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(env.JWT_SECRET));

    return token;
  },

  verifyToken: async (token: string): Promise<JwtPayload> => {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(env.JWT_SECRET)
    );

    return payload as JwtPayload;
  },

  newRandomToken: (bytes = 32) => {
    return randomBytes(bytes).toString("hex");
  },

  sha256: (data: string) => {
    return createHash("sha256").update(data).digest("hex");
  },

  generateTokens: async (payload: JwtPayload) => {
    const accessToken = await authLib.generateAccessToken(payload);
    const refreshToken = authLib.sha256(authLib.newRandomToken());

    if (!accessToken || !refreshToken) {
      throw new Error("Failed to generate tokens");
    }
    return {
      accessToken,
      refreshToken,
    };
  },
};
