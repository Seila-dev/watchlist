// components/CardsCarousel/Skeleton.tsx
"use client";
export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-72 h-96 bg-gray-800 rounded-2xl animate-pulse" />
      ))}
    </>
  );
}
