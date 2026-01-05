const CATEGORY_LABELS: Record<string, string> = {
  MANGAS: "Mangás",
  MOVIES: "Filmes",
  BOOKS: "Livros",
  ANIMES: "Animes",
  SERIES: "Séries",
};

export function translateCategory(cat: string): string {
  const key = String(cat).toUpperCase().trim();
  return (
    CATEGORY_LABELS[key] ??
    String(key)
      .toLowerCase()
      .split("_")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export function formatDatePtBR(isoDate: string): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateFullPtBR(isoDate: string): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function timeSincePtBR(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  if (isNaN(date.getTime())) return "";

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "agora mesmo";
  }

  if (diffMinutes < 60) {
    return `Há ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
  }

  if (diffHours < 24) {
    return `Há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  }

  return `Há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
}

export function truncateByWords(
  text: string,
  maxWords: number
): { truncated: string; isTruncated: boolean } {
  if (!text) {
    return { truncated: "", isTruncated: false };
  }

  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return { truncated: text, isTruncated: false };
  }

  return {
    truncated: words.slice(0, maxWords).join(" "),
    isTruncated: true,
  };
}

