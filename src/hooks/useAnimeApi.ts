import { useState, useEffect } from "react";
import apiAnime from "../services/animeApi";


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

export default function useAnimeApi(searchTerm: string = "") {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  // Função genérica para pegar recentes recomendações de anime
  const getRecentRecomenmendationsAnime = async () => {
    setLoading(true);
    try {
      //https://api.jikan.moe/v4/recommendations/anime
      const response = await apiAnime.get("/recommendations/anime");
      setAnimes(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar top animes", err);
    } finally {
      setLoading(false);
    }
  };

  // Função genérica para pegar recentes recomendações de manga
  const getRecentRecomenmendationsManga = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/recommendations/manga");
      setAnimes(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar top animes", err);
    } finally {
      setLoading(false);
    }
  };

  // Função genérica para pegar top animes
  const getTopAnimes = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/top/anime");
      setAnimes(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar top animes", err);
    } finally {
      setLoading(false);
    }
  };

  // Função genérica para pegar top mangas
  const getTopManga = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/top/manga");
      setAnimes(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar top animes", err);
    } finally {
      setLoading(false);
    }
  };

  // Função genérica para pegar top people
  const getTopPeople = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/top/people");
      setAnimes(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar top animes", err);
    } finally {
      setLoading(false);
    }
  };

  // Função genérica para pegar top characteres
  const getTopChacacteres = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/top/characters");
      setAnimes(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar top animes", err);
    } finally {
      setLoading(false);
    }
  };

  // Função genérica para pegar top reviews
  const getTopReviews = async () => {
    setLoading(true);
    try {
      const response = await apiAnime.get("/top/reviews");
      setAnimes(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar top animes", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar animes por termo
  const searchAnime = async (term: string) => {
    if (!term) return;
    setLoading(true);
    try {
      const response = await apiAnime.get(`/anime?q=${term}`);
      setAnimes(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar anime", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para pegar anime por ID
  const getAnimeById = async (id: number) => {
    setLoading(true);
    try {
      const response = await apiAnime.get(`/anime/${id}`);
      return response.data;
    } catch (err) {
      console.error("Erro ao buscar anime por ID", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    animes,
    loading,
    getTopAnimes,
    getTopChacacteres,
    getTopManga,
    getTopPeople,
    getTopReviews,
    searchAnime,
    getAnimeById,
    getRecentRecomenmendationsAnime,
    getRecentRecomenmendationsManga
  };
}
