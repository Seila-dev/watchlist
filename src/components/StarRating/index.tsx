"use client";
import React from "react";
import Image from "next/image";

interface StarRatingProps {
  rating?: number | null; // assume 0..5 (pode ter frações)
  size?: number; // largura/altura do ícone em px (padrão 20)
  className?: string;
  showNumeric?: boolean; // exibe o número ao lado (acessibilidade)
}

/**
 * Renderiza 5 estrelas com imagens: full, mid e no-star.
 * Lógica: para cada estrela i (1..5), calcula d = rating - (i-1):
 *  - d >= 1   -> full
 *  - d >= 0.5 -> mid
 *  - else     -> no
 */
export default function StarRating({
  rating = null,
  size = 20,
  className = "",
  showNumeric = true,
}: StarRatingProps) {
  // defensive: se rating for negativo ou >5, normaliza para o intervalo [0,5]
  const normalized = rating == null ? null : Math.max(0, Math.min(5, rating));

  const stars = Array.from({ length: 5 }, (_, idx) => {
    const i = idx + 1;
    let src = "/assets/no-star.png";

    if (normalized != null) {
      const diff = normalized - (i - 1);
      if (diff >= 1) {
        src = "/assets/full-star.png";
      } else if (diff >= 0.5) {
        src = "/assets/mid-star.png";
      } else {
        src = "/assets/no-star.png";
      }
    }

    return (
      <span key={i} className="inline-block" aria-hidden>
        <Image
          src={src}
          alt={normalized != null ? `${normalized >= 0 ? normalized : 0} stars` : "Sem avaliação"}
          width={size}
          height={size}
          quality={100}
          priority={false}
        />
      </span>
    );
  });

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role="img"
      aria-label={
        normalized != null ? `Avaliação: ${normalized.toFixed(1)} de 5` : "Sem avaliação"
      }
    >
      {stars}
      {showNumeric && normalized != null && (
        <span className="ml-2 text-lg text-gray-500" aria-hidden={false}>
          {normalized.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
}
