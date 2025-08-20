"use client"

import { useEffect } from "react";
import useAnimeApi from "@/hooks/useAnimeApi";
import { CardPreview } from "@/components/Cards/CardPreview";
import { CardSkeleton } from "@/components/Cards/CardSkeleton";
import Nav from "@/components/Nav/Nav";


export default function Home() {

  const { animes, loading, getTopAnimes } = useAnimeApi();

  useEffect(() => {
    getTopAnimes()
  }, [])

  return (
    <main className="bg-background min-h-screen">


      <div className="mx-auto  px-4 sm:px-6 lg:px-8">
        <Nav />

        <div className="bg-background flex flex-col items-center justify-center gap-4 min-h-screen">
          <div className="flex flex-wrap gap-10 justify-center p-8">
            {loading
              ? Array(10)
                .fill(0)
                .map((_, i) => <CardSkeleton key={i} />)
              : animes.map((anim) => <CardPreview key={anim.mal_id} {...anim} />)}
          </div>
        </div>
      </div>
    </main>

  );

}
