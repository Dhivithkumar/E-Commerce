"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SectionHeadingProps {
  subtitle?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: "left" | "center" | "right";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  const alignmentStyles = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn(
        "flex flex-col max-w-2xl mb-12 lg:mb-16",
        alignmentStyles[align],
        className
      )}
    >
      {subtitle && (
        <span
          className={cn(
            "text-[10px] sm:text-xs uppercase font-sans tracking-ultra font-medium mb-3.5",
            isDark ? "text-elora-sand" : "text-elora-taupe"
          )}
        >
          {subtitle}
        </span>
      )}
      <h2
        className={cn(
          "font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight",
          isDark ? "text-elora-ivory" : "text-elora-charcoal"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-xs sm:text-sm leading-relaxed font-sans font-light",
            isDark ? "text-elora-sand/80" : "text-elora-gray"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

