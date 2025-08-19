export type MediaType = "anime" | "manga" | "movie" | "tv";

export type ContentItem = {
    id: number;
    title: string;
    imageUrl: string | null;
    url: string;
    score?: number | null;
    type: MediaType;
};
