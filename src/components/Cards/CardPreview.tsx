"use client";

import React, { useContext, useMemo, useState } from "react";
import Image from "next/image";
import { Clock, Edit, Edit2, GripVertical, Heart } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import starIcon from "@/../public/assets/logos/stars.webp";
import { makePlaceholderDataUrl } from "@/lib/ImagePlaceholder";
import type { Content } from "@/types/content";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { translateCategory } from "@/lib/translations";

type Props = Pick<
  Content,
  "id" | "title" | "coverUrl" | "rating" | "category" | "annotations" | "createdAt" | "isFavorite"
> & {
  isUpdating?: boolean;
};

export function CardPreview({
  id,
  title,
  category,
  coverUrl,
  annotations,
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

  const router = useRouter();

  const placeholder = useMemo(() => makePlaceholderDataUrl(title, category ?? ""), [
    title,
    category,
  ]);
  const translatedCategory = translateCategory(category ?? "");
  const src = !failed && coverUrl ? coverUrl : placeholder;
  const ratingLabel =
    rating !== undefined && rating !== null ? `${rating.toFixed(1)} / 10` : null;

  const transformStyle = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  const handleClick = () => {
    if (isDragging) return;
    router.push(`/contents/${encodeURIComponent(String(id))}`);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isDragging) router.push(`/contents/${encodeURIComponent(String(id))}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Abrir ${title}`}
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
      className={`group relative flex w-[250px] h-[355px] sm:w-[306px] sm:h-[425px] rounded-[20px] select-none cursor-pointer transition-all duration-200 border-4 border-transparent border-solid hover:border-primary-700 ${isDragging ? "opacity-0" : "opacity-100"
        } ${isUpdating ? "ring-2 ring-primary-700 ring-offset-transparent" : ""}`}
    >
      {/* Grip: only visible on desktop via hover (hidden on mobile) */}
      {/* <button
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
      </button> */}
      <div className="absolute top-2 right-2 p-1 rounded-full items-center justify-center z-20
                   flex transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(ev) => {
            ev.stopPropagation();
            setFavorite((v) => !v);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-grayBrand-900 p-2 flex rounded-full items-center justify-center"
          aria-pressed={favorite}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            size={18}
            className={favorite ? "text-primary-600 fill-primary-600" : "text-grayBrand-500"}
          />
        </button>
      </div>

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
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/100 via-black/100 to-transparent rounded-b-2xl" />

        <div className="absolute w-full p-5 bottom-1 left-0 text-white z-10 flex flex-col ">
          {translatedCategory && (
            <div className=" rounded-full text-xs sm:text-sm text-grayBrand-500 flex items-center">
              {translatedCategory}
            </div>
          )}
          <h3 className="font-bold mb-2 text-sm sm:text-lg text-white line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center justify-between text-xs sm:text-sm font-medium mt-0">


            {rating !== null && rating !== undefined && rating > 0 &&
              <div className="text-grayBrand-500 flex items-center">
                <img src={starIcon.src} className="h-5 mr-1" alt="Star" />
                {rating.toFixed(1)} / 5
              </div>

            }
            {annotations !== null && annotations !== undefined && annotations.length > 0 ? (
              <div className=" rounded-full text-sm text-grayBrand-500 flex items-center">
                {annotations.length} anotações
              </div>
            ) : (
              <div className="text-grayBrand-500 flex items-center">
                <Edit size={16} className="mr-1 w-5" />
                Sem anotações
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
