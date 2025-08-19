"use client";

import { CardData } from "@/types/ApiTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { CardPreview } from "@/components/Cards/CardPreview";

interface CardsCarouselProps {
  cards: CardData[];
}

export default function CardsCarousel({ cards }: CardsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="relative overflow-hidden w-full">
      {/* seta esquerda */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full hidden md:flex cursor-pointer transition-all duration-200 backdrop-blur-sm border border-gray-700"
        aria-label="Scroll Left"
      >
        <ChevronLeft size={20} />
      </button>

      {/* trilho do carrossel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-6 px-4 max-w-full"
      >
        {cards.map((item) => (
          <div key={item.mal_id} className="flex-shrink-0">
            <CardPreview {...item} />
          </div>
        ))}
      </div>

      {/* seta direita */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full hidden md:flex cursor-pointer transition-all duration-200 backdrop-blur-sm border border-gray-700"
        aria-label="Scroll Right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
