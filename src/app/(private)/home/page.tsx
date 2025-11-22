"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Popcorn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CardsCarousel from "@/components/Cards/CardCarousel";
import { StatusLabel } from "@/components/StatusLabel";

import Nav from "@/components/Nav"
import useContents from "@/hooks/useContents";
import { Content } from "@/services/ContentService";
import { CardData } from "@/types/ApiTypes";

export default function Home() {
  const {
    contents,
    loading,
    error,
    fetchContents,
    updateStatus
  } = useContents();

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Callback para mudanças de filtros (opcional)
  const handleFiltersChange = useCallback((filters: {
    type: string;
    sortBy: string;
    search: string;
  }) => {
    // Salvar no localStorage, contexto, analytics, etc.
    if (typeof window !== 'undefined') {
      localStorage.setItem('carousel-filters', JSON.stringify(filters));
    }
  }, []);

  const contentsByStatus = useMemo(() => {
    return {
      watching: contents.filter(c => c.status === 'WATCHING'),
      toWatch: contents.filter(c => c.status === 'TO_WATCH'),
      finished: contents.filter(c => c.status === 'FINISHED'),
    };
  }, [contents]);

  const convertToCardData = (items: Content[]): CardData[] => {
    return items.map(item => ({
      mal_id: parseInt(item.externalId || '0') || 0,
      title: item.title,
      score: item.rating || null,
      types: [item.category],
      aired_from: item.createdAt || null,
      coverUrl: item.coverUrl || ''
    }));
  };

  // Handler para mudança de status (quando usuário mover card)
  const handleStatusChange = async (contentId: string, newStatus: 'WATCHING' | 'TO_WATCH' | 'FINISHED') => {
    await updateStatus(contentId, newStatus);
  };

  const watchingCards = convertToCardData(contentsByStatus.watching);
  const toWatchCards = convertToCardData(contentsByStatus.toWatch);
  const completedCards = convertToCardData(contentsByStatus.finished);

  return (
    <main className=" text-white flex flex-col min-h-screen m-auto gap-0 transition duration-200 w-full">
      <Nav />

      {loading && contents.length === 0 && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-400">Carregando seus conteúdos...</p>
          </div>
        </div>
      )}

      {/* Error State Global */}
      {error && (
        <div className="mx-auto max-w-2xl p-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
            <p className="font-semibold mb-2">Erro ao carregar conteúdos</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => fetchContents()}
              className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Carousel Principal - Com todos os filtros */}

      {!loading && !error && (
        <>
          <section className="w-full p-3 sm:px-10">
            <StatusLabel title="Assistindo / Lendo" length={watchingCards.length} variant="watching" />
            <CardsCarousel items={watchingCards} />
          </section>

          <section className="w-full p-3 sm:px-10">
            <StatusLabel title="Pra assistir" length={toWatchCards.length} variant="toWatch" />
            <CardsCarousel items={toWatchCards} />
          </section>

          <section className="w-full p-3 sm:px-10">
            {/* <StatusLabel title="Finalizados" length={395} variant="finished" />
        <CardsCarousel
          initialType="manga"
          initialSortBy="trending"
          itemsPerPage={10}
        // itemsToScrollPerClick={2}
        // showFilters={false}
        /> */}
            <StatusLabel title="Finalizados" length={completedCards.length} variant="finished" />
            <CardsCarousel items={completedCards} />

          </section>
        </>
      )}

    </main>

  );
}