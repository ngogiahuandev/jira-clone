"use client";

import { auth } from "@/axios/auth";
import { LoadingScreen } from "@/components/layouts/loading-screen";
import { useAuthStore } from "@/stores/auth.store";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useEffect, useState } from "react";

interface RefreshPageProviderProps {
  children: React.ReactNode;
}

export const RefreshPageProvider = ({ children }: RefreshPageProviderProps) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setItems = useSidebarStore((state) => state.setItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await useAuthStore.persist.rehydrate();

        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          const user = (await auth.me()).user;
          setAuth({
            accessToken,
            user,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [setAuth, clearAuth]);

  if (isLoading) {
    return <LoadingScreen message="Loading your account..." />;
  }

  return <>{children}</>;
};
