import type { SidebarNavGroup } from "@/types/dashboard";
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

export const adminSidebar: SidebarNavGroup[] = [
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
      { title: "Users", href: "/dashboard/users", icon: Users },
      { title: "Projects", href: "/dashboard/projects", icon: FileText },
      { title: "Calendar", href: "/dashboard/calendar", icon: Calendar },
      { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    ],
  },
  {
    title: "Tools",
    items: [
      { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { title: "Integrations", href: "/dashboard/integrations", icon: Zap },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
      { title: "Seeds", href: "/dashboard/seeds", icon: Bean },
    ],
  },
];
