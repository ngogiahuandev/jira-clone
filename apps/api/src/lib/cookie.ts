import { env } from "@/env";
import { Context } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";

interface SetCookieData {
  uuid: string;
  refreshToken: string;
  maxAgeSeconds?: number;
}

export const setRefreshCookie = (c: Context, data: SetCookieData) => {
  const options =
    typeof data.maxAgeSeconds === "number"
      ? { maxAge: data.maxAgeSeconds }
      : undefined;

  return Promise.all([
    setSignedCookie(
      c,
      "refreshToken",
      data.refreshToken,
      env.COOKIE_SECRET,
      options
    ),
    setSignedCookie(c, "uuid", data.uuid, env.COOKIE_SECRET, options),
  ]);
};

export const getRefreshCookie = async (c: Context) => {
  const [userId, refreshToken] = await Promise.all([
    getSignedCookie(c, env.COOKIE_SECRET, "uuid"),
    getSignedCookie(c, env.COOKIE_SECRET, "refreshToken"),
  ]);

  return { userId, refreshToken };
};

export const deleteRefreshCookie = (c: Context) => {
  return Promise.all([
    deleteCookie(c, "uuid"),
    deleteCookie(c, "refreshToken"),
  ]);
};
