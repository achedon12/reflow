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
            className={variant === 'primary' ? 'btn btn-accent' : 'btn'}
        >
            <Play aria-hidden="true" className="size-4" />
            {children}
        </button>
    );
}
