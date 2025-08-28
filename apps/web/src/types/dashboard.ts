import { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  permission?: string;
}

export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}
