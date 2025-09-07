"use client";

import { AuthenMenu } from "@/components/auth/authen-menu";
import { NotificationDropdown } from "@/components/notification/notification-dropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  label: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background border-border sticky top-0 right-0 left-0 z-50 h-12 w-full border-b px-4">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center select-none">
            <div className="text-foreground text-xl font-bold">JiraClone</div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden items-center space-x-6 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-primary text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sign In / Sign Up Buttons */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <AuthenMenu />
        </div>
      </div>
    </header>
  );
}
