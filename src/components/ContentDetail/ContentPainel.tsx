// components/ContentPanel.tsx
"use client";
import React from "react";
import Image from "next/image";
import { Calendar, Clock, Edit2, Flag, Heart, Share2 } from "lucide-react";
import StarRating from "@/components/StarRating";
import { CategoryLabel } from "@/components/StatusLabel/CategoryLabel";
import { formatDateFullPtBR, timeSincePtBR, translateCategory } from "@/lib/translations";
import { ExpandableText } from "@/components/ExpandableText";
import { CaretRight } from "phosphor-react";
import { Content } from "@/types/content";

/**
 * Minimal Content interface (ajuste se seu modelo real for diferente)
 */

interface ContentPanelProps {
  content: Content;
  placeholder: string; // data url placeholder (usado no <Image />)
  coverSrc?: string | null; // apenas a url real (opcional) - usada no background Image fallback
}

export default function ContentPanel({ content, placeholder, coverSrc }: ContentPanelProps) {
  const translatedCategory = translateCategory(content.category ?? "");

  return (
    <div className="relative rounded-lg py-10 px-12 shadow-xl overflow-hidden flex flex-col md:flex-row gap-6 text-white">
      <div className="absolute inset-0 z-0 bg-gray-900 border rounded-2xl overflow-hidden">
        {coverSrc && (
          <Image
            src={coverSrc}
            alt=""
            fill
            priority
            className="object-cover opacity-40 scale-110"
          />
        )}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gray-900 pointer-events-none"
        style={{ backgroundColor: "rgba(0,0,0,0.67)" }}
      />

      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
      linear-gradient(
        to right,
       rgba(30, 29, 35, 0.9) 5%,
        rgba(17, 24, 39, 0) 100%
      )
    `,
        }}
      />

      <div className="w-full relative z-30 gap-8 flex items-start">
        <div className="group relative flex w-[250px] h-[355px] sm:w-[306px] sm:h-[425px] rounded-lg overflow-hidden flex-shrink-0 shadow-lg shadow-black/50 ">
          <Image
            src={content.coverUrl ?? placeholder}
            alt={content.title}
            fill
            priority
            quality={75}
            sizes="(max-width: 639px) 180px, 316px"
            className="rounded-lg object-cover bg-black"
            {...(content.coverUrl ? {} : { blurDataURL: placeholder, placeholder: "blur" as const })}
          />
        </div>

        <div className="flex w-full flex-col">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              {content.title}
            </h1>
            <span className="text-primary-50 flex items-center gap-2 cursor-pointer hover:text-gray-300">
              <Edit2 className="text-gray-500" />
              Editar
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={content.rating ?? null} size={20} />
            <CategoryLabel variant={content.status} className="ml-4" />
            <button className="text-gray-400/80 w-fit px-4 py-1.5 border border-gray-800 rounded-full bg-gray-800/30 text-sm">
              {translatedCategory}
            </button>
          </div>

          <div className="flex">
            <div className="w-full flex-col">
              <div className="mt-8 mb-4">
                <h2 className="text-lg font-semibold text-gray-300 mb-2">
                  Sinopse
                </h2>

                {content.description ? (
                  <ExpandableText text={content.description} maxWords={50} initialLines={3} />
                ) : (
                  <p className="text-gray-400">
                    Nenhuma sinopse disponível no momento.
                  </p>
                )}
              </div>

              <div className="flex mt-6 gap-6">
                <button className="px-6 py-3 hover:bg-gray-900 border border-gray-800 rounded-lg text-gray-300 font-medium transition-colors flex items-center gap-2">
                  <Flag className="inline text-gray-500" size={20} />
                  Marcar como Finalizado
                </button>
                <button className="px-6 py-3 hover:bg-gray-900 rounded-lg text-gray-300 font-medium transition-colors flex items-center gap-2">
                  <Heart className="inline text-gray-500" size={20} />
                  Favoritar
                </button>
                <button className="px-6 py-3 hover:bg-gray-900 rounded-lg text-gray-300 font-medium transition-colors flex items-center gap-2">
                  <Share2 className="inline text-gray-500" size={20} />
                  Compartilhar
                </button>
              </div>

              <div className="mt-8 flex gap-6">
                <div>
                  <h2 className="text-normal mb-1 text-gray-500 flex items-center">
                    <Calendar size={20} className="inline mr-2 text-gray-500" />
                    Adicionado
                  </h2>
                  <span>
                    {formatDateFullPtBR(content.createdAt)}
                  </span>
                </div>
                <div>
                  <h2 className="text-normal mb-1 text-gray-500 flex items-center">
                    <Clock size={20} className="inline mr-2 text-gray-500" />
                    Última atualização
                  </h2>
                  <span>
                    {timeSincePtBR(content.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col min-w-[200px] ml-20">
              <button className="text-lg mb-4 font-semibold text-gray-300 flex justify-between items-center">
                Álbuns
                <CaretRight size={20} className="inline ml-2 text-gray-500" />
              </button>

              <div className="text-gray-400 flex flex-col gap-2">
                <button className="text-gray-400/80 w-fit px-4 py-1.5 border border-gray-800 rounded-full bg-gray-800/30 text-sm">
                  Para o final de Semana
                </button>
                <button className="text-gray-400/80 w-fit px-4 py-1.5 border border-gray-800 rounded-full bg-gray-800/30 text-sm">
                  Férias 2026
                </button>
                <button className="text-gray-400/80 w-fit px-4 py-1.5 border border-gray-800 rounded-full bg-gray-800/30 text-sm">
                  +3
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
