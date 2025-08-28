"use client";

import { auth } from "@/axios/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type SignUpSchema, signUpSchema } from "@repo/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUpForm() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (payload: SignUpSchema) => auth.signUp(payload),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Sign up successful");

      router.push("/");
    },
    onError: (error: string) => {
      toast.error(error ?? "Sign up failed");
    },
  });
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async (values) => {
      mutation.mutate(values.value);
    },
  });
  return (
    <Card className="bg-background mx-auto w-full max-w-md border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
        <CardDescription className="">
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  placeholder="Enter your name"
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
                  name="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
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
                  name="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter your password"
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
          <form.Field name="confirmPassword">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className={cn(
                    field.state.meta.errors.length > 0 && "text-red-500"
                  )}
                >
                  Confirm Password
                </Label>
                <Input
                  id={field.name}
                  name="confirmPassword"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Confirm your password"
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
          <form.Subscribe>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Signing up..." : "Sign up"}
            </Button>
          </form.Subscribe>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
