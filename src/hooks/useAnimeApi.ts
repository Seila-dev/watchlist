// // useAnimeApi.ts
// import { useState } from "react";
// import apiAnime from "../services/animeApi";
// import { AnimesProps, CardData, DataItem, Entry } from "@/types/ApiTypes";

// // Função para normalizar rota animes and mangas
// function normalizeOld(anime: AnimesProps): CardData {
//   return {
//     mal_id: anime.mal_id || 0,
//     title: anime.title,
//     score: anime.score,
//     types: anime.type ? [anime.type] : null,
//     aired_from: anime.aired?.from,
//     image_url:
//       anime.images?.jpg?.image_url ||
//       anime.images?.webp?.large_image_url ||
//       anime.images?.webp?.image_url || ''
//   };
// }

// // Função para normalizar rota recomendações
// function normalizeNew(item: DataItem): CardData[] {
//   return item.entry.map((e: Entry) => ({
//     mal_id: e.mal_id,
//     title: e.title,
//     image_url:
//       e.images?.jpg?.image_url ||
//       e.images?.webp?.large_image_url ||
//       e.images?.webp?.image_url || ''
//   }));
// }

// export default function useAnimeApi() {
//   const [animes, setAnimes] = useState<CardData[]>([]);
//   const [loading, setLoading] = useState(true);

//   const getTopAnimes = async () => {
//     setLoading(true);
//     try {

//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       const response = await apiAnime.get("/top/anime");
//       const normalized = response.data.data.map(normalizeOld);
//       setAnimes(normalized);
//     } catch (err) {
//       console.error("Erro ao buscar top animes", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTopMangas = async () => {
//     setLoading(true);
//     try {
//       const response = await apiAnime.get("/top/manga");
//       const normalized = response.data.data.map(normalizeOld);
//       setAnimes(normalized);
//     } catch (err) {
//       console.error("Erro ao buscar top mangas", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRecentRecommendationsAnime = async () => {
//     setLoading(true);
//     try {
//       const response = await apiAnime.get("/recommendations/anime");
//       const normalized = response.data.data.flatMap(normalizeNew);
//       setAnimes(normalized);
//     } catch (err) {
//       console.error("Erro ao buscar recomendações", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//     const getRecentRecommendationsManga = async () => {
//     setLoading(true);
//     try {
//       const response = await apiAnime.get("/recommendations/manga");
//       const normalized = response.data.data.flatMap(normalizeNew);
//       setAnimes(normalized);
//     } catch (err) {
//       console.error("Erro ao buscar recomendações", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     animes,
//     loading,
//     getTopAnimes,
//     getTopMangas,
//     getRecentRecommendationsAnime,
//     getRecentRecommendationsManga
//   };
// }


// hooks/useJikan.ts
import { useCallback } from "react";
import jikan from "@/services/animeApi";
import { CardData } from "@/types/ApiTypes";

/**
 * Normaliza um item de anime/manga (v4) para CardData
 */
function normalizeItem(item: any): CardData {
  return {
    mal_id: item.mal_id || item.entry?.[0]?.mal_id || 0,
    title: item.title || item.entry?.[0]?.title || item.name || "",
    score: item.score ?? item.mean ?? null,
    types: item.type ? [item.type] : null,
    aired_from: item.aired?.from || item.published?.from || null,
    image_url:
      item.images?.jpg?.image_url ||
      item.images?.webp?.large_image_url ||
      item.images?.webp?.image_url ||
      item.entry?.[0]?.images?.jpg?.image_url ||
      "",
    popularity: item.popularity ?? null,
    members: item.members ?? null,
  };
}

/**
 * Normaliza objetos da rota de recomendações (/recommendations/{anime|manga})
 * que retornam { data: [{ entry: [...] }, ...] }
 */
function normalizeRecommendation(rec: any): CardData[] {
  if (!rec.entry || !Array.isArray(rec.entry)) return [];
  return rec.entry.map((e: any) => ({
    mal_id: e.mal_id,
    title: e.title,
    image_url:
      e.images?.jpg?.image_url ||
      e.images?.webp?.large_image_url ||
      e.images?.webp?.image_url ||
      "",
    score: null,
    types: null,
    aired_from: null,
  }));
}

export default function useJikan() {
  const getTop = useCallback(async (kind: "anime" | "manga", page = 1) => {
    const res = await jikan.get(`/top/${kind}`, { params: { page } });
    const data = Array.isArray(res.data?.data) ? res.data.data : [];
    return data.map(normalizeItem);
  }, []);

  const search = useCallback(async (kind: "anime" | "manga", q: string, page = 1) => {
    const res = await jikan.get(`/${kind}`, { params: { q, page } });
    const data = Array.isArray(res.data?.data) ? res.data.data : [];
    return data.map(normalizeItem);
  }, []);

  const recommendations = useCallback(async (kind: "anime" | "manga", page = 1) => {
    const res = await jikan.get(`/recommendations/${kind}`, { params: { page } });
    const data = Array.isArray(res.data?.data) ? res.data.data : [];
    return data.flatMap(normalizeRecommendation);
  }, []);

  return {
    getTop,
    search,
    recommendations,
  };
}
