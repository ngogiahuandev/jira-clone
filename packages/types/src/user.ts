import type { IUser } from "@repo/db-schema";

export type SortableUserColumns =
  | "id"
  | "email"
  | "name"
  | "role"
  | "slug"
  | "createdAt"
  | "updatedAt";

export type SortOrder = "asc" | "desc";

export interface UserSortOptions {
  sortBy: SortableUserColumns;
  order: SortOrder;
}

export type GetAllUsersResponse = Omit<IUser, "password">[];

export type CreateUserResponse = Omit<IUser, "password">;
