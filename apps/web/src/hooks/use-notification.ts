"use client";

import { notification } from "@/axios/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NotificationItem } from "@repo/types";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notification.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<{
        notifications: NotificationItem[];
        total: number;
        limit: number;
        page: number;
      }>(["notifications"]);

      if (previousNotifications) {
        queryClient.setQueryData(["notifications"], {
          ...previousNotifications,
          notifications: previousNotifications.notifications.map((item) =>
            item.id === id ? { ...item, isRead: true } : item
          ),
        });
      }

      const previousNotification = queryClient.getQueryData<NotificationItem>([
        "notification",
        id,
      ]);

      if (previousNotification) {
        queryClient.setQueryData(["notification", id], {
          ...previousNotification,
          isRead: true,
        });
      }

      return { previousNotifications, previousNotification };
    },
    onError: (_err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
      if (context?.previousNotification) {
        queryClient.setQueryData(
          ["notification", id],
          context.previousNotification
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
