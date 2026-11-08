"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "bestseller" | "clinical" | "botanical" | "sale" | "success" | "neutral" | "dark";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    bestseller: "bg-elora-forest text-elora-sand border-elora-sand/30",
    clinical: "bg-elora-sand/20 text-elora-forest border-elora-taupe/40",
    botanical: "bg-[#3D5244]/10 text-[#2D4536] border-[#3D5244]/30",
    sale: "bg-[#7A3E3E]/10 text-[#7A3E3E] border-[#7A3E3E]/30",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    neutral: "bg-elora-cream/60 text-elora-charcoal border-elora-border",
    dark: "bg-elora-charcoal text-elora-ivory border-elora-charcoal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[9px] uppercase tracking-ultra font-sans font-medium rounded-full border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

