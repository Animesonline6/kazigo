"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-navy-700 text-white hover:bg-navy-600 active:bg-navy-800 disabled:bg-navy-200",
  secondary:
    "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700 disabled:bg-teal-200",
  outline:
    "border border-border-strong bg-transparent text-ink hover:border-navy-700 hover:bg-navy-50 active:bg-navy-100 disabled:text-ink-faint disabled:border-border",
  ghost:
    "bg-transparent text-ink hover:bg-surface-muted active:bg-border disabled:text-ink-faint",
  danger:
    "bg-danger text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-200",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, fullWidth, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-sm font-semibold transition-colors duration-150",
          "disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
