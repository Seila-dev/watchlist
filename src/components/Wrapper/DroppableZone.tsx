'use client';

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableZoneProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper universal para zonas droppable
 * Garante que a zona sempre existe, mesmo sem conteúdo
 */
export function DroppableZone({ id, children, className = "" }: DroppableZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-200 ${
        isOver ? "bg-purple-900/10 rounded-xl" : ""
      } ${className}`}
    >
      {children}
      
      {isOver && (
        <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-purple-500 rounded-xl z-10" />
      )}
    </div>
  );
}