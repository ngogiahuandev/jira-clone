import { db } from "@/db/drizzle";
import { users } from "@repo/db-schema";
import { desc, ilike, or, asc, count } from "drizzle-orm";
import type { Context } from "hono";
import type { GetAllUsersResponse, SortableUserColumns } from "@repo/types";
import { userLib } from "@/lib/user.lib";

export const userService = {
  findAllUsers: async (c: Context) => {
    const queries = c.req.query();
    const page = queries.page ?? 1;
    const limit = queries.limit ?? 10;
    const search = queries.search ?? "";
    const sortBy = queries.sort ?? "createdAt";
    const order = queries.order ?? "desc";
    const offset = (Number(page) - 1) * Number(limit);

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

    const [u, totalCount] = await Promise.all([
      await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
          imageUrl: users.imageUrl,
          slug: users.slug,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(
          or(
            ilike(users.name, `%${search}%`),
            ilike(users.email, `%${search}%`),
            ilike(users.slug, `%${search}%`)
          )
        )
        .orderBy(sortOrder(userLib.getSortColumn(sortField)))
        .limit(Number(limit))
        .offset(Number(offset)),
      await db
        .select({ count: count() })
        .from(users)
        .where(
          or(
            ilike(users.name, `%${search}%`),
            ilike(users.email, `%${search}%`),
            ilike(users.slug, `%${search}%`)
          )
        ),
    ]);

    const total = totalCount[0]?.count ?? 0;

    c.header("X-Total-Count", total.toString());
    c.header("X-Page", page.toString());
    c.header("X-Limit", limit.toString());

    return c.json<GetAllUsersResponse>(u);
  },
};
