import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        "destructive-outline":
          "border-destructive text-destructive bg-transparent [a&]:hover:bg-destructive/10 dark:text-destructive/80 dark:border-destructive/80 dark:hover:bg-destructive/20",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-green-500  text-white dark:text-green-200 [a&]:hover:bg-green-600 dark:bg-green-800 dark:hover:bg-green-900",
        "success-outline":
          "border-green-500 text-green-700 bg-transparent [a&]:hover:bg-green-50 dark:text-green-500 dark:border-green-500 dark:hover:bg-green-950/30",
        warning:
          "border-transparent bg-yellow-500 text-white dark:text-yellow-200 [a&]:hover:bg-yellow-600 dark:bg-yellow-800 dark:hover:bg-yellow-900",
        "warning-outline":
          "border-yellow-500 text-yellow-700 bg-transparent [a&]:hover:bg-yellow-50 dark:text-yellow-500 dark:border-yellow-500 dark:hover:bg-yellow-950/30",
        info: "border-transparent bg-blue-500 text-white dark:text-blue-200 [a&]:hover:bg-blue-600 dark:bg-blue-800 dark:hover:bg-blue-900",
        "info-outline":
          "border-blue-500 text-blue-700 bg-transparent [a&]:hover:bg-blue-50 dark:text-blue-500 dark:border-blue-500 dark:hover:bg-blue-950/30",
        muted:
          "border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
