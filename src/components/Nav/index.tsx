/**
 * Componente: Home navigation
 * Uso: Exibe as tags de navegação da home
 * Última alteração: 28/08/2025 por Erick
 */

'use client';

import CategoryBar from "./CategoryBar";
import { MagnifyingGlass } from "phosphor-react";
import { useState } from "react";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Nav() {
  const [category, setCategory] = useState<string>("Todos");

  return (
    <div className="flex flex-col md:flex-row-reverse justify-between items-center w-full gap-3 mt-6 mb-2 px-3 sm:px-10">
      {/* Input de busca */}
      <div className="relative w-full right-0 flex justify-start md:justify-end">
        <SearchAutocomplete
          category={category}
          placeholder="Qual conteúdo está procurando?"
          inputClassName="w-full pl-10" // espaço para o ícone
          onSelect={(item) => {}}
        />
      </div>

      {/* Carrossel de categorias */}
      <CategoryBar onChange={(c) => setCategory(c)} />
    </div>
  );
}
