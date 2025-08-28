import { users } from "@repo/db-schema";
import type { SortableUserColumns } from "@repo/types";

export const userLib = {
  getSortColumn: (field: SortableUserColumns) => {
    switch (field) {
      case "id":
        return users.id;
      case "email":
        return users.email;
      case "name":
        return users.name;
      case "role":
        return users.role;
      case "slug":
        return users.slug;
      case "updatedAt":
        return users.updatedAt;
      case "createdAt":
        return users.createdAt;
    }
  },
};
