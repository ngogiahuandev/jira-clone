"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { IUser } from "@repo/db-schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { users } from "@/axios/user";
import { toast } from "sonner";

interface UserStatusUpdateButtonProps {
  user: Omit<IUser, "password">;
}

export const UserStatusUpdateButton = ({
  user,
}: UserStatusUpdateButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => users.updateUser(user.id!, { isActive: !user.isActive }),
    onSuccess: () => {
      toast.success(
        user.isActive
          ? "User deactivated successfully"
          : "User activated successfully"
      );
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          className={cn(
            user.isActive
              ? "text-destructive hover:text-destructive/80! hover:bg-destructive/10!"
              : "text-green-500 hover:text-green-500/80 hover:bg-green-500/10",
            "cursor-pointer"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Loading..."
            : user.isActive
              ? "Deactivate"
              : "Activate"}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure? </DialogTitle>
          <DialogDescription>
            This action will be taken immediately. This will{" "}
            <span
              className={cn(
                "font-semibold",
                user.isActive ? "text-destructive" : "text-green-500"
              )}
            >
              {user.isActive ? "deactivate" : "activate"}
            </span>{" "}
            user{" "}
            <span className="font-semibold text-foreground"> {user.name}</span>{" "}
            account and remove their access to the system.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen((prev) => !prev)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Loading..."
              : user.isActive
                ? "Deactivate"
                : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
