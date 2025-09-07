"use client";

import { notification } from "@/axios/notification";
import { NotificationCard } from "@/components/notification/notification-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Bell, Loader2 } from "lucide-react";
import { useState } from "react";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notification.getMyNotifications(1, 10),
  });

  const unreadCount = data?.notifications?.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount && unreadCount > 0 ? (
            <div className="absolute top-0 right-0  flex items-center justify-center p-0 text-xs size-2 bg-red-500 rounded-full"></div>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-2  border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Loading...</p>
          </div>
        ) : null}

        {data?.notifications?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-96 relative">
            <div className="p-2 space-y-2">
              {data?.notifications?.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
