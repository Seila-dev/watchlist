"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

  // Configuração dos sensores do dnd-kit
  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 8,
  //     },
  //   })
  // );

  const sensors = useSensors(
    // TouchSensor em primeiro para priorizar touch-important activation rules on mobile
    useSensor(TouchSensor, {
      activationConstraint: {
        // segure ~200–260ms para iniciar drag no mobile (tweak aqui)
        delay: 200,
        // tolerância de movimento durante o delay (px)
        tolerance: 8,
      },
    }),
    // PointerSensor para mouse (desktop)
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
      isFavorite: item.isFavorite ?? false,
    }));
  };

  const watchingCards = convertToCardData(contentsByStatus.watching);
  const toWatchCards = convertToCardData(contentsByStatus.toWatch);
  const completedCards = convertToCardData(contentsByStatus.finished);

  // Encontra o card ativo para mostrar no DragOverlay
  const activeCard = useMemo(() => {
    if (!activeId) return null;
    return [...watchingCards, ...toWatchCards, ...completedCards].find(
      (card) => card.id === activeId
    );
  }, [activeId, watchingCards, toWatchCards, completedCards]);

  const handleDragStart = (event: DragStartEvent) => {
    // setActiveId(event.active.id as string);
    const id = event.active.id as string;
    // evita iniciar drag se o item está atualizando
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

        // Optismtic update
        setContents((prevContents) =>
          prevContents.map((content) =>
            content.id === activeId
              ? { ...content, status: newStatus }
              : content
          )
        );

        // Marca como "atualizando" para mostrar feedback
        setUpdatingIds((prev) => new Set(prev).add(activeId));

        // Agora sim chama a API em background
        try {
          await updateStatus(activeId, newStatus);
        } catch (err) {
          // Se der erro, reverte para o status original
          console.error("Erro ao atualizar status:", err);
          setContents((prevContents) =>
            prevContents.map((content) =>
              content.id === activeId
                ? { ...content, status: currentCard.status }
                : content
            )
          );
        } finally {
          // Remove o indicador de "atualizando"
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
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
              <p className="text-gray-400">Carregando seus conteúdos...</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="w-full p-3 sm:px-10">
              <StatusLabel
                title="Em andamento"
                length={watchingCards.length}
                variant="watching"
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
                  <CardsCarousel
                    items={watchingCards}
                    updatingIds={updatingIds}
                  />
                )}
              </DroppableZone>
            </section>

            <section className="w-full p-3 sm:px-10">
              <StatusLabel
                title="Minha lista"
                length={toWatchCards.length}
                variant="toWatch"
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
                  <CardsCarousel
                    items={toWatchCards}
                    updatingIds={updatingIds}
                  />
                )}
              </DroppableZone>
            </section>

            <section className="w-full p-3 sm:px-10">
              <StatusLabel
                title="Finalizados"
                length={completedCards.length}
                variant="finished"
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
                  <CardsCarousel
                    items={completedCards}
                    updatingIds={updatingIds}
                  />
                )}
              </DroppableZone>
            </section>
          </>
        )}
      </main>

      {/* Overlay que mostra o card sendo arrastado */}
      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <div className="opacity-80 rotate-3 scale-105">
            <CardPreview {...activeCard} />
          </div>
        ) : null}
      </DragOverlay>
      
    </DndContext>
  );
}