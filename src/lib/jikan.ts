
import { ContentItem } from "@/types/tagsTypes";

type JikanType = "anime" | "manga";

const BASE = "https://api.jikan.moe/v4";

function mapItem(type: JikanType) {
    return (it: any): ContentItem => ({
        id: it.mal_id,
        title: it.title ?? it.title_english ?? it.title_japanese ?? "Sem título",
        imageUrl: it.images?.jpg?.image_url ?? it.images?.webp?.large_image_url ?? null,
        url: it.url ?? "",
        score: it.score ?? null,
        type: type as any, // Cast para ContentItem type
    });
}

export async function searchJikan( 
    type: JikanType, 
    q: string, 
    signal?: AbortSignal
): Promise<ContentItem[]> {
    const url = `${BASE}/${type}?q=${encodeURIComponent(q)}&sfw=true&limit=15`;
    const response = await fetch(url, { signal, cache: "no-store" });
    
    if (!response.ok) throw new Error("Falha ao buscar dados do Jikan");
    
    const json = await response.json();
    
    return (json.data ?? []).map(mapItem(type));
}

export async function getTopJikan(
    type: JikanType, 
    page = 1, 
    signal?: AbortSignal
): Promise<ContentItem[]> {
    const url = `${BASE}/top/${type}?page=${page}&limit=15&sfw=true`;
    const response = await fetch(url, { signal, cache: "no-store" });
    
    if (!response.ok) throw new Error("Falha ao buscar top do Jikan");
    
    const json = await response.json();
    
    return (json.data ?? []).map(mapItem(type));
}
