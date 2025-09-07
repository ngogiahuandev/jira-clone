import { NotificationDashboardList } from "@/components/notification/notification-dashboard-list";

export function NotificationDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 ">
      <div className="space-y-4 col-span-3 border-r pr-4">
        <NotificationDashboardList />
      </div>
      <div className="col-span-9">{children}</div>
    </div>
  );
}
