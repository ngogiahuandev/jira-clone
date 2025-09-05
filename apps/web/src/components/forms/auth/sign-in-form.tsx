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
import { useAuthStore } from "@/stores/auth.store";
import { type SignInSchema, signInSchema } from "@repo/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const defaultValues: SignInSchema = {
  email: "",
  password: "",
};

export default function SignInForm() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (payload: SignInSchema) => auth.signIn(payload),
    onSuccess: (data) => {
      toast.success("Sign in successful");
      useAuthStore.setState({
        accessToken: data.accessToken,
        user: data.user,
        isAuthenticated: true,
      });
      router.push("/");
    },
    onError: (error: string) => {
      console.error(error);
      toast.error(error ?? "Sign in failed");
    },
  });

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async (values) => {
      mutation.mutate(values.value);
    },
  });

  return (
    <Card className="bg-background mx-auto w-full max-w-md border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription className="">
          Enter your email and password to access your account
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
          <form.Subscribe>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form.Subscribe>
        </form>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
