"use client";

import { ErrorScreen } from "@/components/layouts/error-screen";
import { Header } from "@/components/layouts/header";

export default function ErrorPage() {
  return (
    <>
      <Header />
      <ErrorScreen
        code="500"
        message="Internal server error"
        className="h-[calc(100vh-4rem)]"
      />
    </>
  );
}
