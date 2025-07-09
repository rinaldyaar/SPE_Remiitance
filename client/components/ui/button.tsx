import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 sm:gap-2.5 whitespace-nowrap rounded-lg font-semibold ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation active:scale-95 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-600 active:bg-primary-700 shadow-lg shadow-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20",
        outline:
          "border border-primary bg-background text-primary hover:bg-primary-50 active:bg-primary-100 shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-success text-success-foreground hover:bg-success-600 active:bg-success-700 shadow-lg shadow-success/20",
        trust:
          "bg-trust text-trust-foreground hover:bg-primary-600 active:bg-primary-700 shadow-lg shadow-trust/20",
      },
      size: {
        default: "h-11 sm:h-12 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base",
        sm: "h-9 sm:h-10 px-3 sm:px-4 py-2 text-xs sm:text-sm gap-1.5 sm:gap-2",
        lg: "h-12 sm:h-14 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg gap-2 sm:gap-3",
        icon: "h-11 w-11 sm:h-12 sm:w-12 px-0",
        "icon-sm": "h-9 w-9 sm:h-10 sm:w-10 px-0 gap-0",
        "icon-lg": "h-12 w-12 sm:h-14 sm:w-14 px-0 gap-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText = "Loading...",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    // Define icon sizes based on button size
    const getIconSize = () => {
      switch (size) {
        case "sm":
        case "icon-sm":
          return "h-4 w-4";
        case "lg":
        case "icon-lg":
          return "h-6 w-6";
        case "icon":
          return "h-5 w-5";
        default:
          return "h-5 w-5";
      }
    };

    const iconSize = getIconSize();
    const isIconOnly = size?.includes("icon");
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className={cn("animate-spin", iconSize)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {!isIconOnly && (loadingText || children)}
          </>
        ) : (
          <>
            {leftIcon && (
              <span
                className={cn("flex items-center justify-center", iconSize)}
              >
                {React.cloneElement(leftIcon as React.ReactElement, {
                  className: cn(iconSize, (leftIcon as any)?.props?.className),
                })}
              </span>
            )}
            {children}
            {rightIcon && (
              <span
                className={cn("flex items-center justify-center", iconSize)}
              >
                {React.cloneElement(rightIcon as React.ReactElement, {
                  className: cn(iconSize, (rightIcon as any)?.props?.className),
                })}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
