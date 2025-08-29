import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { SortableUserColumns, SortOrder } from "@repo/types";

const SORTABLE_COLUMNS: SortableUserColumns[] = [
  "id",
  "email",
  "name",
  "role",
  "slug",
  "createdAt",
  "updatedAt",
];

const SORT_ORDERS: SortOrder[] = ["asc", "desc"];

export function UserSort() {
  const searchParams = useSearchParams();
  const sortBy =
    (searchParams.get("sortBy") as SortableUserColumns) || "createdAt";
  const order = (searchParams.get("order") as SortOrder) || "asc";
  const router = useRouter();

  const handleSortByChange = (value: SortableUserColumns) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", value);
    params.set("order", order);
    router.push(`?${params.toString()}`);
  };

  const handleOrderChange = (value: SortOrder) => {
    const params = new URLSearchParams(searchParams);
    params.set("order", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Select value={sortBy} onValueChange={handleSortByChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent align="start">
          {Object.values(SORTABLE_COLUMNS).map((column) => (
            <SelectItem key={column} value={column}>
              {column.charAt(0).toUpperCase() + column.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={order} onValueChange={handleOrderChange}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent align="start">
          {Object.values(SORT_ORDERS).map((order) => (
            <SelectItem key={order} value={order}>
              {order.charAt(0).toUpperCase() + order.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
