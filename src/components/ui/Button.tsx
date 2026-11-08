"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "forest" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans uppercase tracking-luxury text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elora-taupe/50 disabled:opacity-50 disabled:pointer-events-none select-none rounded-sm active:scale-[0.99]";

    const variantStyles = {
      primary:
        "bg-elora-sand text-elora-forest hover:bg-elora-taupe hover:text-white shadow-sm border border-transparent",
      forest:
        "bg-elora-forest text-elora-ivory hover:bg-elora-forest/90 hover:shadow-luxury border border-transparent",
      secondary:
        "bg-elora-cream text-elora-charcoal hover:bg-elora-border hover:text-elora-forest border border-elora-border",
      outline:
        "bg-transparent text-elora-charcoal border border-elora-charcoal/30 hover:border-elora-charcoal hover:bg-elora-charcoal/5",
      ghost:
        "bg-transparent text-elora-charcoal hover:bg-elora-cream/40 hover:text-elora-taupe",
      link:
        "bg-transparent text-elora-taupe hover:text-elora-forest underline-offset-4 hover:underline p-0 h-auto tracking-normal lowercase first-letter:uppercase",
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-[11px]",
      md: "h-11 px-6 text-xs",
      lg: "h-13 px-8 text-xs sm:text-sm tracking-widest",
      icon: "h-10 w-10 p-0 rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

