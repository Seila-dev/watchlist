/**
 * Componente: Rating Stars
 * Uso: Exibe estrelas de avaliação com suporte a controle e leitura
 * Props: value (number), defaultValue (number), onChange (callback), max (number), step (1 | 0.5), readOnly (boolean), size (number), className (string)
 * Última alteração: 20/08/2025 por Amanda
 */

"use client";

import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";

type Props = {
    value?: number;              
    defaultValue?: number;       
    onChange?: (v: number) => void;
    max?: number;                
    step?: 1 | 0.5;              
    readOnly?: boolean;
    size?: number;               
    className?: string;
    "aria-label"?: string;
};

export function RatingStars({ value, defaultValue = 0, onChange, max = 5, step = 0.5, readOnly = false, size = 18, className, ...rest }: Props) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(defaultValue);
    const [hover, setHover] = useState<number | null>(null);

    const current = isControlled ? (value ?? 0) : internal;
    const display = hover ?? current;
    const items = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);

    function commit(v: number) {
        if (readOnly) return;
        if (!isControlled) setInternal(v);
        onChange?.(v);
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (readOnly) return;
        const delta = step;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            commit(Math.min(max, roundTo(current + delta, step)));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            commit(Math.max(0, roundTo(current - delta, step)));
        } else if (e.key === "Home") {
            e.preventDefault();
            commit(0);
        } else if (e.key === "End") {
            e.preventDefault();
            commit(max);
        }
    }

    return (
        <div
            role={readOnly ? undefined : "radiogroup"}
            aria-label={rest["aria-label"] ?? "Avaliação"}
            tabIndex={readOnly ? -1 : 0}
            onKeyDown={onKeyDown}
            className={clsx("inline-flex items-center gap-1", className)}
        >
            {items.map((i) => {
                const full = display >= i;
                const half = !full && step === 0.5 && display >= i - 0.5;

                return (
                    <button
                        key={i}
                        type="button"
                        role={readOnly ? undefined : "radio"}
                        aria-checked={readOnly ? undefined : current >= i}
                        disabled={readOnly}
                        onMouseEnter={() => !readOnly && setHover(i)}
                        onMouseMove={(e) => {
                            if (readOnly || step !== 0.5) return;
                            const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            const secondHalf = e.clientX - r.left > r.width / 2;
                            setHover(secondHalf ? i : i - 0.5);
                        }}
                        onMouseLeave={() => !readOnly && setHover(null)}
                        onClick={() => commit(hover ?? i)}
                        className="relative p-0.5"
                        title={`${i} / ${max}`}
                    >
                        <Star size={size} className="text-gray-600/60" />
                        <Star
                            size={size}
                            className={clsx(
                                "absolute left-0 top-0",
                                full
                                    ? "text-yellow-400 fill-yellow-400"
                                    : half
                                        ? "text-yellow-400 fill-yellow-400 clip-half"
                                        : "text-transparent"
                            )}
                        />
                    </button>
                );
            })}

            <style jsx>{`.clip-half{clip-path:inset(0 50% 0 0);}`}</style>
        </div>
    );
}

function roundTo(n: number, step: 1 | 0.5) {
    return step === 1 ? Math.round(n) : Math.round(n * 2) / 2;
}
