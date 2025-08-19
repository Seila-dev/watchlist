"use client";

import { useEffect } from "react";
import useAnimeApi from "@/hooks/useAnimeApi";
import { CardSkeleton } from "@/components/Cards/CardSkeleton";
import Carousel from "@/components/Cards/CardCarousel"; // 👈 importa o carrossel
import { Library, Popcorn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CardsCarousel from "@/components/Cards/CardCarousel";

export default function Home() {
  const { animes, loading, getTopAnimes } = useAnimeApi();

  useEffect(() => {
    getTopAnimes();
  }, []);

  return (
    <div className="bg-background text-white flex flex-col min-h-screen m-auto gap-8 transation duration-200 w-full">
      <div className="w-full flex p-8 items-center">
        {loading ? (
          // skeletons
          <div className="relative overflow-hidden w-full">
            <div className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-6 px-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex-shrink-0">
                  <CardSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : animes.length === 0 ? (
          // vazio
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto mt-20">
            <div className="text-5xl mb-4">
              <Popcorn />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Nada em andamento por aqui
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              <Button variant='link' className="p-0 underline underline-offset-4">
                <Link href='/create'>Adicione</Link>
              </Button>{" "}
              o que está vendo ou lendo para não perder o ponto onde parou.
            </p>
          </div>
        ) : (
          // carrossel
          <CardsCarousel cards={animes} />
        )}

      </div>
    </div>
  );
}
