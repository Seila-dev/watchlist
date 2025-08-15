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

            {/* Gradiente escuro no rodapé */}
            <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-black to-transparent"></div>

            <div className="absolute w-full p-3 bottom-1 left-0 text-white z-10">
                {/* Tipo e botão de favorito */}
                <div className="flex w-full justify-between mb-1">
                    <div className="bg-grayBrand-900 flex px-3 py-1 rounded-full items-center justify-center text-xs font-semibold">
                        {type}
                    </div>
                    <button
                        onClick={() => setFavorito(!favorito)}
                        className="bg-grayBrand-900 p-1.5 flex rounded-full items-center justify-center"
                    >
                        <Heart
                            size={20}
                            className={favorito ? "text-purple-500 fill-purple-500" : "text-white"}
                        />
                    </button>
                </div>

                {/* Título */}
                <h3 className="font-bold text-lg leading-tight text-white line-clamp-1">
                    {title}
                </h3>

                {/* Nota e data */}
                <div className="flex items-center text-xs text-gray-300 font-medium mt-1">
                    <img src="/star.png" className="h-4 w-4 mr-1" alt="Star" />
                    <span>{score} / 10</span>
                    <span className="mx-1 text-gray-500">|</span>
                    <Clock size={14} className="text-gray-400 mr-1" />
                    <span>01/08/2025</span>
                </div>
            </div>
        </div>

    )
}