"use client";

import React, { useContext, useMemo, useState } from "react";
import Image from "next/image";
import { Clock, GripVertical, Heart } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import starIcon from "@/../public/assets/logos/stars.webp";
import { makePlaceholderDataUrl } from "@/lib/ImagePlaceholder";
import type { Content } from "@/types/content";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Props = Pick<
  Content,
  "id" | "title" | "coverUrl" | "rating" | "category" | "createdAt" | "isFavorite"
> & {
  isUpdating?: boolean;
};

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
  return (
    CATEGORY_LABELS[key] ??
    String(key)
      .toLowerCase()
      .split("_")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export function CardPreview({
  id,
  title,
  category,
  coverUrl,
  rating,
  createdAt,
  isFavorite,
  isUpdating = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const [favorite, setFavorite] = useState(Boolean(isFavorite));
  const { user } = useContext(AuthContext);

  // draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const placeholder = useMemo(() => makePlaceholderDataUrl(title, category ?? ""), [
    title,
    category,
  ]);
  const translatedCategory = translateCategory(category ?? "");
  const src = !failed && coverUrl ? coverUrl : placeholder;
  const ratingLabel =
    rating !== undefined && rating !== null ? `${rating.toFixed(1)} / 10` : null;

  const transformStyle = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...transformStyle,
        // allow vertical page scroll while enabling horizontal drag detection on the card
        touchAction: "pan-y",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      // className={`group relative flex w-[180px] h-[285px] sm:w-[238px] sm:h-[355px] rounded-[20px] select-none transition-all duration-200 border-4 border-transparent border-solid hover:border-primary-700 ${
      //   isDragging ? "opacity-0" : "opacity-100"
      // } ${isUpdating ? "ring-2 ring-primary-700 ring-offset-transparent" : ""}`}
      className={`group relative flex w-[180px] h-[285px] sm:w-[316px] sm:h-[425px] rounded-[20px] select-none transition-all duration-200 border-4 border-transparent border-solid hover:border-primary-700 ${isDragging ? "opacity-0" : "opacity-100"
        } ${isUpdating ? "ring-2 ring-primary-700 ring-offset-transparent" : ""}`}
    >
      {/* Grip: only visible on desktop via hover (hidden on mobile) */}
      <button
        className="absolute top-2 right-2 bg-gray-900 p-2 rounded-full items-center justify-center border border-white/10 shadow-lg z-20
                   flex transition-opacity duration-150 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
        style={{
          touchAction: "none",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Arrastar"
      >
        <GripVertical size={17} className="text-grayBrand-300" />
      </button>

      <div
        className="relative rounded-2xl overflow-hidden w-full h-full"
        style={{
          boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
          background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02))",
        }}
      >
        <Image
          src={src}
          alt={title}
          fill
          priority
          // quality={100}
          quality={75}
          sizes="(max-width: 639px) 180px, 316px"
          className="rounded-2xl object-cover bg-black"
          draggable={false}
          onError={() => setFailed(true)}
          {...(src !== placeholder ? { blurDataURL: placeholder, placeholder: "blur" as const } : {})}
        />

        {/* <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/60 to-transparent rounded-b-2xl" /> */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/100 via-black/85 to-transparent rounded-b-2xl" />

        <div className="absolute w-full p-3 bottom-1 left-0 text-white z-10 flex flex-col gap-2">
          <div className="flex w-full justify-between mb-1">
            {translatedCategory && (
              <div className="bg-gray-900 px-4 py-1 rounded-full text-xs text-grayBrand-500 flex items-center">
                {translatedCategory}
              </div>
            )}
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                setFavorite((v) => !v);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-grayBrand-900 p-2 flex rounded-full items-center justify-center"
            >
              <Heart
                size={18}
                className={favorite ? "text-primary-600 fill-primary-600" : "text-grayBrand-500"}
              />
            </button>
          </div>

          <h3 className="font-medium sm:font-bold text-sm sm:text-lg leading-tight text-white line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center text-xs sm:text-sm font-medium mt-0">
            <img src={starIcon.src} className="h-5 w-5 mr-1" alt="Star" />

            {rating !== null && rating !== undefined && rating > 0 ? (
              <span className="text-grayBrand-400">{rating.toFixed(1)} / 10</span>
            ) : (
              <span className="text-grayBrand-500">Sem avaliação</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
