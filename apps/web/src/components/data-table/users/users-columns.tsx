import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AvatarFallback } from "@radix-ui/react-avatar";
import type { IUser } from "@repo/db-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const usersColumns: ColumnDef<Omit<IUser, "password">>[] = [
  {
    id: "rowNumber",
    header: "#",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm font-medium">
        {row.index + 1}
      </div>
    ),
    size: 60,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user.imageUrl || undefined}
            alt={user.name || "User"}
          />
          <AvatarFallback className="text-xs">
            {user.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="">{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("slug")}</Badge>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const roleVariants: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        admin: "destructive",
        regular: "secondary",
      };

      return (
        <Badge variant={roleVariants[role] || "outline"} className="capitalize">
          {role || "user"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "outline" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">
            {format(new Date(date), "P, h:mm a")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return (
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">
            {format(new Date(date), "P, h:mm a")}
          </span>
        </div>
      );
    },
  },
];
