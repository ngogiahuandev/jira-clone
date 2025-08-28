import { Header } from "@/components/layouts/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth",
  description: "Auth is a platform for creating and managing team projects",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
