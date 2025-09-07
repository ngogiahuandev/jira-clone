"use client";

import { cn } from "@/lib/utils";
import { useMarkNotificationAsRead } from "@/hooks/use-notification";
import type { NotificationItem } from "@repo/types";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface NotificationCardProps {
  item: NotificationItem;
}

export function NotificationCard({ item }: NotificationCardProps) {
  const router = useRouter();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Mark as read if not already read
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }

    // Navigate to the notification detail page
    router.push(`/dashboard/notifications/${item.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Mark as read if not already read
      if (!item.isRead) {
        markAsReadMutation.mutate(item.id);
      }
      // Navigate to the notification detail page
      router.push(`/dashboard/notifications/${item.id}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group w-full text-left",
        !item.isRead && "bg-accent/30"
      )}
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-medium leading-tight line-clamp-2",
              !item.isRead && "font-semibold"
            )}
          >
            {item.notification.title}
          </h4>
          {!item.isRead && (
            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {item.notification.body}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {format(new Date(item.updatedAt), "P, h:mm a")}
          </span>
        </div>
      </div>
    </button>
  );
}
