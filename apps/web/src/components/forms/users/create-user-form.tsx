"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { createUserSchema, type CreateUserSchema } from "@repo/validation";
import { useForm } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IRole } from "@repo/db-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { users } from "@/axios/user";
import { toast } from "sonner";
import { GenerateRandomUserData } from "@/components/forms/users/generate-random-user-data";

const defaultValues: CreateUserSchema = {
  name: "",
  email: "",
  password: "",
  role: "regular",
};

const roles: { label: string; value: IRole }[] = [
  {
    label: "Regular",
    value: "regular",
  },
  {
    label: "Admin",
    value: "admin",
  },
];

export function CreateUserForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateUserSchema) => users.createUser(payload),
    onSuccess: () => {
      toast.success("User created successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createUserSchema,
    },
    onSubmit: async (values) => {
      mutation.mutate(values.value);
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        form.reset();
        setIsOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-xl ">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a new user with the following details.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className={cn(
                    field.state.meta.errors.length > 0 && "text-red-500"
                  )}
                >
                  Email
                </Label>
                <Input
                  id={field.name}
                  name="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter user email"
                  type="text"
                  className={cn(
                    field.state.meta.errors.length > 0 && "border-destructive"
                  )}
                  disabled={mutation.isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className={cn(
                    field.state.meta.errors.length > 0 && "text-red-500"
                  )}
                >
                  Name
                </Label>
                <Input
                  id={field.name}
                  name="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter user name"
                  type="text"
                  disabled={mutation.isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className={cn(
                    field.state.meta.errors.length > 0 && "text-red-500"
                  )}
                >
                  Password
                </Label>
                <Input
                  id={field.name}
                  name="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter user password"
                  type="password"
                  disabled={mutation.isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="role">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className={cn(
                    field.state.meta.errors.length > 0 && "text-red-500"
                  )}
                >
                  Password
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as IRole)}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
                {field.state.value === "admin" && (
                  <p className="text-sm text-red-500">
                    Be careful, admin can do anything.
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <DialogFooter>
            <GenerateRandomUserData
              onGenerate={(data) => {
                form.setFieldValue("name", data.name);
                form.setFieldValue("email", data.email);
                form.setFieldValue("password", data.password);
              }}
            />
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
