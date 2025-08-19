"use client";

import { useEffect, useState } from "react";
import { ContentItem, searchJikan, getTopJikan } from "@/lib/jikan";

// normaliza e padroniza o rótulo vindo do CategoryBar
const canon = (s: string) =>
  s
    ?.trim() // <-- importante!
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove acentos
    .replace(/\s+/g, " "); // colapsa múltiplos espaços

export function useCategorySearch(category: string, query: string) {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const ctrl = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      setData([]); // evita exibir resultados antigos enquanto carrega

      try {
        let items: ContentItem[] = [];

        const c = canon(category) || "";
        const isMovies = ["filmes", "filme", "movies", "movie"].includes(c);
        const isTV = ["series", "serie", "tv", "tv series", "tv-series"].includes(c);
        const isManga = ["mangas", "manga"].includes(c);
        const isAnime = ["animes", "anime", "todos", "all"].includes(c); // "todos" cai em anime por enquanto

        if (isMovies || isTV) {
          const type = isMovies ? "movie" : "tv";
          const mode = query.trim() ? "search" : "trending";
          const url = `/api/tmdb?mode=${mode}&type=${type}${
            query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ""
          }`;

          const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
          if (!res.ok) throw new Error("Falha ao buscar (TMDB)");
          const json = await res.json();
          items = json.data ?? [];
        } else if (isManga) {
          items = query.trim()
            ? await searchJikan("manga", query.trim(), ctrl.signal)
            : await getTopJikan("manga", ctrl.signal);
        } else if (isAnime) {
          items = query.trim()
            ? await searchJikan("anime", query.trim(), ctrl.signal)
            : await getTopJikan("anime", ctrl.signal);
        } else {
          // fallback seguro: não encontrou categoria -> não busca nada
          items = [];
          // opcional: console.warn("Categoria não reconhecida:", category);
        }

        if (active) setData(items);
      } catch (e: any) {
        if (active) {
          setError(e?.message ?? "Erro ao buscar");
          // opcional: manter data=[] mesmo em erro
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
      ctrl.abort();
    };
  }, [category, query]);

  return { data, loading, error };
}
