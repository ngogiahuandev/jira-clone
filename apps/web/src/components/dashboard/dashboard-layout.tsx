"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import type { BreadcrumbItem, SidebarNavGroup } from "@/types/dashboard";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { getSidebarByRole } from "@/lib/sidebar";
import type { IRole } from "@repo/db-schema";
import { ErrorScreen } from "@/components/layouts/error-screen";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  allowedRoles?: IRole[];
}
export function DashboardLayout({
  children,
  breadcrumbItems = [],
  allowedRoles,
}: DashboardLayoutProps) {
  const { items, setItems } = useSidebarStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      setItems(getSidebarByRole(user.role as IRole) as SidebarNavGroup[]);
    }
  }, [user, setItems]);

  if (allowedRoles && !allowedRoles.includes(user?.role as IRole)) {
    return (
      <ErrorScreen
        code={401}
        message="You are not authorized to view this page."
      />
    );
  }

  if (!user) {
    return (
      <ErrorScreen
        code={401}
        message="You are not authorized to view this page."
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar navigation={items} />
        <SidebarInset className="flex flex-col">
          <DashboardHeader breadcrumbItems={breadcrumbItems} />
          <main className="flex-1 overflow-auto p-4 ">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
