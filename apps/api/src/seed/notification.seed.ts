import { db } from "@/db/drizzle";
import { notification, users, userNotifications } from "@repo/db-schema";
import { eq } from "drizzle-orm";
import { faker } from "@faker-js/faker";

export async function notificationSeed() {
  console.log("Seeding notifications...");

  const [adminUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, "admin@gmail.com"))
    .limit(1);

  if (!adminUser) {
    throw new Error("Admin user not found");
  }

  const COUNT = 10;
  const notificationsData = Array.from({ length: COUNT }, () => ({
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    metadata: {
      type: faker.lorem.word(),
      link: faker.internet.url(),
      image: faker.image.url(),
      color: faker.color.rgb(),
      text: faker.lorem.sentence(),
      buttonText: faker.lorem.word(),
      buttonLink: faker.internet.url(),
    },
  }));

  const inserted = await db
    .insert(notification)
    .values(notificationsData)
    .returning({ id: notification.id });

  await Promise.all(
    inserted.map((n) =>
      db.insert(userNotifications).values({
        userId: adminUser.id,
        notificationId: n.id,
      })
    )
  );
}
