"use client";
import { Clock, BookmarkSimple, Check, CaretRight } from "phosphor-react";
import React from "react";

interface StatusLabelProps {
  variant?: "watching" | "toWatch" | "finished";
  title?: string;
  length?: number;
}

const variantStyles = {
  watching: {
    bg: "bg-gradient-to-r from-secondary-900/20 to-transparent text-primary-200",
    icon: <Clock size={25} className="text-primary-200" />,
  },
  toWatch: {
    bg: "bg-[#F59E0B]/20",
    icon: <BookmarkSimple size={25} className="text-yellow-400" />,
  },
  finished: {
    bg: "bg-[#047857]/20",
    icon: <Check size={25} className="text-green-500" />,
  },
};

export function StatusLabel({
  variant = "watching",
  title,
  length,
}: StatusLabelProps) {
  const { bg, icon } = variantStyles[variant];

  return (
    <div
      className={`
        py-3 px-6 mb-1 flex items-center justify-between rounded-lg
        ${bg} 
      `}
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center">
          {React.cloneElement(icon, {
            size: 18, // celular
            className: "sm:w-5 sm:h-5 md:w-6 md:h-6 " + icon.props.className,
          })}
        </span>

        <span className="status-label-title font-medium text-sm sm:text-base md:text-lg">
          {title}
        </span>
        {length !== undefined && (
          <span className="text-gray-500 text-sm sm:text-base"> | {length}</span>
        )}
      </div>
      <button className="flex justify-center items-center gap-2 text-white text-xs sm:text-base hover:underline">Lista completa <CaretRight /> </button>
    </div>
  );
}
