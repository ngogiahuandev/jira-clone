import { auth } from "@/axios/auth";
import type { IUser } from "@repo/db-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  user: Omit<IUser, "password"> | null;
  isAuthenticated: boolean;
  setAuth: (auth: {
    accessToken: string;
    user: Omit<IUser, "password">;
    isAuthenticated: boolean;
  }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: ({ accessToken, user, isAuthenticated }) =>
        set({ accessToken, user, isAuthenticated }),
      clearAuth: async () => {
        set({ accessToken: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth",
    }
  )
);
