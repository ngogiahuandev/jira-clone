import type { SidebarNavGroup } from "@/types/dashboard";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  Bell,
  CreditCard,
  MessageSquare,
  Zap,
  Bean,
} from "lucide-react";

export const defaultSidebarNavigation: SidebarNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        badge: "New",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
        badge: 12,
        permission: "user",
      },
      {
        title: "Projects",
        href: "/dashboard/projects",
        icon: FileText,
        permission: "project",
      },
      {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
        permission: "calendar",
      },
      {
        title: "Messages",
        href: "/dashboard/messages",
        icon: MessageSquare,
        badge: 3,
        permission: "messages",
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        permission: "notifications",
      },
      {
        title: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
        permission: "billing",
      },
      {
        title: "Integrations",
        href: "/dashboard/integrations",
        icon: Zap,
        permission: "integrations",
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        permission: "settings",
      },
      {
        title: "Seeds",
        href: "/dashboard/seeds",
        icon: Bean,
        permission: "seeds",
      },
    ],
  },
];
