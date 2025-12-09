"use client";
import React, { useEffect } from "react";
import useContents from "@/hooks/useContents";

interface Props {
  id: string;
}

export default function ContentDetailClient({ id }: Props) {
  const { contents, fetchContentById } = useContents();

  useEffect(() => {
    if (!id) return;
    // depende do comportamento do seu hook: se fetchContentById for estável (memoized),
    // tudo bem. Caso contrário, envolva em useCallback no hook.
    fetchContentById(id);
  }, [id, fetchContentById]);

  const found = contents.find((c) => c.id === id);

  return (
    <div>
      <h1>Página do Post: {id}</h1>
      <pre>{JSON.stringify(found ?? "Conteúdo não encontrado", null, 2)}</pre>
    </div>
  );
}
