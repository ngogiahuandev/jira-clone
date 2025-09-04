import { IRole } from "@repo/db-schema";

export const roles: { label: string; value: IRole }[] = [
  {
    label: "Regular",
    value: "regular",
  },
  {
    label: "Admin",
    value: "admin",
  },
];
