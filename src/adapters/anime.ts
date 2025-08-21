import type { CardData } from "@/types/ApiTypes"; 
import type { ContentItem, MediaType } from "@/types/tagsTypes"; 

export function cardDataToContentItem(a: CardData): ContentItem {
    const t = (a.types?.[0]?.toLowerCase() ?? "") as MediaType | "";
    const type: MediaType =
    t === "anime" || t === "manga" || t === "movie" || t === "tv" ? t : "anime";

    const score =
    a.score != null && a.score !== "" && !Number.isNaN(Number(a.score))
        ? Number(a.score)
        : null;

    return {
        id: a.mal_id,
        title: a.title,
        imageUrl: a.image_url || null,
        url: "", 
        score,
        type,
    };
}

export function cardListToContentList(list: CardData[]): ContentItem[] {
    return list.map(cardDataToContentItem);
}
