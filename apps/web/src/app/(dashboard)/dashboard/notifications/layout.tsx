import { DashboardLayout } from "@/components/dashboard";
import { DashboardTitle } from "@/components/dashboard/dashbaord-title";
import { NotificationDashboardLayout } from "@/components/notification/notification-dashboard-layout";
import type { BreadcrumbItem } from "@/types/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Notifications",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
    },
  ];

  return (
    <DashboardLayout breadcrumbItems={breadcrumbItems}>
      <DashboardTitle
        title="Notifications"
        description="Manage your notifications"
        className="mb-4 "
      />
      <NotificationDashboardLayout>{children}</NotificationDashboardLayout>
    </DashboardLayout>
  );
}
