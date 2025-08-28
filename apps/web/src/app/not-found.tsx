import { ErrorScreen } from "@/components/layouts/error-screen";
import { Header } from "@/components/layouts/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <ErrorScreen
        code="404"
        message="Page not found"
        className="h-[calc(100vh-4rem)]"
      />
    </>
  );
}
