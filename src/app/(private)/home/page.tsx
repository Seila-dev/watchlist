"use client"

import { useEffect, useState } from "react";
import apiAnime from "@/hooks/useAnimeApi";

interface Anime {
  mal_id: number;
  title: string;
  score: string;
  images: {
    jpg: {
      image_url: string;
    }
  };
}

export default function Home() {

  const [listAnimes, setListAnimes] = useState<Anime[]>([]);


  async function loadAnimes() {
    try {
      const response = await apiAnime.get('/top/anime');
      console.log(response.data)
      setListAnimes(response.data.data);
    } catch (error: any) {
      console.log('Erro ao buscar projetos');
    }
  }

  useEffect(() => {
    loadAnimes();
  }, [])


  return (
    <div className=" bg-background flex items-center justify-center flex-col gap-4 h-screen">
      <h1 className="text-gray-400 text-4xl">HOME PAGE</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {listAnimes.map(anime => (
          <div key={anime.mal_id} className="flex flex-col border p-2 rounded shadow">
            <h2 className="text-lg font-semibold text-white">{anime.title}</h2>
            <h2 className="text-lg font-semibold text-white">Score: {anime.score}</h2>
            <img src={anime.images.jpg.image_url} alt={anime.title} width={150} />
          </div>
        ))}
      </div>
    </div>
  );
}
