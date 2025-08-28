import { IRole } from "@repo/db-schema";

export type JwtPayload = {
  sub: string;
  email: string;
  role: IRole;
};
