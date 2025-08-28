import { env } from "@/env";
import { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";

interface SetCookieData {
  uuid: string;
  refreshToken: string;
}

export const setRefreshCookie = (c: Context, data: SetCookieData) => {
  return Promise.all([
    setSignedCookie(c, "refreshToken", data.refreshToken, env.COOKIE_SECRET),
    setSignedCookie(c, "uuid", data.uuid, env.COOKIE_SECRET),
  ]);
};

export const getRefreshCookie = async (c: Context) => {
  const [userId, refreshToken] = await Promise.all([
    getSignedCookie(c, env.COOKIE_SECRET, "uuid"),
    getSignedCookie(c, env.COOKIE_SECRET, "refreshToken"),
  ]);

  return { userId, refreshToken };
};
