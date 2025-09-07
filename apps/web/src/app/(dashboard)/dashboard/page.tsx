import { DashboardLayout } from "@/components/dashboard";
import type { BreadcrumbItem } from "@/types/dashboard";

export default function Page() {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
  ];

  return (
    <DashboardLayout breadcrumbItems={breadcrumbItems}>
      <div>Dashboard</div>
    </DashboardLayout>
  );
}
