"use client";

import { notification } from "@/axios/notification";
import { NotificationCard } from "@/components/notification/notification-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEndScroll } from "@/hooks/use-end-scroll";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";

export function NotificationDashboardList() {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notification.getMyNotifications(1, 10),
  });
  const { endRef, showScrollButton, scrollRef, scrollToBottom } =
    useEndScroll();
  return (
    <div className="space-y-2">
      <Input placeholder="Search" />
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">
          <Loader2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Loading...</p>
        </div>
      ) : null}
      <ScrollArea className="h-[calc(100vh-12rem)] relative" ref={scrollRef}>
        <div className="space-y-2">
          {data?.notifications.map((notification) => (
            <NotificationCard key={notification.id} item={notification} />
          ))}
        </div>
        <div ref={endRef} className="h-0" />
        {showScrollButton && (
          <Button
            className="absolute bottom-0 right-0 left-0 bg-transparent backdrop-blur-sm hover:bg-transparent text-muted-foreground"
            onClick={scrollToBottom}
          >
            <ChevronDown className="h-4 w-4" />
            Scroll down
          </Button>
        )}
      </ScrollArea>
    </div>
  );
}
