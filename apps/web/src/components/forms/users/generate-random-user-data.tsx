import { Button } from "@/components/ui/button";
import type { CreateUserSchema } from "@repo/validation";
import { faker } from "@faker-js/faker";
import { Dices } from "lucide-react";

interface GenerateRandomUserDataProps {
  onGenerate: (data: Omit<CreateUserSchema, "role">) => void;
}

export function GenerateRandomUserData({
  onGenerate,
}: GenerateRandomUserDataProps) {
  const generateRandomUserData = () => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  };
  return (
    <Button
      variant="outline"
      type="button"
      onClick={() => onGenerate(generateRandomUserData())}
    >
      <Dices className="w-4 h-4" />
      Random
    </Button>
  );
}
