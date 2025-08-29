import { db } from "@/db/drizzle";
import { users, type IUser } from "@repo/db-schema";
import { authLib } from "@/lib/auth.lib";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/slugify";
import { env } from "@/env";
import { getUserImageUrl } from "@/lib/user.lib";

const BASE_PASSWORD = "123456";

export async function seedUsers() {
  await db.delete(users);

  const hashed = await authLib.hashPassword(BASE_PASSWORD);

  const admin: IUser = {
    email: "admin@gmail.com",
    password: hashed,
    name: "Admin",
    role: "admin",
    imageUrl: `${env.AVATAR_SEED}/${slugify("admin")}`,
    slug: slugify("admin"),
  };

  const regularCount = 10 - 1;
  const regulars: IUser[] = [];
  const usedSlugs = new Set<string>([slugify("admin")]);

  for (let i = 0; i < regularCount; i++) {
    const name = faker.person.fullName();
    const email = faker.internet
      .email({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
      })
      .toLowerCase();
    let slugBase = slugify(name || faker.internet.username().toLowerCase());
    let slug = slugBase;
    let suffix = 1;
    while (usedSlugs.has(slug)) {
      slug = `${slugBase}-${suffix++}`;
    }
    usedSlugs.add(slug);

    regulars.push({
      email,
      password: hashed,
      name,
      role: "regular",
      imageUrl: getUserImageUrl(name),
      slug,
    });
  }

  await db
    .insert(users)
    .values(admin)
    .onConflictDoNothing({ target: users.email });
  if (regulars.length) {
    await db
      .insert(users)
      .values(regulars)
      .onConflictDoNothing({ target: users.email });
  }

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.role, "admin" as const));
  if (rows.length > 1) {
    const toDemote = rows.filter((u) => u.email !== admin.email);
    for (const u of toDemote) {
      await db.update(users).set({ role: "regular" }).where(eq(users.id, u.id));
    }
  }
}
