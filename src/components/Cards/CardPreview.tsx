"use client";

import Image from "next/image";
import { Clock, Heart } from "lucide-react";
import { useContext, useState } from "react";
import { CardData } from "@/types/ApiTypes";
import { RatingStars } from "../Rating/RatingStars";
import { useUserRating } from "@/hooks/useUserRating";
import { AuthContext } from "@/contexts/AuthContext";
import starIcon from "@/../public/assets/logos/stars.webp";

function getImageUrl(image_url: string) {
  return image_url || "/assets/default-image.webp";
}

const score10To5 = (s?: number | string | null) =>
  s == null ? 0 : Math.max(0, Math.min(5, Number(s) / 2));

export function CardPreview({
  mal_id,
  title,
  score,
  types,
  aired_from,
  image_url,
}: CardData) {
  const [favorite, setFavorite] = useState(false);

  const { user } = useContext(AuthContext);
  const userId = user?.id ? String(user.id) : undefined;
  const userRating = useUserRating(mal_id, userId);

  return (
    <div className="relative flex w-[288px] h-[395px] rounded-2xl bg-red-500">
      <Image
        src={getImageUrl(image_url)}
        alt={title}
        width={288}
        height={395}
        priority
        quality={100}
        className="rounded-2xl"
      />

      <div className="absolute -bottom-1 left-0 w-full h-36 bg-gradient-to-t from-black to-transparent rounded-2xl"></div>

      <div className="absolute w-full p-3 bottom-1 left-0 text-white z-10 flex flex-col gap-2 rounded-2xl">
        <div className="flex w-full justify-between mb-1">
          {types && types.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {types.map((t, i) => (
                <div
                  key={i}
                  className="bg-gray-900 px-3 rounded-full text-xs font-semibold text-grayBrand-500 flex justify-center items-center text-center w-[70px]"
                >
                  {t}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setFavorite(!favorite)}
            className="bg-grayBrand-900 p-2 flex rounded-full items-center justify-center"
          >
            <Heart
              size={18}
              className={favorite ? "text-purple-500 fill-purple-500" : "text-grayBrand-500"}
            />
          </button>
        </div>

        <h3 className="font-bold text-lg leading-tight text-white line-clamp-1">
          {title}
        </h3>

        {/*Verificar se é necessário */}

        {/*<div className="flex items-center gap-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 w-fit">
            <RatingStars
              value={userRating.value ?? score10To5(score)}
              onChange={userRating.setValue}
              step={0.5}
              size={18}
              className="filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]"
              aria-label={`Avaliar ${title}`}
            />
          </div>
        </div>*/}

        {score && (
          <div className="flex items-center text-[14px] font-medium mt-1">
            <img
              src={starIcon.src}
              className="h-5 w-5 mr-1 -mt-1"
              alt="Star"
            />
            <span className="text-grayBrand-400">{score} / 10</span>
            <span className="mx-1 text-grayBrand-400">|</span>
            <Clock size={17} className="text-grayBrand-400 mr-1 -mt-0.5" />
            <span className="text-grayBrand-400 text-sm ">
              {aired_from
                ? new Date(aired_from).toLocaleDateString("pt-BR")
                : "No Date"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}