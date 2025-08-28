"use client";

import { AuthenMenu } from "@/components/auth/authen-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";
import type { BreadcrumbItem } from "@/types/dashboard";

export interface DashboardHeaderProps {
  breadcrumbItems?: BreadcrumbItem[];
}

export function DashboardHeader({
  breadcrumbItems = [],
}: DashboardHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <DashboardBreadcrumb items={breadcrumbItems} />
      </div>
      <div className="ml-auto">
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <AuthenMenu />
        </div>
      </div>
    </header>
  );
}
