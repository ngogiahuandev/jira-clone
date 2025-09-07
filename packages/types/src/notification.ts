import { INotification, IUserNotification } from "@repo/db-schema";

export type GetMyNotificationsResponse = NotificationItem[];

export type NotificationItem = {
  id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  notification: {
    id: string;
    title: string;
    body: string;
  };
};

export type ExhangeNotificationItem = IUserNotification & {
  notification: INotification;
};

export type MarkAsReadResponse = {
  message: string;
};

export type GetNotificationByIdResponse = ExhangeNotificationItem;
