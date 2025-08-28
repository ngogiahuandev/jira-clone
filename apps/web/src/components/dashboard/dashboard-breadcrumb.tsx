"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types/dashboard";
import { Fragment } from "react";

interface DashboardBreadcrumbProps {
  items: BreadcrumbItemType[];
}

export function DashboardBreadcrumb({ items }: DashboardBreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  if (items.length <= 5) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item) => (
            <Fragment key={item.title}>
              {items.indexOf(item) > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {items.indexOf(item) === items.length - 1 ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href || "#"}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // If more than 5 items, show first item, ellipsis dropdown, and last 2 items
  const firstItem = items[0];
  const lastTwoItems = items.slice(-2);
  const middleItems = items.slice(1, -2);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* First item */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={firstItem.href || "#"}>{firstItem.title}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Separator */}
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="size-4" />
              <span className="sr-only">Show more breadcrumbs</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {middleItems.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link href={item.href || "#"}>{item.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {lastTwoItems.map((item) => (
          <div key={item.title} className="flex items-center">
            {lastTwoItems.indexOf(item) > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {lastTwoItems.indexOf(item) === lastTwoItems.length - 1 ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href || "#"}>{item.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
