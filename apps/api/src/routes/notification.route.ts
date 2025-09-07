import { bearerMiddleware } from "@/middleware/bearer.mw";
import { notificationService } from "@/services/notification.service";
import { Hono } from "hono";

const notificationRoute = new Hono();

notificationRoute.get(
  "/",
  bearerMiddleware,
  notificationService.getMyNotifications
);
notificationRoute.patch(
  "mark-as-read/:id",
  bearerMiddleware,
  notificationService.markAsRead
);
notificationRoute.get(
  "/:id",
  bearerMiddleware,
  notificationService.getNotificationById
);

export default notificationRoute;
