"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { auth } from "@/axios/auth";
import { LoadingScreen } from "@/components/layouts/loading-screen";
import { useSidebarStore } from "@/stores/sidebar.store";
import { getSidebarByRole } from "@/lib/navigation";
import { SidebarNavGroup } from "@/types/dashboard";
import { IRole } from "@repo/db-schema";

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
          setItems(getSidebarByRole(user.role as IRole) as SidebarNavGroup[]);
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [setAuth, clearAuth, setItems]);

  if (isLoading) {
    return <LoadingScreen message="Loading your account..." />;
  }

  return <>{children}</>;
};
