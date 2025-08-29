import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface UserPagingProps {
  total: number;
}

export function UserPaging({ total }: UserPagingProps) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const router = useRouter();

  useEffect(() => {
    console.log(page, limit);
  }, [page, limit]);

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    if (page > Math.ceil(total / limit)) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full flex gap-4 items-center text-sm text-muted-foreground">
      <div>
        Page {page} of {Math.ceil(total / limit)}
      </div>
      <div className="flex-1 text-center">{total} records</div>
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === Math.ceil(total / limit)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
