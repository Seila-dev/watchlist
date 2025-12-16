"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CardsCarousel from "@/components/Cards/CardCarousel";
import { StatusLabel } from "@/components/StatusLabel";
import Nav from "@/components/Nav";
import useContents from "@/hooks/useContents";
import { Content, ContentCategory, ContentStatus } from "@/types/content";
import { DroppableZone } from "@/components/Wrapper/DroppableZone";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CardPreview } from "@/components/Cards/CardPreview";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";

interface CardItem {
  id: string;
  title: string;
  coverUrl?: string | null;
  rating?: number | null;
  category: ContentCategory;
  createdAt: string;
  status: ContentStatus;
  isFavorite?: boolean;
}

export default function Home() {
  const { contents, loading, error, fetchContents, updateStatus, setContents } = useContents();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Refs para cada carousel
  const watchingCarouselRef = useRef<HTMLDivElement | null>(null);
  const toWatchCarouselRef = useRef<HTMLDivElement | null>(null);
  const finishedCarouselRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const isAnyUpdating = updatingIds.size > 0;

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const contentsByStatus = useMemo(() => {
    return {
      watching: contents.filter((c) => c.status === "WATCHING"),
      toWatch: contents.filter((c) => c.status === "TO_WATCH"),
      finished: contents.filter((c) => c.status === "FINISHED"),
    };
  }, [contents]);

  const convertToCardData = (items: Content[]): CardItem[] => {
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      coverUrl: item.coverUrl ?? null,
      rating: item.rating ?? null,
      category: item.category,
      createdAt: item.createdAt,
      status: item.status,
      annotations: item.annotations ?? null,
      isFavorite: item.isFavorite ?? false,
    }));
  };

  const watchingCards = convertToCardData(contentsByStatus.watching);
  const toWatchCards = convertToCardData(contentsByStatus.toWatch);
  const completedCards = convertToCardData(contentsByStatus.finished);

  const activeCard = useMemo(() => {
    if (!activeId) return null;
    return [...watchingCards, ...toWatchCards, ...completedCards].find(
      (card) => card.id === activeId
    );
  }, [activeId, watchingCards, toWatchCards, completedCards]);

  // Funções de scroll para cada carousel
  const handleWatchingScroll = (dir: "left" | "right") => {
    if (!watchingCarouselRef.current) return;
    const scrollAmount = 350;
    watchingCarouselRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleToWatchScroll = (dir: "left" | "right") => {
    if (!toWatchCarouselRef.current) return;
    const scrollAmount = 350;
    toWatchCarouselRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleFinishedScroll = (dir: "left" | "right") => {
    if (!finishedCarouselRef.current) return;
    const scrollAmount = 350;
    finishedCarouselRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    if (updatingIds.has(id)) {
      setActiveId(null);
      return;
    }
    setActiveId(id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (overId === "WATCHING" || overId === "TO_WATCH" || overId === "FINISHED") {
      const currentCard = contents.find((c) => c.id === activeId);

      if (currentCard && currentCard.status !== overId) {
        const newStatus = overId as ContentStatus;

        setContents((prevContents) =>
          prevContents.map((content) =>
            content.id === activeId
              ? { ...content, status: newStatus }
              : content
          )
        );

        setUpdatingIds((prev) => new Set(prev).add(activeId));

        try {
          await updateStatus(activeId, newStatus);
        } catch (err) {
          console.error("Erro ao atualizar status:", err);
          setContents((prevContents) =>
            prevContents.map((content) =>
              content.id === activeId
                ? { ...content, status: currentCard.status }
                : content
            )
          );
        } finally {
          setUpdatingIds((prev) => {
            const next = new Set(prev);
            next.delete(activeId);
            return next;
          });
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (error) router.push('/login')

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="text-white flex flex-col min-h-screen m-auto gap-0 transition duration-200 w-full">
        <Nav />

        {loading && contents.length === 0 && (
          <LoadingOverlay />
        )}

        {!loading && !error && (
          <>
            <section className="w-full p-3 sm:px-10">
              <StatusLabel
                title="Em andamento"
                length={watchingCards.length}
                variant="watching"
                onScrollLeft={() => handleWatchingScroll("left")}
                onScrollRight={() => handleWatchingScroll("right")}
              />

              <DroppableZone id="WATCHING" className="min-h-[320px] sm:min-h-[380px]">
                {watchingCards.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center py-20 my-5 text-center gap-3">
                    <img src="./assets/computer-icon.png" alt="Computer icon" />
                    <h3 className="text-lg font-semibold text-gray-500">
                      Nenhum conteúdo em andamento
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      <a href="/new" className="underline text-gray-300">
                        Adicione aqui
                      </a>{" "}
                      o que estiver assistindo ou lendo para não perder o ponto.
                    </p>
                  </div>
                ) : (
                  <div
                    ref={watchingCarouselRef}
                    className="flex overflow-x-auto overflow-y-hidden scroll-smooth gap-3 px-2 py-4 custom-scrollbar"
                    style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y", paddingBottom: "20px" }}
                  >
                    {watchingCards.map((item, index) => {
                      const isUpdating = updatingIds.has(item.id);
                      return (
                        <div
                          key={`${item.id}-${index}`}
                          className={`flex-shrink-0 transition-all duration-300 ${
                            isUpdating ? "animate-pulse" : ""
                          }`}
                          style={{ overflow: "visible", position: "relative" }}
                        >
                          <CardPreview {...item} isUpdating={isUpdating} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </DroppableZone>
            </section>

            <section className="w-full p-3 sm:px-10">
              <StatusLabel
                title="Minha lista"
                length={toWatchCards.length}
                variant="toWatch"
                onScrollLeft={() => handleToWatchScroll("left")}
                onScrollRight={() => handleToWatchScroll("right")}
              />

              <DroppableZone id="TO_WATCH" className="min-h-[320px] sm:min-h-[380px]">
                {toWatchCards.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center py-20 my-5 text-center gap-3">
                    <img src="./assets/opened-box-icon.png" alt="Icone caixa aberta" />
                    <h3 className="text-lg font-semibold text-gray-500">
                      Sua Lista está Vazia
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      <a href="/new" className="underline text-gray-300">
                        Adicione aqui
                      </a>{" "}
                      os conteúdos que você deseja começar em breve.
                    </p>
                  </div>
                ) : (
                  <div
                    ref={toWatchCarouselRef}
                    className="flex overflow-x-auto overflow-y-hidden scroll-smooth gap-3 px-2 py-4 custom-scrollbar"
                    style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y", paddingBottom: "20px" }}
                  >
                    {toWatchCards.map((item, index) => {
                      const isUpdating = updatingIds.has(item.id);
                      return (
                        <div
                          key={`${item.id}-${index}`}
                          className={`flex-shrink-0 transition-all duration-300 ${
                            isUpdating ? "animate-pulse" : ""
                          }`}
                          style={{ overflow: "visible", position: "relative" }}
                        >
                          <CardPreview {...item} isUpdating={isUpdating} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </DroppableZone>
            </section>

            <section className="w-full p-3 sm:px-10">
              <StatusLabel
                title="Finalizados"
                length={completedCards.length}
                variant="finished"
                onScrollLeft={() => handleFinishedScroll("left")}
                onScrollRight={() => handleFinishedScroll("right")}
              />

              <DroppableZone id="FINISHED" className="min-h-[320px] sm:min-h-[380px]">
                {completedCards.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center py-20 my-5 text-center gap-3">
                    <img src="./assets/notes-icon.png" alt="Icone de bloco de anotações" />
                    <h3 className="text-lg font-semibold text-gray-500">
                      Finalizou um conteúdo?
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      Arraste seu conteúdo para ele aparecer aqui!
                    </p>
                  </div>
                ) : (
                  <div
                    ref={finishedCarouselRef}
                    className="flex overflow-x-auto overflow-y-hidden scroll-smooth gap-3 px-2 py-4 custom-scrollbar"
                    style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y", paddingBottom: "20px" }}
                  >
                    {completedCards.map((item, index) => {
                      const isUpdating = updatingIds.has(item.id);
                      return (
                        <div
                          key={`${item.id}-${index}`}
                          className={`flex-shrink-0 transition-all duration-300 ${
                            isUpdating ? "animate-pulse" : ""
                          }`}
                          style={{ overflow: "visible", position: "relative" }}
                        >
                          <CardPreview {...item} isUpdating={isUpdating} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </DroppableZone>
            </section>
          </>
        )}
      </main>

      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <div className="opacity-80 rotate-3 scale-105">
            <CardPreview {...activeCard} />
          </div>
        ) : null}
      </DragOverlay>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
          margin: 0 16px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e1f20;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1e1a5f;
          cursor: pointer;
        }
      `}</style>
    </DndContext>
  );
}