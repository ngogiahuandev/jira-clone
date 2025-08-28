"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { defaultSidebarNavigation } from "@/components/dashboard/constance";
import type { BreadcrumbItem } from "@/types/dashboard";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}
export function DashboardLayout({
  children,
  breadcrumbItems = [],
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar navigation={defaultSidebarNavigation} />
        <SidebarInset className="flex flex-col">
          <DashboardHeader breadcrumbItems={breadcrumbItems} />
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
