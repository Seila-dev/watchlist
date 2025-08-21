// useAnimeApi.ts
import { useState } from "react";
import apiAnime from "../services/animeApi";
import { AnimesProps, CardData, DataItem, Entry } from "@/types/ApiTypes";

// Função para normalizar rota animes and mangas
function normalizeOld(anime: AnimesProps): CardData {
  return {
    mal_id: anime.mal_id || 0,
    title: anime.title,
    score: anime.score,
    types: anime.type ? [anime.type] : null,
    aired_from: anime.aired?.from,
    image_url:
      anime.images?.jpg?.image_url ||
      anime.images?.webp?.large_image_url ||
      anime.images?.webp?.image_url || ''
  };
}

// Função para normalizar rota recomendações
function normalizeNew(item: DataItem): CardData[] {
  return item.entry.map((e: Entry) => ({
    mal_id: e.mal_id,
    title: e.title,
    image_url:
      e.images?.jpg?.image_url ||
      e.images?.webp?.large_image_url ||
      e.images?.webp?.image_url || ''
  }));
}

export default function useAnimeApi() {
  const [animes, setAnimes] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  const getTopAnimes = async () => {
    setLoading(true);
    try {

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await apiAnime.get("/top/anime");
      const normalized = response.data.data.map(normalizeOld);
      setAnimes(normalized);
    } catch (err) {
      console.error("Erro ao buscar top animes", err);
    } finally {
      setLoading(false);
    }
  };

  const getTopMangas = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/top/manga");
      const normalized = response.data.data.map(normalizeOld);
      setAnimes(normalized);
    } catch (err) {
      console.error("Erro ao buscar top mangas", err);
    } finally {
      setLoading(false);
    }
  };

  const getRecentRecommendationsAnime = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/recommendations/anime");
      const normalized = response.data.data.flatMap(normalizeNew);
      setAnimes(normalized);
    } catch (err) {
      console.error("Erro ao buscar recomendações", err);
    } finally {
      setLoading(false);
    }
  };

    const getRecentRecommendationsManga = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/recommendations/manga");
      const normalized = response.data.data.flatMap(normalizeNew);
      setAnimes(normalized);
    } catch (err) {
      console.error("Erro ao buscar recomendações", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    animes,
    loading,
    getTopAnimes,
    getTopMangas,
    getRecentRecommendationsAnime,
    getRecentRecommendationsManga
  };
}
