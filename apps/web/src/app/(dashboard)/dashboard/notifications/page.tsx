import type { BreadcrumbItem } from "@/types/dashboard";
import { Inbox } from "lucide-react";

export default function Page() {
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
    <div className="flex items-center justify-center h-[calc(100vh-12.5rem)] text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <Inbox className="size-20 opacity-50" />
        No notification selected
      </div>
    </div>
  );
}
