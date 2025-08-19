import { ContentItem, MediaType as ContentType } from "@/types/tagsTypes";

type JikanType = "anime" | "manga";

const BASE = "https://api.jikan.moe/v4";

function mapItem(type: ContentType) {
    return (it: any): ContentItem => ({
        id: it.mal_id,
        title: it.title ?? it.title_english ?? it.title_japanese ?? "Sem título",
        imageUrl: it.images?.jpg?.image_url ?? null,
        url: it.url,
        score: it.score ?? null,
        type,
    });
}

export async function searchJikan( type: JikanType, q: string, signal?: AbortSignal): Promise<ContentItem[]> {
    const url = `${BASE}/${type}?q=${encodeURIComponent(q)}&sfw=true&limit=12`;
    const response = await fetch(url, { signal, cache: "no-store" });
    
    if (!response.ok) throw new Error("Falha ao buscar dados");
    
    const json = await response.json();
    
    return (json.data ?? []).map(mapItem(type));
}

export async function getTopJikan( type: JikanType, signal?: AbortSignal ): Promise<ContentItem[]> {
    const url = `${BASE}/top/${type}?limit=12`;
    const response = await fetch(url, { signal, cache: "no-store" });
        if (!response.ok) throw new Error("Falha na busca");
    
        const json = await response.json();
    
        return (json.data ?? []).map(mapItem(type));
}

export type { ContentItem };
