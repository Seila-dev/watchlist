"use client";
import { Clock, BookmarkSimple, Check } from "phosphor-react";

interface StatusLabelProps {
  variant?: "watching" | "toWatch" | "finished";
  title?: string;
  length?: number;
  // última atualização: 25/08/2025 - Mauricio Chiapetta
}

const variantStyles = {
  watching: {
    bg: "bg-gradient-to-r from-purple-900 to-gray-900",
    icon: <Clock size={25} />,
  },
  toWatch: {
    bg: "bg-gradient-to-r from-[#F59E0B] to-gray-900",
    icon: <BookmarkSimple size={25} className="text-yellow-400" />,
  },
  finished: {
    bg: "bg-gradient-to-r from-[#047857] to-gray-900",
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
      className={`py-2 px-6 flex items-center justify-between rounded-lg ${bg}`}
    >
      <div className="flex items-center gap-2 text-gray-300">
        <span>{icon}</span>
        <span className="status-label-title font-medium text-indigo-50">
          {title}
        </span>
        {length !== undefined && (
          <span className="text-gray-500"> | {length}</span>
        )}
      </div>
      <button className="text-white">Ver todos</button>
    </div>
  );
}
