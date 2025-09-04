import { db } from "@/db/drizzle";
import { users } from "@repo/db-schema";
import { desc, ilike, or, asc, count, eq, not, and, ne } from "drizzle-orm";
import type { Context } from "hono";
import type {
  CreateUserResponse,
  DeActiveUserResponse,
  GetAllUsersResponse,
  JwtPayload,
  SortableUserColumns,
  UpdateUserResponse,
} from "@repo/types";
import { getUserImageUrl, userLib } from "@/lib/user.lib";
import { createUserSchema, updateUserSchema } from "@repo/validation";
import { slugify } from "@/lib/slugify";
import type { Get } from "@/types/middleware";

export const userService = {
  findAllUsers: async (c: Context) => {
    const queries = c.req.query();
    const page = queries.page ?? 1;
    const limit = queries.limit ?? 10;
    const search = queries.search ?? "";
    const sortBy = queries.sort ?? "createdAt";
    const order = queries.order ?? "desc";
    const offset = (Number(page) - 1) * Number(limit);

    const isActive = await userService.checkIsCurrentUserActive(c);
    if (!isActive) {
      return c.json({ error: "User is not active" }, 400);
    }

    if (Number(page) < 1) {
      return c.json({ error: "Page must be greater than 0" }, 400);
    }
    if (Number(limit) < 1) {
      return c.json({ error: "Limit must be greater than 0" }, 400);
    }

    const tokenPayload = c.get("tokenPayload") as Get<JwtPayload>;

    const validSortFields: SortableUserColumns[] = [
      "id",
      "email",
      "name",
      "role",
      "slug",
      "createdAt",
      "updatedAt",
    ];
    const sortField: SortableUserColumns = validSortFields.includes(
      sortBy as SortableUserColumns
    )
      ? (sortBy as SortableUserColumns)
      : "createdAt";
    const sortOrder = order === "asc" ? asc : desc;

    const searchConditions =
      search.trim() !== ""
        ? or(
            ilike(users.name, `%${search}%`),
            ilike(users.email, `%${search}%`),
            ilike(users.slug, `%${search}%`),
            eq(users.id, search)
          )
        : undefined;

    const whereClause = searchConditions
      ? and(searchConditions, ne(users.id, tokenPayload.payload.sub))
      : ne(users.id, tokenPayload.payload.sub);

    const [u, totalCount] = await Promise.all([
      await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
          imageUrl: users.imageUrl,
          slug: users.slug,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(whereClause)
        .orderBy(sortOrder(userLib.getSortColumn(sortField)))
        .limit(Number(limit))
        .offset(Number(offset)),
      await db.select({ count: count() }).from(users).where(whereClause),
    ]);

    const total = totalCount[0]?.count ?? 0;

    c.header("X-Total-Count", total.toString());
    c.header("X-Page", page.toString());
    c.header("X-Limit", limit.toString());

    return c.json<GetAllUsersResponse>(u);
  },

  checkIsCurrentUserActive: async (c: Context) => {
    const tokenPayload = c.get("tokenPayload") as Get<JwtPayload>;

    if (!tokenPayload) {
      return false;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, tokenPayload.payload.sub))
      .limit(1);
    if (!user) {
      return false;
    }
    return user.isActive;
  },

  createUser: async (c: Context) => {
    const body = await c.req.json();

    const isActive = await userService.checkIsCurrentUserActive(c);
    if (!isActive) {
      return c.json({ error: "User is not active" }, 400);
    }

    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.message }, 400);
    }

    const [user] = await db
      .insert(users)
      .values({
        ...parsed.data,
        imageUrl: getUserImageUrl(parsed.data.name),
        slug: slugify(parsed.data.name),
      })
      .returning();

    const { password: _pw, ...userWithoutPassword } = user;

    return c.json<CreateUserResponse>(userWithoutPassword);
  },

  updateUser: async (c: Context) => {
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const body = await c.req.json();

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.message }, 400);
    }

    try {
      const [user] = await db
        .update(users)
        .set(parsed.data)
        .where(eq(users.id, id))
        .returning();

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json<UpdateUserResponse>(user);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to update user" }, 400);
    }
  },
};
