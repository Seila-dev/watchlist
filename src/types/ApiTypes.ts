// types.ts

export interface CardData {
  mal_id: number;
  title: string;
  score?: number | null;
  types?: string[] | null;
  aired_from?: string | null;
  image_url: string;
}

export interface AnimesProps {
  mal_id?: number;
  title: string;
  score?: string;
  type?: string;
  aired?: { from: string | null };
  images?: {
    jpg?: { image_url?: string };
    webp?: { image_url?: string; large_image_url?: string };
  };
}

// Interfaces para a rota nova (/recommendations)
export interface Entry {
  mal_id: number;
  url: string;
  title: string;
  images: {
    jpg?: { image_url?: string };
    webp?: { image_url?: string; large_image_url?: string };
  };
}

export interface DataItem {
  entry: Entry[];
}
