'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Category = 'Todos' | 'Filmes' | 'Séries' | 'Animes' | 'Livros' | 'Mangás';

const CATEGORIES: Category[] = ['Todos', 'Filmes', 'Séries', 'Animes', 'Livros', 'Mangás'];

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
                // base
                'px-4 h-9 rounded-full text-sm transition-colors select-none',
                'border border-transparent',
                // Default
                !selected && 'text-grayBrand-500',
                // Hover (aplica quando não selecionado)
                !selected && 'bg-gray-900 hover:text-neutral-50',
                selected && 'bg-gray-900 text-neutral-50 border border-primary-700',
                // Focus a11y
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
        <nav className={cn('w-full', className)}>
            <ul className="flex flex-wrap items-center gap-2">
                {CATEGORIES.map((c) => (
                    <li key={c}>
                        <CategoryChip
                            label={c}
                            selected={selected === c}
                            onClick={() => handleSelect(c)}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
}
