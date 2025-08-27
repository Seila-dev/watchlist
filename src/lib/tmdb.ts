import { ContentItem } from "@/types/tagsTypes";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// Você precisará configurar sua API key no .env.local
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "sua_api_key_aqui";

function tmdbUrl(path: string, params: Record<string, string | number> = {}) {
    const url = new URL(`${TMDB_BASE}${path}`);
    url.searchParams.set("api_key", TMDB_API_KEY);
    
    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, String(v));
    }
    
    return url.toString();
}

type TMDBType = "movie" | "tv";

function mapTMDBItem(type: TMDBType) {
    return (it: any): ContentItem => {
        const isMovie = type === "movie";
        const id = it.id;
        const title = isMovie
            ? it.title ?? it.original_title
            : it.name ?? it.original_name;
        const poster = it.poster_path ? `${IMG_BASE}${it.poster_path}` : null;
        const url = `https://www.themoviedb.org/${isMovie ? "movie" : "tv"}/${id}`;
        const score = typeof it.vote_average === "number" ? it.vote_average : null;

        return {
            id,
            title: title || "Sem título",
            imageUrl: poster,
            url,
            score,
            type: type as any, // Cast para ContentItem type
        };
    };
}

export async function searchTMDB(
    type: TMDBType,
    q: string,
    signal?: AbortSignal,
    page = 1
): Promise<ContentItem[]> {
    const url = tmdbUrl(`/search/${type}`, {
        query: q,
        include_adult: "false",
        language: "pt-BR",
        page,
    });
    const res = await fetch(url, { signal, cache: "no-store" });
    
    if (!res.ok) throw new Error("Falha ao buscar no TMDB");
    
    const json = await res.json();
    
    return (json.results ?? []).map(mapTMDBItem(type));
}

export async function getTrendingTMDB(
    type: TMDBType,
    timeWindow: "day" | "week" = "week",
    signal?: AbortSignal
): Promise<ContentItem[]> {
    const url = tmdbUrl(`/trending/${type}/${timeWindow}`, {
        language: "pt-BR"
    });
    const res = await fetch(url, { signal, cache: "no-store" });
    
    if (!res.ok) throw new Error("Falha ao buscar trending no TMDB");
    
    const json = await res.json();
    
    return (json.results ?? []).map(mapTMDBItem(type));
}

export async function getPopularTMDB(
    type: TMDBType,
    signal?: AbortSignal,
    page = 1
): Promise<ContentItem[]> {
    const url = tmdbUrl(`/${type}/popular`, {
        language: "pt-BR",
        page
    });
    const res = await fetch(url, { signal, cache: "no-store" });
    
    if (!res.ok) throw new Error("Falha ao buscar populares no TMDB");
    
    const json = await res.json();
    
    return (json.results ?? []).map(mapTMDBItem(type));
}
