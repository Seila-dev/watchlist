"use client";

import Image from "next/image";
import { Clock, Heart } from "lucide-react";
import { useContext, useState } from "react";
import { CardData } from "@/types/ApiTypes";
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

  return (
    <div className="relative flex w-[180px] h-[285px] sm:w-[238px] sm:h-[355px] rounded-2xl select-none cursor-pointer">
      <Image
        src={getImageUrl(image_url)}
        alt={title}
        width={238}
        height={355}
        priority
        quality={100}
        className="rounded-2xl"
      />

      <div className="absolute -bottom-1 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent rounded-2xl"></div>

      <div className="absolute w-full p-3 bottom-1 left-0 text-white z-10 flex flex-col gap-2 rounded-2xl">
        <div className="flex w-full justify-between mb-1">
          {types && types.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {types.map((t, i) => (
                <div
                  key={i}
                  className="bg-gray-950 px-5 rounded-full text-[8px] md:text-xs font-semibold text-grayBrand-500 flex justify-center items-center text-center"
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

        <h3 className="font-medium sm:font-bold text-sm sm:text-lg leading-tight text-white line-clamp-1">
          {title}
        </h3>

        {score && (
          <div className="flex items-center text-xs sm:text-sm font-medium mt-0">
            <img
              src={starIcon.src}
              className="h-5 w-5 mr-1"
              alt="Star"
            />
            <span className="text-grayBrand-400">{score} / 10</span>
            <span className="mx-1 text-grayBrand-400 hidden sm:block" >|</span>
            <Clock size={17} className="text-grayBrand-400 mr-1 hidden sm:block" />
            <span className="text-grayBrand-400 hidden sm:block ">
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