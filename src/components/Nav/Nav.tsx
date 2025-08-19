/**
 * Componente: Home navigation
 * Uso: Exibe as tags de navegação da home
 * Props:
 *  - title: string
 *  - children: React.ReactNode
 * Última alteração: 01/08/2025 por Amanda
 */

'use client';

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CategoryBar from "./CategoryBar";
import { MagnifyingGlass } from "phosphor-react";
import { Plus } from "phosphor-react";
import { useCategorySearch } from "@/hooks/useCategorySearch";
import { useState } from "react";

export default function Nav() {
    const [category, setCategory] = useState<string>("Todos");
    const [query, setQuery] = useState<string>("");

    const { data, loading, error } = useCategorySearch(category, query);

    return (
        <main>
            <nav className="mx-auto flex w-full max-w-3xl items-center gap-3">
                <CategoryBar
                    onChange={(c) => setCategory(c)}
                />

                <div className="relative flex-1 min-w-[290px]">
                    <MagnifyingGlass
                        size={18}
                        weight="bold"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        aria-hidden={true}
                    />
                    <Input
                        type="text"
                        placeholder="Qual conteúdo está procurando?"
                        onChange={(e) => setQuery(e.target.value)}
                        className="h-10 w-full pl-9 pr-3 text-neutral-50 bg-gray-900 placeholder:text-gray-500 border-none"
                    />
                </div>


                <Button variant="secondary" size="lg" className="text-neutral-50 border border-grayBrand-700">
                    <Plus weight="bold" />
                    Adicionar
                </Button>
            </nav>

                <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {loading && <li className="col-span-full text-zinc-400">Carregando…</li>}
                    {!loading && data.map(item => (
                        <li key={`${item.type}-${item.id}`} className="bg-zinc-900/50 rounded-lg overflow-hidden border border-zinc-800">
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                            )}
                            <div className="p-3">
                                <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                                {item.score != null && (
                                    <p className="text-xs text-zinc-400 mt-1">Score: {item.score}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>


        </main>




    );
}
