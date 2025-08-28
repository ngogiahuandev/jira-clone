import { DashboardLayout } from "@/components/dashboard";
import type { BreadcrumbItem } from "@/types/dashboard";

export default function Page() {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Users",
      href: "/dashboard/users",
    },
  ];

  return (
    <DashboardLayout breadcrumbItems={breadcrumbItems}>
      <div>Users</div>
    </DashboardLayout>
  );
}
