import type { SidebarNavGroup, SidebarNavItem } from "@/types/dashboard";
import type { IRole } from "@repo/db-schema";
import {
  BarChart3,
  Bean,
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
  Zap,
} from "lucide-react";

export interface MenuItem extends SidebarNavItem {
  id: string;
  order: number;
}

export interface MenuGroup extends Omit<SidebarNavGroup, "items"> {
  id: string;
  items: MenuItem[];
  order: number;
}

const baseMenuItems: Record<string, MenuItem> = {
  dashboard: {
    id: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    order: 1,
  },
  analytics: {
    id: "analytics",
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    badge: "New",
    order: 2,
  },
  users: {
    id: "users",
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    permission: "user",
    order: 1,
  },
  projects: {
    id: "projects",
    title: "Projects",
    href: "/dashboard/projects",
    icon: FileText,
    permission: "project",
    order: 2,
  },
  calendar: {
    id: "calendar",
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    permission: "calendar",
    order: 3,
  },
  messages: {
    id: "messages",
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    permission: "messages",
    order: 4,
  },
  notifications: {
    id: "notifications",
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    permission: "notifications",
    order: 1,
  },
  billing: {
    id: "billing",
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    permission: "billing",
    order: 2,
  },
  integrations: {
    id: "integrations",
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: Zap,
    permission: "integrations",
    order: 3,
  },
  settings: {
    id: "settings",
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    permission: "settings",
    order: 4,
  },
  seeds: {
    id: "seeds",
    title: "Seeds",
    href: "/dashboard/seeds",
    icon: Bean,
    permission: "seeds",
    order: 5,
  },
};

const menuGroups: readonly MenuGroup[] = [
  {
    id: "overview",
    title: "Overview",
    order: 1,
    items: [baseMenuItems.dashboard, baseMenuItems.analytics],
  },
  {
    id: "management",
    title: "Management",
    order: 2,
    items: [
      baseMenuItems.users,
      baseMenuItems.projects,
      baseMenuItems.calendar,
      baseMenuItems.messages,
    ],
  },
  {
    id: "tools",
    title: "Tools",
    order: 3,
    items: [
      baseMenuItems.notifications,
      baseMenuItems.billing,
      baseMenuItems.integrations,
      baseMenuItems.settings,
      baseMenuItems.seeds,
    ],
  },
] as const;

const rolePermissions = new Map<IRole, Set<string>>([
  [
    "admin",
    new Set([
      "user",
      "project",
      "calendar",
      "messages",
      "notifications",
      "billing",
      "integrations",
      "settings",
      "seeds",
    ]),
  ],
  ["regular", new Set(["project", "calendar", "messages", "notifications"])],
]);

const defaultPermissions = new Set<string>();

export function getSidebarByRole(role: IRole): readonly SidebarNavGroup[] {
  const permissions = rolePermissions.get(role) ?? defaultPermissions;

  return menuGroups
    .map((group) => ({
      title: group.title,
      items: group.items
        .filter((item) => !item.permission || permissions.has(item.permission))
        .sort((a, b) => a.order - b.order)
        .map(({ id, order, ...item }) => item),
    }))
    .filter((group) => group.items.length > 0)
    .sort((a, b) => {
      const aGroup = menuGroups.find((g) => g.title === a.title);
      const bGroup = menuGroups.find((g) => g.title === b.title);
      return (aGroup?.order ?? 0) - (bGroup?.order ?? 0);
    });
}

export function insertMenuItem(
  targetGroupId: string,
  newItem: MenuItem,
  position?: "start" | "end" | number
): MenuGroup[] {
  const updatedGroups = menuGroups.map((group) => {
    if (group.id === targetGroupId) {
      const newItems = [...group.items];

      if (position === "start") {
        newItems.unshift(newItem);
      } else if (position === "end") {
        newItems.push(newItem);
      } else if (typeof position === "number") {
        newItems.splice(position, 0, newItem);
      } else {
        newItems.push(newItem);
      }

      return { ...group, items: newItems };
    }
    return group;
  });

  return updatedGroups;
}

export function insertMenuGroup(
  newGroup: MenuGroup,
  position?: "start" | "end" | number
): MenuGroup[] {
  const newGroups = [...menuGroups];

  if (position === "start") {
    newGroups.unshift(newGroup);
  } else if (position === "end") {
    newGroups.push(newGroup);
  } else if (typeof position === "number") {
    newGroups.splice(position, 0, newGroup);
  } else {
    newGroups.push(newGroup);
  }

  return newGroups;
}

export function insertMenuItemBetween(
  targetGroupId: string,
  beforeItemId: string,
  afterItemId: string,
  newItem: MenuItem
): MenuGroup[] {
  const updatedGroups = menuGroups.map((group) => {
    if (group.id === targetGroupId) {
      const newItems = [...group.items];
      const beforeIndex = newItems.findIndex(
        (item) => item.id === beforeItemId
      );
      const afterIndex = newItems.findIndex((item) => item.id === afterItemId);

      if (beforeIndex !== -1 && afterIndex !== -1) {
        const insertIndex = Math.min(beforeIndex, afterIndex) + 1;
        newItems.splice(insertIndex, 0, newItem);
      }

      return { ...group, items: newItems };
    }
    return group;
  });

  return updatedGroups;
}

export function getMenuItemById(itemId: string): MenuItem | undefined {
  for (const group of menuGroups) {
    const item = group.items.find((item) => item.id === itemId);
    if (item) return item;
  }
  return undefined;
}

export function getMenuGroupById(groupId: string): MenuGroup | undefined {
  return menuGroups.find((group) => group.id === groupId);
}

export function addBadgeToItem(
  itemId: string,
  badge: string | number
): MenuGroup[] {
  return menuGroups.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.id === itemId ? { ...item, badge } : item
    ),
  }));
}

export function removeBadgeFromItem(itemId: string): MenuGroup[] {
  return menuGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const { badge, ...itemWithoutBadge } = item;
      return item.id === itemId ? itemWithoutBadge : item;
    }),
  }));
}

export function updateItemBadge(
  itemId: string,
  badge: string | number | null
): MenuGroup[] {
  if (badge === null) {
    return removeBadgeFromItem(itemId);
  }
  return addBadgeToItem(itemId, badge);
}

export { baseMenuItems, menuGroups };
