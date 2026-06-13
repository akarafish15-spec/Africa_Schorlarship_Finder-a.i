import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-label font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 border border-primary/30 text-primary",
        secondary:
          "bg-secondary/10 border border-secondary/30 text-secondary",
        tertiary:
          "bg-tertiary/10 border border-tertiary/30 text-tertiary",
        destructive:
          "bg-error/10 border border-error/30 text-error",
        outline:
          "border border-outline-variant text-on-surface-variant",
        success:
          "bg-green-500/10 border border-green-500/30 text-green-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
