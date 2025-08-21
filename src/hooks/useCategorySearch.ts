"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentItem } from "@/types/tagsTypes";
import { useDebounce } from "@/hooks/useDebounce";
import useAnimeApi from "@/hooks/useAnimeApi";
import { cardListToContentList } from "@/adapters/anime";
import apiAnime from "@/services/animeApi";

const canon = (s: string) =>
  s
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");

export function useCategorySearch(category: string, query: string) {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);
  const q = debouncedQuery.trim();

  const c = useMemo(() => canon(category) || "", [category]);
  const isMovies = ["filmes", "filme", "movies", "movie"].includes(c);
  const isTV = ["series", "serie", "tv", "tv series", "tv-series"].includes(c);
  const isManga = ["mangas", "manga"].includes(c);
  const isAnime = ["animes", "anime", "todos", "all"].includes(c);

  const {
    animes: topList,
    loading: loadingTop,
    getTopAnimes,
    getTopMangas,
  } = useAnimeApi();

  const topModeRef = useRef<null | "anime" | "manga">(null);

  useEffect(() => {
    if (!topModeRef.current) return;
    setData(cardListToContentList(topList));
    if (!loadingTop) {
      topModeRef.current = null;
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [topList, loadingTop]);

  useEffect(() => {
    let active = true;
    const ctrl = new AbortController();

    async function run() {
      setError(null);
      setData([]);

      if (c === "todos" || c === "livros") {
        setLoading(false);
        return;
      }

      if (isMovies || isTV) {
        try {
          setLoading(true);
          const type = isMovies ? "movie" : "tv";
          const mode = q ? "search" : "trending";
          const url = `/api/tmdb?mode=${mode}&type=${type}${
            q ? `&q=${encodeURIComponent(q)}` : ""
          }`;

          const res = await fetch(url, {
            signal: ctrl.signal,
            cache: "no-store",
          });
          if (!res.ok) throw new Error("Falha ao buscar (TMDB)");
          const json = await res.json();
          if (active) setData(json.data ?? []);
        } catch (e: any) {
          if (active) setError(e?.message ?? "Erro ao buscar (TMDB)");
        } finally {
          if (active) setLoading(false);
        }
        return;
      }

      if (isManga) {
        if (q) {
          try {
            setLoading(true);
            const res = await apiAnime.get("/manga", {
              params: { q, limit: 24 },
              signal: ctrl.signal as any,
            });
            const items: ContentItem[] = (res.data?.data ?? []).map(
              (m: any) => ({
                id: m.mal_id,
                title: m.title,
                imageUrl:
                  m.images?.jpg?.image_url ||
                  m.images?.webp?.large_image_url ||
                  m.images?.webp?.image_url ||
                  null,
                url: m.url ?? "",
                score: m.score ?? null,
                type: "manga",
              })
            );
            if (active) setData(items);
          } catch (e: any) {
            if (active) setError(e?.message ?? "Erro ao buscar (Jikan Manga)");
          } finally {
            if (active) setLoading(false);
          }
        } else {
          topModeRef.current = "manga";
          setLoading(true);
          getTopMangas();
        }
        return;
      }

      if (isAnime) {
        if (q) {
          try {
            setLoading(true);
            const res = await apiAnime.get("/anime", {
              params: { q, limit: 24 },
              signal: ctrl.signal as any,
            });
            const items: ContentItem[] = (res.data?.data ?? []).map(
              (a: any) => ({
                id: a.mal_id,
                title: a.title,
                imageUrl:
                  a.images?.jpg?.image_url ||
                  a.images?.webp?.large_image_url ||
                  a.images?.webp?.image_url ||
                  null,
                url: a.url ?? "",
                score: a.score ?? null,
                type: "anime",
              })
            );
            if (active) setData(items);
          } catch (e: any) {
            if (active) setError(e?.message ?? "Erro ao buscar (Jikan Anime)");
          } finally {
            if (active) setLoading(false);
          }
        } else {
          topModeRef.current = "anime";
          setLoading(true);
          getTopAnimes();
        }
        return;
      }

      setLoading(false);
      setData([]);
    }

    run();

    return () => {
      active = false;
      ctrl.abort();
    };
  }, [c, q]);

  return { data, loading, error };
}
