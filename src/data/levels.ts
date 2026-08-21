// Imports RELATIFS et non `@/` : ce module est lu par `scripts/check-levels.mts`
// et par le générateur de redirections nginx, qui tournent dans Node sans la
// résolution d'alias de Next.
import { buildLevel } from '../game/build';
import type { Level } from '../game/types';
import { SPECS } from './level-specs';

/**
 * Les énigmes, construites depuis leurs spécifications.
 *
 * La séparation en deux modules n'est pas cosmétique : `level-specs.ts` peut
 * être lu SANS déclencher la construction, ce dont les outils de diagnostic
 * ont besoin pour rapporter toutes les erreurs d'un coup plutôt que la
 * première seulement.
 */
export const LEVELS: readonly Level[] = SPECS.map(buildLevel);

/** Les identifiants, dans l'ordre du catalogue. Importé par la table des
 *  routes : c'est lui qui fait exister une page par énigme et par langue. */
export const PUZZLE_IDS: readonly string[] = LEVELS.map((level) => level.id);

export function levelById(id: string): Level | undefined {
    return LEVELS.find((level) => level.id === id);
}

export const LEVELS_BY_TIER = {
    easy: LEVELS.filter((level) => level.tier === 'easy'),
    medium: LEVELS.filter((level) => level.tier === 'medium'),
    hard: LEVELS.filter((level) => level.tier === 'hard'),
    impossible: LEVELS.filter((level) => level.tier === 'impossible'),
} as const;

export const TIER_ORDER = ['easy', 'medium', 'hard', 'impossible'] as const;
