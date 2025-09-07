"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import type { SidebarNavGroup } from "@/types/dashboard";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  navigation: SidebarNavGroup[];
}

export function DashboardSidebar({ navigation }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { state, open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="bg-background border-r-0">
      <SidebarHeader className=" bg-background h-12 border-b">
        <Link href="/" className="flex h-full items-center gap-2 select-none">
          {open ? (
            <div className="text-foreground pl-2 text-xl font-bold">
              JiraClone
            </div>
          ) : (
            <div className="text-foreground pl-2 text-xl font-bold">J</div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isRootItem = item.href.split("/").length === 2;
                  const isActive = isRootItem
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={state === "collapsed" ? item.title : undefined}
                        disabled={item.disabled}
                        className="rounded-sm"
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                          {item.badge && (
                            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className=" bg-background border-t">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
