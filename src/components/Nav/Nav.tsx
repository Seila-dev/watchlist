/**
 * Componente: Home navigation
 * Uso: Exibe as tags de navegação da home
 * Props:
 *  - title: string
 *  - children: React.ReactNode
 * Última alteração: 01/08/2025 por Alisson
 */

'use client';

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CategoryBar from "./CategoryBar";
import { MagnifyingGlass } from "phosphor-react";

export default function Nav() {
    return (
        <nav className="flex gap-4 w-full max-w-md">
            <CategoryBar
                onChange={(c) => {
                    console.log('categoria:', c);
                }}
            />

            <div>
                <MagnifyingGlass
                    size={18}
                    weight="bold"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    aria-hidden
                />
                <Input
                    type="text"
                    placeholder="Qual conteúdo está procurando?"
                    className="w-full mb-4">
                </Input>
            </div>

            <Button className="text-neutral-50">
                + Adicionar
            </Button>

        </nav>
    )
}