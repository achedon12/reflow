'use client';

import { Play } from 'lucide-react';
import { useGame } from './GameProvider';

/**
 * Le bouton qui ouvre l'aire de jeu.
 *
 * Il ne navigue pas : le jeu se superpose à la page. Une page d'énigme reste
 * donc une page de texte indexable, et le joueur qui ferme l'aire retombe
 * exactement là où il était.
 */
export function PlayButton({
    puzzleId,
    seed,
    depth,
    children,
    variant = 'primary',
}: {
    puzzleId?: string;
    seed?: string;
    depth?: number;
    children: React.ReactNode;
    variant?: 'primary' | 'ghost';
}) {
    const { startPuzzle, startEndless } = useGame();

    return (
        <button
            type="button"
            onClick={() => {
                if (puzzleId) startPuzzle(puzzleId);
                else startEndless(seed, depth);
            }}
            className={
                variant === 'primary'
                    ? 'inline-flex items-center gap-2 border border-accent bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90'
                    : 'inline-flex items-center gap-2 border border-border-strong px-3 py-1.5 text-sm text-fg transition-colors hover:bg-bg-sunken'
            }
        >
            <Play aria-hidden="true" className="size-4" />
            {children}
        </button>
    );
}
