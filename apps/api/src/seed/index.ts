import "dotenv/config";
import { seedUsers } from "./user.seed";

async function main() {
  await seedUsers();
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
