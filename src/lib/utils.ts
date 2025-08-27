"use client"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { ContentItem } from "@/types/tagsTypes";
import { CardData } from "@/types/ApiTypes";

export const canon = (s?: string) =>
  s
    ? s.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, " ")
    : "";

export function contentItemToCardData(item: ContentItem): CardData {
  return {
    mal_id: item.id,
    title: item.title,
    score: item.score,
    types: [item.type],
    aired_from: null,
    image_url: item.imageUrl || "/assets/default-image.webp",
  };
}
