import type { IUser } from "@repo/db-schema";

export type LoginResponse = {
  accessToken: string;
  user: Omit<IUser, "password">;
};
