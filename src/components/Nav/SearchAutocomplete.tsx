/**
 * Componente: Search Autocomplete
 * Uso: Realiza busca de conteúdo por categoria e exibe sugestões
 * Props: category (string), onSelect (callback), placeholder (string), minChars (number), containerClassName (string), inputClassName (string)
 * Última alteração: 20/08/2025 por Amanda
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { useCategorySearch } from "@/hooks/useCategorySearch";
import type { ContentItem } from "@/types/tagsTypes";
import clsx from "clsx";

type Props = {
    category: string;
    onSelect?: (item: ContentItem) => void;
    placeholder?: string;
    minChars?: number;

    containerClassName?: string; 
    inputClassName?: string;     
};

export default function SearchAutocomplete({ category, onSelect, placeholder = "Qual conteúdo está procurando?", minChars = 2, containerClassName, inputClassName, }: Props) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);

    // const { data, loading } = useCategorySearch(category, query);
    const boxRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        setOpen(query.trim().length >= minChars);
    }, [query, minChars]);

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    // function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    //     if (!open) return;
    //     const max = data.length - 1;

    //     if (e.key === "ArrowDown") {
    //         e.preventDefault();
    //         setActive((i) => (i < max ? i + 1 : 0));
    //         listRef.current?.children?.[Math.min(active + 1, max)]?.scrollIntoView({ block: "nearest" });
    //     } else if (e.key === "ArrowUp") {
    //         e.preventDefault();
    //         setActive((i) => (i > 0 ? i - 1 : max));
    //         listRef.current?.children?.[Math.max(active - 1, 0)]?.scrollIntoView({ block: "nearest" });
    //     } else if (e.key === "Enter") {
    //         e.preventDefault();
    //         const item = data[active];
    //         if (item) {
    //             onSelect?.(item);
    //             setOpen(false);
    //         }
    //     } else if (e.key === "Escape") {
    //         setOpen(false);
    //     }
    // }

    return (
        <div
            ref={boxRef}
            className={clsx("relative w-full max-w-[520px]", containerClassName)}
        >
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                        // onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        className={clsx(
                            "pl-9 h-12 bg-gray-900 border-0 ring-1 ring-gray-800 focus-visible:ring-2 focus-visible:ring-purple-600 text-gray-100 placeholder:text-gray-500 rounded-xl",
                            inputClassName
                        )}
                    />
                </div>
            </div>

            {open && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-sm shadow-xl">
                    {/* {loading && (
                        <div className="p-4 text-sm text-gray-400">Buscando…</div>
                    )}

                    {!loading && query.trim().length >= minChars && data.length === 0 && (
                        <div className="p-4 text-sm text-gray-400">Nenhum resultado.</div>
                    )} */}

                    {/* {!loading && data.length > 0 && (
                        <ul ref={listRef} className="max-h-72 overflow-auto py-2">
                            {data.slice(0, 8).map((item, i) => (
                                <li
                                    key={`${item.type}-${item.id}`}
                                    onMouseEnter={() => setActive(i)}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onSelect?.(item);
                                        setOpen(false);
                                    }}
                                    className={clsx(
                                        "flex items-center gap-3 px-3 py-2 cursor-pointer",
                                        i === active ? "bg-gray-800" : "hover:bg-gray-800/70"
                                    )}
                                >
                                    <img
                                        src={item.imageUrl || "/assets/default-image.png"}
                                        alt={item.title}
                                        className="w-10 h-14 rounded-md object-cover bg-gray-800"
                                        loading="lazy"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-100 truncate">{item.title}</p>
                                        <p className="text-xs text-gray-400 capitalize">
                                            {item.type}
                                            {item.score != null && <> · nota {item.score}</>}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )} */}
                </div>
            )}
        </div>
    );
}
