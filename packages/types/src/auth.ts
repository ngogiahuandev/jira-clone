import type { IUser } from "@repo/db-schema";

export type SignInResponse = {
  accessToken: string;
  user: Omit<IUser, "password">;
};

export type SignUpResponse = SignInResponse;
export type MeResponse = {
  user: Omit<IUser, "password">;
};
export type SignOutResponse = {
  message: string;
};

export type RotateTokensResponse = {
  accessToken: string;
};
