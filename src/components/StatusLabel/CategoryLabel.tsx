"use client";
import React from "react";
import { Clock, BookmarkSimple, Check } from "phosphor-react";

export type ContentStatus = "WATCHING" | "TO_WATCH" | "FINISHED";

interface CategoryLabelProps {
  variant: ContentStatus;
  onClick?: () => void;
  as?: "span" | "button";
  className?: string;
}

const STATUS_CONFIG: Record<
  ContentStatus,
  {
    title: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    styles: string;
  }
> = {
  WATCHING: {
    title: "Assistindo",
    Icon: Clock,
    styles: "bg-secondary-900/40 text-primary-200",
  },
  TO_WATCH: {
    title: "Minha lista",
    Icon: BookmarkSimple,
    styles: "bg-yellow-400/40 text-gray-200",
  },
  FINISHED: {
    title: "Finalizado",
    Icon: Check,
    styles: "bg-green-600/20 text-green-300",
  },
};

export function CategoryLabel({
  variant,
  onClick,
  as = "span",
  className = "",
}: CategoryLabelProps) {
  const { title, Icon, styles } = STATUS_CONFIG[variant];
  const Component = as as any;

  return (
    <Component
      role={as === "span" ? "button" : undefined}
      tabIndex={as === "span" ? 0 : undefined}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 rounded-full
        text-sm font-medium
        select-none cursor-pointer
        hover:opacity-80 transition-opacity
        ${styles}
        ${className}
      `}
      aria-label={`Status: ${title}`}
    >
      <Icon size={16} className="shrink-0" />

      <span className="whitespace-nowrap">
        {title}
      </span>
    </Component>
  );
}
