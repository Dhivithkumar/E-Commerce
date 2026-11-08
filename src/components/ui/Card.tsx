"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "ivory" | "cream" | "forest";
  hoverable?: boolean;
}

export function Card({
  className,
  variant = "surface",
  hoverable = false,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    surface: "bg-elora-surface border-elora-border text-elora-charcoal shadow-sm",
    ivory: "bg-elora-ivory border-elora-border text-elora-charcoal",
    cream: "bg-elora-cream border-elora-border text-elora-charcoal",
    forest: "bg-elora-forest border-elora-sand/20 text-elora-ivory",
  };

  return (
    <div
      className={cn(
        "rounded-sm border p-6 transition-all duration-300",
        variantStyles[variant],
        hoverable && "hover:border-elora-taupe/40 hover:shadow-luxury",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

