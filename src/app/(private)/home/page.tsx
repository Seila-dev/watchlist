"use client";

import { useCallback } from "react";
import { Popcorn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CardsCarousel from "@/components/Cards/CardCarousel";
import { StatusLabel } from "@/components/StatusLabel";

import Nav from "@/components/Nav"

export default function Home() {
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

  return (
    <main className=" text-white flex flex-col min-h-screen m-auto gap-0 transition duration-200 w-full">
      <Nav />
      
      {/* Carousel Principal - Com todos os filtros */}
      <section className="w-full p-3 sm:p-10">
        <StatusLabel title="Assistindo / Lendo" length={8} variant="watching" />
        <CardsCarousel
          initialType="all"
          initialSortBy="score"
          itemsPerPage={15}
          // itemsToScrollPerClick={1}
          // showFilters={false}
          // onFiltersChange={handleFiltersChange}
        />
      </section>

      {/* Carousel de Animes Populares - Sem filtros */}
      <section className="w-full p-3">
        <StatusLabel title="Assistir / Ver" variant="wantToSee" />
        <CardsCarousel
          initialType="anime"
          initialSortBy="title"
          itemsPerPage={12}
          // itemsToScrollPerClick={1}
          // showFilters={false}
        />
      </section>

      {/* Carousel de Filmes em Alta */}
      <section className="w-full p-3">
        <StatusLabel title="Finalizados" variant="finished" />
        <CardsCarousel
          initialType="manga"
          initialSortBy="trending"
          itemsPerPage={10}
          // itemsToScrollPerClick={2}
          // showFilters={false}
        />
      </section>
    </main>
  );
}