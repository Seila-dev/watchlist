"use client";
import React, { useMemo, useState } from "react";
import { truncateByWords } from "@/lib/translations";

interface ExpandableTextProps {
  text: string;
  maxWords?: number;
  initialLines?: number;
}

export function ExpandableText({
  text,
  maxWords = 255,
  initialLines = 3,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  const { truncated, isTruncated } = useMemo(
    () => truncateByWords(text, maxWords),
    [text, maxWords]
  );

  const shouldShowEllipsis = !expanded && isTruncated;

  return (
    <div>
      <p
        className={`
          text-gray-400
          transition-all
          ${!expanded ? `line-clamp-${initialLines}` : ""}
        `}
      >
        {expanded ? text : truncated}
        {shouldShowEllipsis && "…"}
      </p>

      {isTruncated && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm text-primary-400 hover:underline"
        >
          {expanded ? "Ler menos" : "Ler mais"}
        </button>
      )}
    </div>
  );
}
