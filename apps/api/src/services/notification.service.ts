import { db } from "@/db/drizzle";
import type { Get } from "@/types/middleware";
import { notification, userNotifications } from "@repo/db-schema";
import type {
  GetMyNotificationsResponse,
  GetNotificationByIdResponse,
  JwtPayload,
  MarkAsReadResponse,
} from "@repo/types";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import type { Context } from "hono";

export const notificationService = {
  getMyNotifications: async (c: Context) => {
    const tokenPayload = c.get("tokenPayload") as Get<JwtPayload>;

    if (!tokenPayload) return c.json({ message: "Unauthorized" }, 401);

    const query = c.req.query();
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (Number(page) - 1) * Number(limit);
    const search = query.search ?? "";

    const searchConditions =
      search.trim() !== ""
        ? or(
            ilike(notification.title, `%${search}%`),
            ilike(notification.body, `%${search}%`)
          )
        : undefined;

    const [notifications, total] = await Promise.all([
      db
        .select({
          id: userNotifications.id,
          isRead: userNotifications.isRead,
          createdAt: userNotifications.createdAt,
          updatedAt: userNotifications.updatedAt,
          notification: {
            id: notification.id,
            title: notification.title,
            body: notification.body,
          },
        })
        .from(userNotifications)
        .innerJoin(
          notification,
          eq(userNotifications.notificationId, notification.id)
        )
        .where(
          and(
            eq(userNotifications.userId, tokenPayload.payload.sub),
            searchConditions
          )
        )
        .orderBy(desc(userNotifications.createdAt))
        .limit(Number(limit))
        .offset(Number(offset)),
      db
        .select({ count: count() })
        .from(userNotifications)
        .where(
          and(
            eq(userNotifications.userId, tokenPayload.payload.sub),
            searchConditions
          )
        ),
    ]);

    const totalCount = total[0]?.count ?? 0;
    c.header("X-Total-Count", totalCount.toString());
    c.header("X-Page", page.toString());
    c.header("X-Limit", limit.toString());

    return c.json<GetMyNotificationsResponse>(notifications);
  },
  getNotificationById: async (c: Context) => {
    const tokenPayload = c.get("tokenPayload") as Get<JwtPayload>;

    if (!tokenPayload) return c.json({ message: "Unauthorized" }, 401);

    const { id } = c.req.param();

    if (!id) return c.json({ message: "Notification ID is required" }, 400);

    const [n] = await db
      .select({
        id: userNotifications.id,
        createdAt: userNotifications.createdAt,
        updatedAt: userNotifications.updatedAt,
        userId: userNotifications.userId,
        notificationId: userNotifications.notificationId,
        isRead: userNotifications.isRead,
        notification: {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          metadata: notification.metadata,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        },
      })
      .from(userNotifications)
      .innerJoin(
        notification,
        eq(userNotifications.notificationId, notification.id)
      )
      .where(
        and(
          eq(userNotifications.id, id),
          eq(userNotifications.userId, tokenPayload.payload.sub)
        )
      );

    if (!n) return c.json({ message: "Notification not found" }, 404);

    return c.json<GetNotificationByIdResponse>(n);
  },

  markAsRead: async (c: Context) => {
    const tokenPayload = c.get("tokenPayload") as Get<JwtPayload>;

    if (!tokenPayload) return c.json({ message: "Unauthorized" }, 401);

    const { id } = c.req.param();

    if (!id) return c.json({ message: "Notification ID is required" }, 400);

    const [notification] = await db
      .update(userNotifications)
      .set({ isRead: true })
      .where(
        and(
          eq(userNotifications.id, id),
          eq(userNotifications.userId, tokenPayload.payload.sub)
        )
      )
      .returning();

    if (!notification)
      return c.json({ message: "Notification not found" }, 404);

    return c.json<MarkAsReadResponse>({
      message: "Notification marked as read",
    });
  },
};
