import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-label text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-secondary text-on-primary shadow-lg hover:brightness-110",
        destructive:
          "bg-error/20 text-error border border-error/30 hover:bg-error/30",
        outline:
          "border border-outline-variant text-on-surface-variant hover:bg-white/5 hover:border-primary/40",
        secondary:
          "bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30",
        ghost: "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        ai: "bg-gradient-to-r from-primary to-secondary-container text-on-primary shadow-lg hover:brightness-110",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 py-1 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        xl: "h-14 px-10 py-4 text-base rounded-full",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
