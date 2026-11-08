"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 sm:p-16 bg-elora-surface/60 border border-elora-border rounded-sm max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-full bg-elora-cream/60 flex items-center justify-center text-elora-taupe mb-5 border border-elora-border">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-editorial text-2xl text-elora-charcoal mb-2 font-normal">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-elora-gray max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        actionHref ? (
          <Link href={actionHref}>
            <Button variant="forest" size="md">
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
        ) : (
          <Button variant="forest" size="md" onClick={onAction}>
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Button>
        )
      )}
    </div>
  );
}

