/**
 * Componente: Category Bar
 * Uso: Exibe as categorias de navegação da home
 * Props: initial (string), onChange (callback), className (string)
 * Última alteração: 20/08/2025 por Amanda
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Category = 'Todos' | 'Favoritos' | 'Filmes' | 'Séries' | 'Animes' | 'Livros' | 'Mangás';
const CATEGORIES: Category[] = ['Todos', 'Favoritos',  'Filmes', 'Séries', 'Animes', 'Livros', 'Mangás'];

type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

function CategoryChip({ label, selected = false, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 h-8 rounded-full text-sm transition-colors select-none whitespace-nowrap',
        !selected && 'text-grayBrand-500 border border-gray-800 bg-gray-950 hover:text-neutral-50',
        selected && 'bg-gray-900 text-neutral-50 border border-primary-700',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70',
        className
      )}
    >
      {label}
    </button>
  );
}

export default function CategoryBar({
  initial = 'Todos',
  onChange,
  className,
}: {
  initial?: Category;
  onChange?: (c: Category) => void;
  className?: string;
}) {
  const [selected, setSelected] = useState<Category>(initial);

  const handleSelect = (c: Category) => {
    setSelected(c);
    onChange?.(c);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Carrossel horizontal */}
      <div className="flex overflow-x-auto scrollbar-hide scrollbar-none gap-2 py-2">
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c}
            label={c}
            selected={selected === c}
            onClick={() => handleSelect(c)}
          />
        ))}
      </div>
    </div>
  );
}
