"use client";
import { Clock, BookmarkSimple, Check } from "phosphor-react";

interface StatusLabelProps {
  variant?: "watching" | "wantToSee" | "finished";
  title?: string;
  length?: number;
}

// Cores base com opacidade + blur
const variantStyles = {
  watching: {
    bg: "bg-gradient-to-r from-secondary-900/20 to-transparent text-primary-200",// semitransparente
    icon: <Clock size={25} className="text-primary-200" />,
  },
  wantToSee: {
    bg: "bg-[#F59E0B]/20", // ajustado para escurecer melhor
    icon: <BookmarkSimple size={25} className="text-yellow-400" />,
  },
  finished: {
    bg: "bg-[#047857]/20", // verde escuro com opacidade
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
        py-3 px-6 mb-5 flex items-center justify-between rounded-lg
        ${bg} 
      `}
    >
      <div className="flex items-center gap-2  ">
        <span>{icon}</span>
        <span className="status-label-title font-medium ">
          {title}
        </span>
        {length !== undefined && (
          <span className="text-gray-500"> | {length}</span>
        )}
      </div>
      <button className="text-white text-sm underline">Ver todos</button>
    </div>
  );
}
