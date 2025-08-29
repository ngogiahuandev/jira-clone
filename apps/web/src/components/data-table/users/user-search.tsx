import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function UserSearch() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(search);
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const router = useRouter();

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length === 0) {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      router.push(`?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams);
      params.set("search", debouncedSearch);
      router.push(`?${params.toString()}`);
    }
  }, [debouncedSearch, router, searchParams]);

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Search"
        className="w-96"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
