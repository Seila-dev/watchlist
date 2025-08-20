"use client";

import { useEffect, useState } from "react";

const KEY = (userId?: string) => `watchlist.ratings.${userId ?? "anon"}`;

function readAll(userId?: string): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(KEY(userId)) || "{}");
  } catch {
    return {};
  }
}

function writeAll(userId: string | undefined, data: Record<string, number>) {
  localStorage.setItem(KEY(userId), JSON.stringify(data));
}

export function useUserRating(itemId: string | number, userId?: string) {
  const id = String(itemId);
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const map = readAll(userId);
    setValue(map[id] ?? 0);
    setLoading(false);
  }, [id, userId]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === KEY(userId)) {
        const map = readAll(userId);
        setValue(map[id] ?? 0);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [id, userId]);

  async function update(next: number) {
    setValue(next); // otimista
    const map = readAll(userId);
    map[id] = next;
    writeAll(userId, map);
  }

  function clear() {
    const map = readAll(userId);
    delete map[id];
    writeAll(userId, map);
    setValue(0);
  }

  return { value, setValue: update, loading, clear };
}
