import { CardData } from "@/types/ApiTypes";
import { ContentItem } from "@/types/tagsTypes";

export function contentItemToCardData(ci: ContentItem): CardData {
    const scoreStr =
        ci.score == null
        ? undefined
        : (Number(ci.score).toFixed(1) as unknown as string);

    const typeLabel =
        ci.type === "movie"
        ? "Filme"
        : ci.type === "tv"
        ? "Série"
        : ci.type === "manga"
        ? "Mangá"
        : "Anime";

    return {
        mal_id: ci.id,
        title: ci.title,
        score: scoreStr,               
        types: [typeLabel],            
        aired_from: null,             
        image_url: ci.imageUrl || "/assets/default-image.png",
    };
}
