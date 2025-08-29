"use client";

import { users } from "@/axios/user";
import { DataTable } from "@/components/data-table/data-table";
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
    <DataTable columns={usersColumns} data={data || []} loading={isLoading} />
  );
}
