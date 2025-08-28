"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface TanstackClientProviderProps {
  children: React.ReactNode;
}

export const TanstackClientProvider = ({
  children,
}: TanstackClientProviderProps) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
