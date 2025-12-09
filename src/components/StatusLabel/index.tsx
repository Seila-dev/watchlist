"use client";
import { Clock, BookmarkSimple, Check, CaretLeft, CaretRight } from "phosphor-react";
import React from "react";

interface StatusLabelProps {
  variant?: "watching" | "toWatch" | "finished";
  title?: string;
  length?: number;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
}

const variantStyles = {
  watching: {
    bg: "bg-gradient-to-r from-secondary-900/20 to-transparent text-primary-200",
    icon: <Clock size={25} className="text-primary-200" />,
  },
  toWatch: {
    bg: "bg-gradient-to-r from-[#F59E0B]/20 to-transparent text-primary-200",
    icon: <BookmarkSimple size={25} className="text-yellow-400" />,
  },
  finished: {
    bg: "bg-gradient-to-r from-[#047857]/20 to-transparent text-primary-200",
    icon: <Check size={25} className="text-green-500" />,
  },
};

export function StatusLabel({
  variant = "watching",
  title,
  length,
  onScrollLeft,
  onScrollRight,
}: StatusLabelProps) {
  const { bg, icon } = variantStyles[variant];

  return (
    <div
      className={`
        py-3 px-6 mb-1 flex items-center justify-between rounded-lg
        ${bg} 
      `}
    >
      <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="flex items-center justify-center">
          {React.cloneElement(icon, {
            size: 18,
            className: "sm:w-5 sm:h-5 md:w-6 md:h-6 " + icon.props.className,
          })}
        </span>

        <span className="status-label-title font-medium text-sm sm:text-base md:text-lg hover:underline">
          {title}
        </span>
        {length !== undefined && (
          <span className="text-gray-500 text-sm sm:text-base"> | {length}</span>
        )}
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onScrollLeft}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          aria-label="Scroll left"
        >
          <CaretLeft size={20} className="text-gray-200" weight="bold" />
        </button>
        <button
          onClick={onScrollRight}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          aria-label="Scroll right"
        >
          <CaretRight size={20} className="text-gray-200" weight="bold" />
        </button>
      </div>
    </div>
  );
}