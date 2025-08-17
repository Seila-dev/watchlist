"use client"

import Image from "next/image";
import { Clock, Heart } from "lucide-react";
import { useState } from "react";

interface CardPreviewProps {
    mal_id: number;
    title: string;
    score: string;
    type: string;
    aired: {
        from: string | null;
    },
    images: {
        jpg: {
            image_url: string;
        };
    };
}

export function CardPreview({ mal_id, title, score, type, aired, images }: CardPreviewProps) {

    const [favorito, setFavorito] = useState(false);

    return (
        <div className="relative w-full max-w-[288px] h-full max-h-[395px] rounded-2xl overflow-hidden">
            <Image
                src={images.jpg.image_url}
                alt="Imagem card"
                width={288}
                height={395}
                priority
                className="rounded-2xl"
            />

            <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-black to-transparent"></div>

            <div className="absolute w-full p-3 bottom-1 left-0 text-white z-10 flex flex-col gap-2">
                <div className="flex w-full justify-between mb-1">
                    <div className="bg-gray-900 flex max-w-[75px] w-full px-3 rounded-full items-center justify-center text-xs font-semibold text-center">
                        <span className="text-grayBrand-500">{type}</span>
                    </div>
                    <button
                        onClick={() => setFavorito(!favorito)}
                        className="bg-grayBrand-900 p-2 flex rounded-full items-center justify-center"
                    >
                        <Heart
                            size={18}
                            className={favorito ? "text-purple-500 fill-purple-500" : "text-grayBrand-500"}
                        />
                    </button>
                </div>

                <h3 className="font-bold text-lg leading-tight text-white line-clamp-1">
                    {title}
                </h3>

                <div className="flex items-center text-[14px] font-medium mt-1">
                    <img src="/assets/logos/estrelas.webp" className="h-4 w-4 mr-1 -mt-1" alt="Star" />
                    <span className="text-grayBrand-400" >{score} / 10</span>
                    <span className="mx-1 text-grayBrand-400">|</span>
                    <Clock size={14} className="text-grayBrand-400 mr-1 -mt-1" />
                    <span className="text-grayBrand-400">01/08/2025</span>
                </div>
            </div>
        </div>

    )
}