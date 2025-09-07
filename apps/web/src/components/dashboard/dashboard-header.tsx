"use client";

import { AuthenMenu } from "@/components/auth/authen-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";
import type { BreadcrumbItem } from "@/types/dashboard";
import { NotificationDropdown } from "@/components/notification/notification-dropdown";

export interface DashboardHeaderProps {
  breadcrumbItems?: BreadcrumbItem[];
}

export function DashboardHeader({
  breadcrumbItems = [],
}: DashboardHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 sticky top-0 right-0 left-0 z-50 bg-background">
      <div className="flex items-center gap-2">
        <DashboardBreadcrumb items={breadcrumbItems} />
      </div>
      <div className="ml-auto">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthenMenu />
        </div>
      </div>
    </header>
  );
}
