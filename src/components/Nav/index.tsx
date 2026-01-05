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
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function Nav() {
  const [category, setCategory] = useState<string>("Todos");

  return (
    <div className="flex flex-col md:flex-row-reverse justify-between items-center w-full gap-3 mt-3 mb-0 sm:mb-2 px-3 sm:px-10">
      {/* Input de busca */}
      <div className="relative w-full right-0 flex items-center justify-start md:justify-end">
        <SearchAutocomplete
          category={category}
          placeholder="Qual conteúdo está procurando?"
          inputClassName="w-full pl-10" // espaço para o ícone
          onSelect={(item) => {}}
        />
                <Button className="text-white sm:hidden flex mx-2 w-12" variant={"default"}>
          <Plus  />
        </Button>
      </div>
      

      {/* Carrossel de categorias */}
      <CategoryBar onChange={(c) => setCategory(c)} />
    </div>
  );
}
