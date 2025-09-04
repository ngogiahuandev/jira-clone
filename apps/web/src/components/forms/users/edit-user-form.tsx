"use client";

import { users } from "@/axios/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { isDirtyByValue, shallowDiff } from "@/lib/form-diff";
import { roles } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { IRole, IUser } from "@repo/db-schema";
import { type UpdateUserSchema, updateUserSchema } from "@repo/validation";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function normalize(values: {
  name: string;
  role: IRole;
  isActive: boolean;
  slug: string;
  password?: string;
}) {
  return {
    ...values,
    slug: values.slug.trim().replace(/^@+/, ""),
    name: values.name.trim(),
  };
}

interface EditUserFormProps {
  user: Omit<IUser, "password">;
}

export function EditUserForm({ user }: EditUserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: UpdateUserSchema) =>
      users.updateUser(user.id!, payload),
    onSuccess: () => {
      toast.success("User updated successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const initialValues = useMemo(
    () =>
      normalize({
        name: user.name,
        role: user.role as IRole,
        isActive: user.isActive ?? false,
        slug: user.slug,
        password: "",
      }),
    [user]
  );

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: updateUserSchema as any,
    },
    onSubmit: async (values) => {
      const normalizedCurrent = normalize(values.value);
      const changedFields = shallowDiff(initialValues, normalizedCurrent);

      if (Object.keys(changedFields).length === 0) return;

      if (changedFields.password === "") delete changedFields.password;

      console.log("Changed fields:", changedFields);
      mutation.mutate(changedFields);
    },
  });

  const currentValues = useStore(form.store, (s) => s.values);

  const dirty = useMemo(
    () => isDirtyByValue(normalize(initialValues), normalize(currentValues)),
    [initialValues, currentValues]
  );
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        form.reset();
        setIsOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          Edit user
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit user <span className="font-semibold">{user.name}</span>
          </DialogTitle>
          <DialogDescription>
            Edit the user with the following details.
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
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="slug">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className={cn(
                    field.state.meta.errors.length > 0 && "text-red-500"
                  )}
                >
                  Slug (@)
                </Label>
                <Input
                  id={field.name}
                  name="slug"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter user slug"
                  type="text"
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
                  Password (leave blank if unchanged)
                </Label>
                <Input
                  id={field.name}
                  name="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter new password"
                  type="password"
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
                  Role {/* fix: trước đó label ghi nhầm "Password" */}
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as IRole)}
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

          <form.Field name="isActive">
            {(field) => (
              <div className="flex items-center gap-2 p-4 rounded-md border border-input">
                <div className="space-y-1 flex-1">
                  <Label
                    htmlFor={field.name}
                    className={cn(
                      field.state.meta.errors.length > 0 && "text-red-500"
                    )}
                  >
                    Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    This user will be able to login to the system.
                  </p>
                </div>
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(value) => field.handleChange(value)}
                />
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="submit"
              disabled={form.state.isSubmitting || !dirty || mutation.isPending}
            >
              {form.state.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
