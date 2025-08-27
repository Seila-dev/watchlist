"use client";

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CardPreview } from "@/components/Cards/CardPreview";
import { searchJikan, getTopJikan } from "@/lib/jikan";
import { searchTMDB, getTrendingTMDB } from "@/lib/tmdb";
import { CardData } from "@/types/ApiTypes";
import type { ContentItem } from "@/types/tagsTypes";

import { canon, contentItemToCardData } from "@/lib/utils";
import { useCarousel } from "./useCarousel";
import { CardSkeleton } from "./CarouselSkeleton";

export type ContentType = "anime" | "manga" | "movie" | "tv" | "all";
export type SortBy = "score" | "title" | "popularity" | "trending";
export type SortOrder = "asc" | "desc";

interface CardsCarouselProps {
  initialType?: ContentType;
  initialSortBy?: SortBy;
  initialSearch?: string;

  itemsPerPage?: number;
  itemsToScrollPerClick?: number;

  title?: string;
  showFilters?: boolean;

  onFiltersChange?: (filters: {
    type: ContentType;
    sortBy: SortBy;
    search: string;
  }) => void;
}

export default function CardsCarousel({
  initialType = "all",
  initialSortBy = "score",
  initialSearch = "",
  itemsPerPage = 15,
  itemsToScrollPerClick = 1,
  title,
  showFilters = true,
  onFiltersChange,
}: CardsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    type: initialType,
    sortBy: initialSortBy,
    search: initialSearch,
  });

  // hook de scroll + drag
  const { canScrollLeft, canScrollRight, scrollBy } = useCarousel({
    containerRef: carouselRef as RefObject<HTMLDivElement>,
    itemsToScrollPerClick,
    gapPx: 24,
  });

  // busca centralizada com tratamento de falhas por fonte
  const fetchData = useCallback(
    async (searchQuery: string, contentType: ContentType, sortBy: SortBy) => {
      setLoading(true);
      setError(null);
      try {
        let contentItems: ContentItem[] = [];

        const q = (searchQuery || "").trim();
        const c = canon(contentType);

        // helper para tentar buscar de uma fonte e ignorar falhas dessa fonte
        const safeFetch = async (fn: () => Promise<ContentItem[]>) => {
          try {
            const res = await fn();
            if (Array.isArray(res)) contentItems.push(...res);
          } catch (e) {
            console.warn("Erro em uma fonte:", e);
          }
        };

        // movies
        if (contentType === "movie" || (contentType === "all" && !q)) {
          await safeFetch(() => (q ? searchTMDB("movie", q) : getTrendingTMDB("movie", "week")));
        }

        // tv
        if (contentType === "tv" || (contentType === "all" && !q)) {
          await safeFetch(() => (q ? searchTMDB("tv", q) : getTrendingTMDB("tv", "week")));
        }

        // anime
        if (contentType === "anime" || (contentType === "all" && !q)) {
          await safeFetch(() => (q ? searchJikan("anime", q) : getTopJikan("anime", 1)));
        }

        // manga
        if (contentType === "manga" || (contentType === "all" && !q)) {
          await safeFetch(() => (q ? searchJikan("manga", q) : getTopJikan("manga", 1)));
        }

        // Ordena
        if (sortBy === "score") {
          contentItems.sort((a, b) => (b.score || 0) - (a.score || 0));
        } else if (sortBy === "title") {
          contentItems.sort((a, b) => a.title.localeCompare(b.title));
        }

        // limita
        const limited = contentItems.slice(0, itemsPerPage);
        const cardData = limited.map(contentItemToCardData);
        setCards(cardData);
        // reset scroll position (visualmente)
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ left: 0 });
        }
      } catch (err: any) {
        console.error("Erro geral ao buscar:", err);
        setError(err?.message || "Erro ao carregar dados");
        setCards([]);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Debounce manual simples (300ms) para busca quando filtros mudam
  useEffect(() => {
    const t = setTimeout(() => {
      fetchData(filters.search, filters.type as ContentType, filters.sortBy as SortBy);
      onFiltersChange?.(filters);
    }, 300);
    return () => clearTimeout(t);
  }, [filters, fetchData, onFiltersChange]);

  const updateFilter = useCallback(
    <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const onClickLeft = useCallback(() => scrollBy("left"), [scrollBy]);
  const onClickRight = useCallback(() => scrollBy("right"), [scrollBy]);

  const emptyMessage = useMemo(() => {
    if (filters.search) return `Nenhum resultado encontrado para "${filters.search}"`;
    return "Nenhum conteúdo encontrado";
  }, [filters.search]);

  return (
    <div className="w-full space-y-4" >
      {(title || showFilters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4">
          {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}

          {showFilters && (
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={filters.type}
                onChange={(e) => updateFilter("type", e.target.value as ContentType)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="all">Todos</option>
                <option value="anime">Anime</option>
                <option value="manga">Mangá</option>
                <option value="movie">Filmes</option>
                <option value="tv">Séries</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value as SortBy)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="score">Melhor Avaliação</option>
                <option value="title">A-Z</option>
                <option value="popularity">Popular</option>
                <option value="trending">Em Alta</option>
              </select>

              <input
                type="text"
                placeholder="Buscar..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-40"
                disabled={loading}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="px-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden w-full">
        <button
          onClick={onClickLeft}
          disabled={!canScrollLeft || loading}
          aria-label="Scroll Left"
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full hidden md:flex cursor-pointer transition-all duration-200 backdrop-blur-sm border border-gray-700 ${
            canScrollLeft && !loading
              ? "bg-black/70 hover:bg-black/90 text-white"
              : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <div
  ref={carouselRef}
  className="flex overflow-x-hidden scroll-smooth gap-6 px-0 max-w-full"
  style={{
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
    touchAction: "pan-y" // <- importante: evita que o navegador capture gestos horizontais
  }}
  role="list"
  aria-label={title ?? "Carousel de conteúdo"}
>
          {loading && cards.length === 0 ? (
            <CardSkeleton count={6} />
          ) : (
            cards.map((item, index) => (
              <div key={`${item.mal_id}-${index}`} className="flex-shrink-0">
                <CardPreview {...item} />
              </div>
            ))
          )}

          {loading && cards.length > 0 && (
            <div className="flex-shrink-0 flex items-center justify-center w-72 h-96">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          )}
        </div>

        <button
          onClick={onClickRight}
          disabled={!canScrollRight || loading}
          aria-label="Scroll Right"
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full hidden md:flex cursor-pointer transition-all duration-200 backdrop-blur-sm border border-gray-700 ${
            canScrollRight && !loading
              ? "bg-black/70 hover:bg-black/90 text-white"
              : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {!loading && cards.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-4xl mb-3 opacity-50">🔍</div>
          <p className="text-gray-400 text-center">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
