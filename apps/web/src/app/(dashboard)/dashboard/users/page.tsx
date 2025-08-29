import { DashboardLayout } from "@/components/dashboard";
import { DashboardTitle } from "@/components/dashboard/dashbaord-title";
import { UserDataTable } from "@/components/data-table/users/users-data-table";
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
      <DashboardTitle
        title="Users"
        description="Manage your users"
        className="mb-4"
      />
      <UserDataTable />
    </DashboardLayout>
  );
}
