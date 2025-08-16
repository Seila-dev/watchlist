"use client"

import { useEffect } from "react";
import useAnimeApi from "@/hooks/useAnimeApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardPreview } from "@/components/Cards/CardPreview";

interface Anime {
  mal_id: number;
  title: string;
  score: string;
  type: string;
  aired: {
    from: string | null;
  },
  images: {
    jpg: {
      image_url: string;
    };
  };
}

export default function Home() {

  const { animes, getTopAnimes } = useAnimeApi();

  useEffect(() => {
    getTopAnimes()
  }, [])

  return (
    <div className=" bg-background flex items-center justify-center flex-col gap-4 min-h-screen">

      <div className="flex flex-wrap gap-10 justify-center p-8">
        {animes.map((anim) => (
          <CardPreview
            key={anim.mal_id}
            {...anim}
          />
        ))}
      </div>
    </div>
  );
}
