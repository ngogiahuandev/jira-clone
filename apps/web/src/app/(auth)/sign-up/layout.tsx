import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for an account",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
