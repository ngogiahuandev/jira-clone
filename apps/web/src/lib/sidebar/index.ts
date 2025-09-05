import type { SidebarNavGroup } from "@/types/dashboard";
import type { IRole } from "@repo/db-schema";
import { adminSidebar } from "./admin.item";
import { regularSidebar } from "./regular.item";

export function getSidebarByRole(role: IRole): SidebarNavGroup[] {
  if (role === "admin") return adminSidebar;
  return regularSidebar;
}

export function isRoleAllowedForPath(path: string, role: IRole): boolean {
  const sidebar = getSidebarByRole(role);
  for (const group of sidebar) {
    for (const item of group.items) {
      if (item.href === path) return true;
    }
  }
  return false;
}
