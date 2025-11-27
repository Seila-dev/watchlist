"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Popcorn, TowerControl } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ComputerIcon from '@/../public/assets/computer-icon.png'
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
            <StatusLabel
              title="Em andamento"
              length={watchingCards.length}
              variant="watching"
            />

            {watchingCards.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 my-5 text-center gap-3">
                <img 
                  src="./assets/computer-icon.png" 
                  alt="Computer icon" />

                <h3 className="text-lg font-semibold text-gray-500">Nenhum conteúdo em andamento</h3>

                <p className="text-sm text-gray-500 max-w-sm">
                  <a href="/new" className="underline text-gray-300">Adicione aqui</a> o que estiver assistindo ou lendo para não perder o ponto.
                </p>
              </div>
            ) : (
              <CardsCarousel items={watchingCards} />
            )}
          </section>


          <section className="w-full p-3 sm:px-10">
            <StatusLabel
              title="Minha lista"
              length={toWatchCards.length}
              variant="toWatch"
            />

            {toWatchCards.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 my-5 text-center gap-3">
                <img 
                  src="./assets/opened-box-icon.png" 
                  alt="Icone caixa aberta" />

                <h3 className="text-lg font-semibold text-gray-500">Sua Lista está Vazia</h3>

                <p className="text-sm text-gray-500 max-w-sm">
                  <a href="/new" className="underline text-gray-300">Adicione aqui</a> os conteúdos que você deseja começar em breve.
                </p>
              </div>
            ) : (
              <CardsCarousel items={toWatchCards} />
            )}
          </section>

          <section className="w-full p-3 sm:px-10">
            <StatusLabel
              title="Finalizados"
              length={completedCards.length}
              variant="finished"
            />

            {completedCards.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 my-5 text-center gap-3">
                <img 
                  src="./assets/notes-icon.png" 
                  alt="Icone de bloco de anotações" />

                <h3 className="text-lg font-semibold text-gray-500">Finalizou um conteúdo?</h3>

                <p className="text-sm text-gray-500 max-w-sm">
                  Edite o status para ele aparecer aqui.
                </p>
              </div>
            ) : (
              <CardsCarousel items={completedCards} />
            )}
          </section>
        </>
      )}

    </main>

  );
}