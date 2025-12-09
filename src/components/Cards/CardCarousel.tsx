// Atualmente fora de uso, talvez desatualizado. Carousel está na página Home.

'use client';

import React, { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { CardPreview } from "@/components/Cards/CardPreview";
import { CardSkeleton } from "@/components/Cards/CarouselSkeleton";
import { CardItem } from "@/types/content";

interface CardsCarouselProps {
  items?: CardItem[];
  itemsPerPage?: number;
  title?: string;
  loading?: boolean;
  updatingIds?: Set<string>;
  variant?: "watching" | "toWatch" | "finished";
  length?: number;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
}

export default function CardsCarousel({
  items = [],
  itemsPerPage = 15,
  title,
  loading = false,
  updatingIds = new Set(),
  variant = "watching",
  length,
  onScrollLeft,
  onScrollRight,
}: CardsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleScroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 350;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const cards = items || [];
  const emptyMessage = !loading && cards.length === 0 ? "Nenhum conteúdo encontrado" : "";

  return (
    <div className="relative w-full">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto overflow-y-hidden scroll-smooth gap-3 px-2 py-4 min-h-[320px] sm:min-h-[380px] custom-scrollbar"
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y", paddingBottom: "20px" }}
      >
        {loading && cards.length === 0 ? (
          <CardSkeleton count={6} />
        ) : (
          cards.map((item, index) => {
            const isUpdating = updatingIds.has(item.id);
            return (
              <div
                key={`${item.id}-${index}`}
                className={`flex-shrink-0 transition-all duration-300 ${
                  isUpdating ? "animate-pulse" : ""
                }`}
                style={{ overflow: "visible", position: "relative" }}
              >
                <CardPreview {...item} isUpdating={isUpdating} />
                {isUpdating && (
                  <div className="absolute -top-2 -right-2 z-20">
                    <div className="bg-primary-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Loader2 className="animate-spin" size={12} />
                      <span>Salvando...</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && cards.length > 0 && (
          <div className="flex-shrink-0 flex items-center justify-center w-72 h-96">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        )}
      </div>

      {!loading && cards.length === 0 && !emptyMessage.includes("Nenhum conteúdo encontrado") && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-400">
          <div className="text-4xl mb-3 opacity-50">🔍</div>
          <p>{emptyMessage}</p>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          transition: height 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
          margin: 0 16px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: bg-indigo-700;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #283593;
          height: 12px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: #283593;
          height: 12px;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar {
          height: 12px;
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #0066 transparent;
        }
      `}</style>
    </div>
  );
}