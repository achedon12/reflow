'use client';

import { useRef } from 'react';
import type { Quarter } from '@/game/types';

/**
 * LES POIGNÉES DE L'ÉCRAN.
 *
 * Huit, comme sur une vraie fenêtre : quatre coins et quatre bords. L'écran
 * étant centré, tirer un bord gauche vers la gauche ÉLARGIT — le geste suit ce
 * que l'œil attend, pas ce que la donnée dit.
 *
 * ⚠️ Sur un écran couché, les axes sont échangés : tirer vers la droite
 * allonge la HAUTEUR. L'encombrement affiché est celui du repère tourné, et la
 * poignée doit obéir à l'image, sinon le réglage devient indéchiffrable.
 */

type Side = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

// ⚠️ Les bords font 2 px à la souris et 4 (16 px) au doigt : huit pixels
// suffisent à un curseur, jamais à une pulpe. Les coins, eux, restent larges
// des deux côtés — ce sont eux qu'on attrape.
const SIDES: { side: Side; box: string; cursor: string }[] = [
    { side: 'n', box: 'grip-h top-0 right-6 left-6', cursor: 'cursor-ns-resize' },
    { side: 's', box: 'grip-h right-6 bottom-0 left-6', cursor: 'cursor-ns-resize' },
    { side: 'w', box: 'grip-v top-6 bottom-6 left-0', cursor: 'cursor-ew-resize' },
    { side: 'e', box: 'grip-v top-6 right-0 bottom-6', cursor: 'cursor-ew-resize' },
    { side: 'nw', box: 'top-0 left-0 size-6', cursor: 'cursor-nwse-resize' },
    { side: 'ne', box: 'top-0 right-0 size-6', cursor: 'cursor-nesw-resize' },
    { side: 'sw', box: 'bottom-0 left-0 size-6', cursor: 'cursor-nesw-resize' },
    { side: 'se', box: 'bottom-0 right-0 size-6', cursor: 'cursor-nwse-resize' },
];

/** Combien chaque bord ajoute à l'encombrement quand on le tire d'un pixel. */
const GAIN: Record<Side, { x: number; y: number }> = {
    n: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    w: { x: -1, y: 0 },
    e: { x: 1, y: 0 },
    nw: { x: -1, y: -1 },
    ne: { x: 1, y: -1 },
    sw: { x: -1, y: 1 },
    se: { x: 1, y: 1 },
};

export function ScreenHandles({
    quarter,
    current,
    onResize,
    label,
}: {
    quarter: Quarter;
    current: () => { w: number; h: number };
    onResize: (w: number, h: number) => void;
    label: string;
}) {
    const from = useRef<{ x: number; y: number; w: number; h: number; side: Side } | null>(null);

    return (
        <>
            {SIDES.map(({ side, box, cursor }) => (
                <button
                    key={side}
                    type="button"
                    aria-label={label}
                    tabIndex={-1}
                    onPointerDown={(event) => {
                        event.preventDefault();
                        (event.target as HTMLElement).setPointerCapture(event.pointerId);
                        const { w, h } = current();
                        from.current = { x: event.clientX, y: event.clientY, w, h, side };
                    }}
                    onPointerMove={(event) => {
                        const start = from.current;
                        if (!start) return;
                        const gain = GAIN[start.side];
                        // Centré : tirer d'un côté fait grandir des DEUX, donc
                        // le double du déplacement du doigt.
                        const dx = (event.clientX - start.x) * gain.x * 2;
                        const dy = (event.clientY - start.y) * gain.y * 2;
                        const odd = quarter % 2 === 1;
                        onResize(start.w + (odd ? dy : dx), start.h + (odd ? dx : dy));
                    }}
                    onPointerUp={() => {
                        from.current = null;
                    }}
                    onPointerCancel={() => {
                        from.current = null;
                    }}
                    className={`absolute z-20 touch-none ${box} ${cursor} bg-transparent hover:bg-[var(--accent)]/25`}
                />
            ))}

            {/* Le coin bas-droit porte en plus la marque du geste : c'est le
                signe de la maison, et il dit que l'écran se tire. */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute right-1 bottom-1 z-10 text-accent"
            >
                <svg viewBox="0 0 16 16" className="size-3.5">
                    <path
                        d="M15 5v10H5M15 15 6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="square"
                    />
                </svg>
            </span>
        </>
    );
}
