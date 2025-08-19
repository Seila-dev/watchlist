"use client"

import Image from "next/image";
import { Clock, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { CardData } from "@/types/ApiTypes";
import starIcon from "@/../public/assets/logos/stars.webp";

function getImageUrl(image_url: string) {
    return image_url || "/assets/default-image.webp";
}

export function CardPreview({ title, score, types, aired_from, image_url }: CardData) {
    const [favorite, setFavorite] = useState<boolean>(false);

    return (
        <div
            className={"relative flex max-w-[288px] max-h-[395px] rounded-2xl"}
        >
            <Image
                src={getImageUrl(image_url)}
                alt={title}
                width={288}
                height={395}
                priority
                quality={100}
                className="rounded-2xl"
            />

            <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-black to-transparent"></div>

            <div className="absolute w-full p-3 bottom-1 left-0 text-white z-10 flex flex-col gap-2">
                <div className="flex w-full  justify-between mb-1">
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

                <h3 className="font-bold text-lg leading-tight text-white line-clamp-1">{title}</h3>

                {score && (
                    <div className="flex items-center text-[14px] font-medium mt-1">
                        <img
                            src={starIcon.src}
                            className="h-5 w-5 mr-1 -mt-1"
                            alt="Star"
                        />
                        <span className="text-grayBrand-400">{score} / 10</span>
                        <span className="mx-1  text-grayBrand-400">|</span>
                        <Clock size={17} className="text-grayBrand-400 mr-1 -mt-0.5" />
                        <span className="text-grayBrand-400 text-sm ">{aired_from ? new Date(aired_from).toLocaleDateString("pt-BR") : "No Date"}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
