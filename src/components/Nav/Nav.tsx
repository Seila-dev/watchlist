/**
 * Componente: Home navigation
 * Uso: Exibe as tags de navegação da home
 * Última alteração: 27/08/2025 por Erick
 */

'use client';

import CategoryBar from "./CategoryBar";
import { MagnifyingGlass } from "phosphor-react";
import { useCategorySearch } from "@/hooks/useCategorySearch";
import { useState } from "react";
import { CardPreview } from "../Cards/CardPreview";
import { contentItemToCardData } from "@/adapters/contentToCard";
import { CardSkeleton } from "../Cards/CardSkeleton";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Nav() {
    const [category, setCategory] = useState<string>("Todos");
    const [query, setQuery] = useState<string>("");

    const { data, loading, error } = useCategorySearch(category, query);

    return (
        <>
            <nav className="flex justify-between items-center w-full gap-4 mt-6 mb-2 px-10 sm:mb-2">
                <CategoryBar onChange={(c) => setCategory(c)} />

                <div className="relative flex-1 min-w-[290px]">
                    <MagnifyingGlass
                        size={18}
                        weight="bold"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        aria-hidden={true}
                    />
                    <SearchAutocomplete
                        category={category}
                        placeholder="Qual conteúdo está procurando?"
                        onSelect={(item) => {
                        }}
                    />
                </div>
            </nav>

            {error && (
                <p className="mt-3 text-sm text-red-400">
                    {error || "Não foi possível carregar os itens."}
                </p>
            )}


            <section className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-max mx-auto">
                {loading
                    ? Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)
                    : data.map((item) => (
                        <CardPreview key={item.id} {...contentItemToCardData(item)} />
                    ))}
            </section>
        </>
    );

}
