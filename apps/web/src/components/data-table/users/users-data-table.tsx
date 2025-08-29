"use client";

import { users } from "@/axios/user";
import { DataTable } from "@/components/data-table/data-table";
import { RefreshDataTableButton } from "@/components/data-table/refresh-data-table";
import { UserPaging } from "@/components/data-table/users/user-paging";
import { UserSearch } from "@/components/data-table/users/user-search";
import { UserSort } from "@/components/data-table/users/user-sort";
import { usersColumns } from "@/components/data-table/users/users-columns";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function UserDataTable() {
  const searchParams = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["users", searchParams.toString()],
    queryFn: () => users.getUsers(searchParams.toString()),
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <UserSearch />
          <UserSort />
        </div>
        <RefreshDataTableButton queryKey={["users", searchParams.toString()]} />
      </div>
      <DataTable
        columns={usersColumns}
        data={data?.users || []}
        loading={isLoading}
      />
      <UserPaging total={data?.total || 0} />
    </div>
  );
}
