import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface RefreshDataTableButtonProps {
  queryKey: string[];
}

export function RefreshDataTableButton({
  queryKey,
}: RefreshDataTableButtonProps) {
  const client = useQueryClient();

  const handleRefresh = () => {
    client.invalidateQueries({
      queryKey: queryKey,
    });
  };

  return (
    <Button variant="outline" size="icon" onClick={handleRefresh}>
      <RefreshCcw className="w-4 h-4" />
    </Button>
  );
}
