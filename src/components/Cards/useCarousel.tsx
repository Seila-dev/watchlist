"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseCarouselProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  itemsToScrollPerClick?: number;
  gapPx?: number;
};

export function useCarousel({
  containerRef,
  itemsToScrollPerClick = 1,
  gapPx = 24,
}: UseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const dragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const lastDelta = useRef(0);

  const getCardWidthWithGap = useCallback(() => {
    const el = containerRef.current;
    if (!el || !el.children.length) return 0;
    const first = el.children[0] as HTMLElement;
    return first.offsetWidth + gapPx;
  }, [containerRef, gapPx]);

  const updateScrollStates = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    const step = getCardWidthWithGap();
    if (step > 0) {
      const approx = Math.round(scrollLeft / step);
      setCurrentIndex(approx);
    }
  }, [containerRef, getCardWidthWithGap]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = containerRef.current;
      if (!el) return;
      const step = getCardWidthWithGap();
      const maxIndex = Math.max(0, Math.floor((el.scrollWidth - el.clientWidth) / (step || 1)));
      const target = Math.max(0, Math.min(index, maxIndex));
      el.scrollTo({ left: target * step, behavior });
      setCurrentIndex(target);
      setTimeout(updateScrollStates, behavior === "smooth" ? 300 : 0);
    },
    [containerRef, getCardWidthWithGap, updateScrollStates]
  );

  const scrollBy = useCallback(
    (dir: "left" | "right") => {
      const delta = dir === "left" ? -itemsToScrollPerClick : itemsToScrollPerClick;
      scrollToIndex(currentIndex + delta);
    },
    [currentIndex, itemsToScrollPerClick, scrollToIndex]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // pointerdown em capture — pega eventos que iniciam em filhos do container
    const onPointerDown = (e: PointerEvent) => {
      // só processa se o pointer iniciar dentro do container (ou seus filhos)
      if (!containerRef.current || !containerRef.current.contains(e.target as Node)) return;
      dragging.current = true;
      try {
        // tenta capturar o pointer no elemento do container
        containerRef.current.setPointerCapture?.(e.pointerId);
      } catch {
        // ignore se não for possível
      }
      startX.current = e.clientX;
      startScrollLeft.current = containerRef.current.scrollLeft;
      lastDelta.current = 0;
      containerRef.current.classList.add("cursor-grabbing");
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const delta = e.clientX - startX.current;
      lastDelta.current = delta;
      containerRef.current.scrollLeft = startScrollLeft.current - delta;
      e.preventDefault();
    };

    const finishDrag = (e: PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      dragging.current = false;
      try {
        containerRef.current.releasePointerCapture?.(e.pointerId);
      } catch {}
      containerRef.current.classList.remove("cursor-grabbing");

      const moved = lastDelta.current;
      const step = getCardWidthWithGap();
      const threshold = step * 0.3;
      if (Math.abs(moved) > threshold) {
        // note: moved>0 => user dragged pointer to the right (content moved left) => previous
        const dir = moved > 0 ? "left" : "right";
        scrollBy(dir);
      } else {
        const nearest = Math.round(containerRef.current.scrollLeft / (step || 1));
        scrollToIndex(nearest);
      }
    };

    // use capture:true so the container catches pointerdown even if the target is a child
    el.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", finishDrag);
    el.addEventListener("pointercancel", finishDrag);
    //el.addEventListener("mouseleave", finishDrag);
    el.addEventListener("scroll", updateScrollStates);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
      window.removeEventListener("pointermove", onPointerMove as any);
      window.removeEventListener("pointerup", finishDrag as any);
      el.removeEventListener("pointercancel", finishDrag as any);
      el.removeEventListener("mouseleave", finishDrag as any);
      el.removeEventListener("scroll", updateScrollStates);
    };
  }, [containerRef, getCardWidthWithGap, scrollBy, scrollToIndex, updateScrollStates]);

  useEffect(() => {
    const t = setTimeout(updateScrollStates, 50);
    return () => clearTimeout(t);
  }, [updateScrollStates]);

  return {
    currentIndex,
    canScrollLeft,
    canScrollRight,
    scrollBy,
    scrollToIndex,
  };
}
