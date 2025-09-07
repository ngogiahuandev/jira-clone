"use client";

import { notification } from "@/axios/notification";
import { useMarkNotificationAsRead } from "@/hooks/use-notification";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params);
  const markAsReadMutation = useMarkNotificationAsRead();

  const { data, isLoading, error } = useQuery({
    queryKey: ["notification", id],
    queryFn: () => notification.getNotificationById(id),
  });

  // Mark notification as read when the page loads (if not already read)
  useEffect(() => {
    if (data && !data.isRead) {
      markAsReadMutation.mutate(id);
    }
  }, [data, id, markAsReadMutation]);

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">
          <Loader2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Loading...</p>
        </div>
      ) : null}
      {error ? (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-sm">Error: {error.message}</p>
        </div>
      ) : null}
      {data ? (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{data.notification.title}</h1>
          <p className="py-2">{data.notification.body}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(data.notification.createdAt), "P, h:mm a")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
