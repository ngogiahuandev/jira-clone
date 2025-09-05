import type { SidebarNavGroup } from "@/types/dashboard";
import {
  BarChart3,
  Bell,
  Calendar,
  FileText,
  Home,
  MessageSquare,
} from "lucide-react";

export const regularSidebar: SidebarNavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Home },
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
      { title: "Projects", href: "/dashboard/projects", icon: FileText },
      { title: "Calendar", href: "/dashboard/calendar", icon: Calendar },
      { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    ],
  },
  {
    title: "Tools",
    items: [
      { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
];
