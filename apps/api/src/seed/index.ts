import "dotenv/config";
import { seedUsers } from "./user.seed";
import { notificationSeed } from "@/seed/notification.seed";
import { resetDb } from "@/db/drizzle";

async function main() {
  await resetDb();
  await seedUsers();
  await notificationSeed();
  console.log("Seed completed");
}

main().then(
  () => {
    process.exit(0);
  },
  (err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  }
);
