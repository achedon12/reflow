'use client';

import type { Dictionary } from '@/i18n';
import { format } from '@/i18n/format';
import { useProgress } from './useProgress';

/** Le passage du joueur sur cette énigme. Vide tant que rien n'est joué : une
 *  ligne « pas encore terminée » sur cinquante-quatre pages serait du bruit. */
export function PuzzleRecordLine({ dictionary, puzzleId }: { dictionary: Dictionary; puzzleId: string }) {
    const progress = useProgress();
    const record = progress.puzzles[puzzleId];
    if (!record) return null;

    return (
        <span className="numeric text-sm text-goal-ink">
            {format(dictionary.puzzlePage.statusDone, { time: record.time.toFixed(2) })}
        </span>
    );
}
