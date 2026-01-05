// components/ContentDetailClient.tsx (ou onde estiver)
"use client";
import React, { useEffect, useMemo } from "react";
import useContents from "@/hooks/useContents";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";
import NotFound from "@/app/not-found";
import { makePlaceholderDataUrl } from "@/lib/ImagePlaceholder";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ContentPanel from "@/components/ContentDetail/ContentPainel";

interface Props {
  id: string;
}

export default function ContentDetailClient({ id }: Props) {
  const {
    currentContent,
    loading,
    error,
    fetchContentById,
  } = useContents();

  useEffect(() => {
    if (!id) return;
    if (currentContent?.id === id) return;
    fetchContentById(id);
  }, [id, fetchContentById, currentContent]);

  const placeholder = useMemo(
    () => makePlaceholderDataUrl(currentContent?.title, currentContent?.category ?? ""),
    [currentContent?.title, currentContent?.category]
  );

  const coverSrc = currentContent?.coverUrl ?? null;

  if (loading) return <LoadingOverlay />;
  if (error) return (window.location.href = `/login`);
  if (!currentContent) return <NotFound />;

  return (
    <div className="w-full my-4 flex flex-col gap-2 sm:px-10">
      <Breadcrumbs
        items={[
          { label: "Início", href: "/home" },
          { label: "Conteúdos", href: "/contents" },
          { label: currentContent.title },
        ]}
      />

      <ContentPanel content={currentContent} placeholder={placeholder} coverSrc={coverSrc} />
    </div>
  );
}
