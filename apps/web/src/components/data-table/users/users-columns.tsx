import { EditUserForm } from "@/components/forms/users/edit-user-form";
import { UserStatusUpdateButton } from "@/components/forms/users/user-status-update-button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatSlug } from "@/lib/slug";
import { AvatarFallback } from "@radix-ui/react-avatar";
import type { IUser } from "@repo/db-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

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
      <Badge variant="secondary">{formatSlug(row.getValue("slug"))}</Badge>
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
        <Badge variant={isActive ? "success" : "warning"}>
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className=" w-48 border-input">
            <DropdownMenuLabel className="space-y-1">
              <p className="text-sm font-medium">Actions</p>
              <p className="text-xs text-muted-foreground truncate">
                {formatSlug(user.slug)}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-input" />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id || "")}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email || "")}
            >
              Copy user email
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-input" />
            <EditUserForm user={user} />
            <UserStatusUpdateButton user={user} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
