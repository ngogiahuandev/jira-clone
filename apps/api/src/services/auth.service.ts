import { Context } from "hono";
import { loginSchema } from "@repo/validation";
import { authLib } from "@/lib/auth.lib";

export const authService = {
  signIn: async (c: Context) => {
    const body = await c.req.json();

    const { success, data, error } = loginSchema.safeParse(body);

    if (!success) {
      return c.json(
        {
          success: false,
          message: error.flatten,
        },
        400
      );
    }

    const user = await authLib.findUserByEmail(data.email);
    if (!user) {
      return c.json(
        {
          message: "User not found",
        },
        404
      );
    }

    const isPasswordValid = await authLib.verifyPassword(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      return c.json(
        {
          message: "Invalid password",
        },
        401
      );
    }
  },
};
