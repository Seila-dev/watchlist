'use client';

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CardPreview } from "@/components/Cards/CardPreview";
import { CardSkeleton } from "@/components/Cards/CarouselSkeleton";
import { CardItem } from "@/types/content";
interface CardsCarouselProps {
  items?: CardItem[];
  itemsPerPage?: number;
  title?: string;
  loading?: boolean;
  updatingIds?: Set<string>; // IDs dos cards sendo atualizados
}

export default function CardsCarousel({
  items = [],
  itemsPerPage = 15,
  title,
  loading = false,
  updatingIds = new Set(),
}: CardsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Scroll drag (implementação simples)
  // let isDown = false;
  // let startX = 0;
  // let scrollLeft = 0;
  //   const [supportsHover, setSupportsHover] = useState<boolean>(() => {
  //   if (typeof window === "undefined") return true;
  //   return window.matchMedia("(hover: hover)").matches;
  // });
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const mq = window.matchMedia("(hover: hover)");
  //   const handler = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
  //   setSupportsHover(mq.matches);
  //   if ("addEventListener" in mq) {
  //     mq.addEventListener("change", handler);
  //   } else {
  //     (mq as any).addListener?.(handler);
  //   }
  //   return () => {
  //     if ("removeEventListener" in mq) {
  //       mq.removeEventListener("change", handler);
  //     } else {
  //       (mq as any).removeListener?.(handler);
  //     }
  //   };
  // }, []);

  // const handleMouseDown = (e: React.MouseEvent) => {
  //   if (!carouselRef.current) return;
  //   isDown = true;
  //   setIsDragging(true);
  //   startX = e.pageX - carouselRef.current.offsetLeft;
  //   scrollLeft = carouselRef.current.scrollLeft;
  // };

  // const handleMouseLeaveOrUp = () => {
  //   isDown = false;
  //   setIsDragging(false);
  // };

  // const handleMouseMove = (e: React.MouseEvent) => {
  //   if (!isDown || !carouselRef.current) return;
  //   e.preventDefault();
  //   const x = e.pageX - carouselRef.current.offsetLeft;
  //   const walk = (x - startX) * 1.5;
  //   carouselRef.current.scrollLeft = scrollLeft - walk;
  // };

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
    <div className="w-full space-y-4">
      {title && <h2 className="text-2xl font-bold text-white px-4">{title}</h2>}

      <div className="relative w-full">
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full flex items-center justify-center bg-gray-900/80 border border-gray-800 text-whitetransition duration-200"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={carouselRef}
          // onMouseDown={handleMouseDown}
          // onMouseLeave={handleMouseLeaveOrUp}
          // onMouseUp={handleMouseLeaveOrUp}
          // onMouseMove={handleMouseMove}
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

        <button
          onClick={() => handleScroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full flex items-center justify-center bg-gray-900/80 border border-gray-800 text-white transition duration-200"
        >
          <ChevronRight size={20} />
        </button>
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
          scrollbar-color: #283593 transparent;
        }
        
        .custom-scrollbar:hover {
          // scrollbar-width: auto;
        }
      `}</style>
    </div>
  );
}