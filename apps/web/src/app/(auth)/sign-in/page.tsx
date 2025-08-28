import SignInForm from "@/components/forms/auth/sign-in-form";

export default function LoginPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <SignInForm />
    </div>
  );
}
