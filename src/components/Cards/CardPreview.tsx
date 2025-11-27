"use client";

import Image from "next/image";
import { Clock, Heart } from "lucide-react";
import { useContext, useMemo, useState } from "react";
// import { CardData } from "@/types/ApiTypes";
import { AuthContext } from "@/contexts/AuthContext";
import starIcon from "@/../public/assets/logos/stars.webp";
import { makePlaceholderDataUrl } from "@/lib/ImagePlaceholder";
import { Content } from "@/types/content";

type Props = Pick<
  Content,
  "id" | "title" | "coverUrl" | "rating" | "category" | "createdAt" | "isFavorite"
>;

const CATEGORY_LABELS: Record<string, string> = {
  MANGAS: "Mangás",
  MOVIES: "Filmes",
  BOOKS: "Livros",
  ANIMES: "Animes",
  SERIES: "Séries",
};

function translateCategory(cat?: string | null): string | null {
  if (!cat) return null;
  const key = String(cat).toUpperCase().trim();
  return CATEGORY_LABELS[key] ?? // se houver no mapa retorna
    // fallback: torna a palavra legível (ex: "SOME_CATEGORY" -> "Some category")
    String(key)
      .toLowerCase()
      .split("_")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");
}

export function CardPreview({
  title,
  category,
  coverUrl,
  rating,
  createdAt,
  isFavorite,
}: Props) {
  // const [favorite, setFavorite] = useState(false);
  const [failed, setFailed] = useState(false);

  const { user } = useContext(AuthContext);
  const userId = user?.id ? String(user.id) : undefined;

    const placeholder = useMemo(
    () => makePlaceholderDataUrl(title, category ?? ""),
    [title, category]
  );

    const translatedCategory = translateCategory(category ?? "");

  // src final: remote image unless failed or absent -> placeholder
  const src = !failed && coverUrl ? coverUrl : placeholder;

  const ratingLabel = rating !== undefined && rating !== null ? `${rating.toFixed(1)} / 10` : null;

  return (
    <div className="relative flex w-[180px] h-[285px] sm:w-[238px] sm:h-[355px] rounded-2xl select-none cursor-pointer overflow-hidden">
      <Image
        // src={getImageUrl(image_url)}
        src={src}
        alt={title}
        fill
        priority
        quality={100}
        className="rounded-2xl object-cover"
        draggable="false"
        onError={() => setFailed(true)}
         {...(src !== placeholder ? { blurDataURL: placeholder, placeholder: 'blur' as const } : {})}
      />

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/60 to-transparent rounded-b-2xl"></div>

      <div className="absolute w-full p-3 bottom-1 left-0 text-white z-10 flex flex-col gap-2 rounded-2xl">
        <div className="flex w-full justify-between mb-1">
          {translatedCategory && (
            <div className="bg-gray-900 px-4 py-1 rounded-full text-xs text-grayBrand-500 flex items-center">
              {translatedCategory}
            </div>
          )}
          <button
            className="bg-grayBrand-900 p-2 flex rounded-full items-center justify-center"
          >
            <Heart
              size={18}
              className={isFavorite ? "text-primary-600 fill-primary-600" : "text-grayBrand-500"}
            />
          </button>
        </div>

        <h3 className="font-medium sm:font-bold text-sm sm:text-lg leading-tight text-white line-clamp-1">
          {title}
        </h3>

        {ratingLabel && (
          <div className="flex items-center text-xs sm:text-sm font-medium mt-0">
            <img src={starIcon.src} className="h-5 w-5 mr-1" alt="Star" />
            <span className="text-grayBrand-400">{ratingLabel}</span>
            <span className="mx-1 text-grayBrand-400 hidden sm:block">|</span>
            <Clock size={17} className="text-grayBrand-400 mr-1 hidden sm:block" />
            <span className="text-grayBrand-400 hidden sm:block">
              {createdAt ? new Date(createdAt).toLocaleDateString("pt-BR") : "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}