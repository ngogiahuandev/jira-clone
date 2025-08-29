import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

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
    setCookie(c, "refreshToken", data.refreshToken, options),
    setCookie(c, "uuid", data.uuid, options),
  ]);
};

export const getRefreshCookie = async (c: Context) => {
  const [userId, refreshToken] = await Promise.all([
    getCookie(c, "uuid"),
    getCookie(c, "refreshToken"),
  ]);

  console.log("userId", userId);
  console.log("refreshToken", refreshToken);

  return { userId, refreshToken };
};

export const deleteRefreshCookie = (c: Context) => {
  return Promise.all([
    deleteCookie(c, "uuid"),
    deleteCookie(c, "refreshToken"),
  ]);
};
