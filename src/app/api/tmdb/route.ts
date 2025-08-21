import { NextResponse } from "next/server";
import { getTrendingTMDB, searchTMDB } from "@/lib/tmdb";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const mode = (searchParams.get("mode") || "trending") as
        | "trending"
        | "search";
    
    const type = (searchParams.get("type") || "movie") as "movie" | "tv";
    const q = searchParams.get("q") || "";
    const page = Number(searchParams.get("page") || "1");

    if (!["movie", "tv"].includes(type)) {
        return NextResponse.json({ error: "type inválido" }, { status: 400 });
    }

    if (mode === "search" && !q.trim()) {
        return NextResponse.json({ data: [] });
    }

    const data =
        mode === "search"
        ? await searchTMDB(type, q.trim(), undefined, page)
        : await getTrendingTMDB(type, "week");

    return NextResponse.json({ data });
    } catch (e: any) {
    return NextResponse.json(
        { error: e?.message ?? "Erro inesperado" },
        { status: 500 }
    );
}
}
