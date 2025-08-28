import { SidebarNavGroup } from "@/types/dashboard";
import { create } from "zustand";

interface SidebarStore {
  items: SidebarNavGroup[];
  setItems: (items: SidebarNavGroup[]) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
