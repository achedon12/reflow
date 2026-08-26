/**
 * LE FILS QUI REJOUE.
 *
 * Rien d'autre : il reçoit une énigme à prouver, rend un verdict, recommence.
 * Le père est `check-levels`, qui en lance un par cœur — rejouer cent énigmes
 * sur un seul prend une demi-heure, et un contrôle qu'on ne lance plus ne
 * protège de rien.
 *
 * Ce fichier est séparé pour une raison bête et suffisante : un fils ne doit
 * exécuter QUE ça. Mêlé au père, il aurait rejoué ses contrôles de forme et
 * écrit son rapport, cent fois.
 */
import { SPECS } from '../src/data/level-specs.ts';
import { LEVELS } from '../src/data/levels.ts';
import { buildLevel } from '../src/game/build.ts';
import { generateLevel } from '../src/game/generator.ts';
import { slowMotion } from '../src/game/reduced-motion.ts';
import { CANDIDATE_VIEWS, solve } from '../src/game/solver.ts';
import type { Level, Theme, Viewport } from '../src/game/types.ts';
import { serveWorker } from './parallel.mts';

export type Job =
    | { kind: 'play'; id: string }
    | { kind: 'slow'; id: string }
    /** L'énigme se termine-t-elle à la taille de DÉPART, rotation interdite ?
     *  Si oui, elle n'oblige le joueur à rien : ni poignée, ni quart de tour. */
    | { kind: 'free'; id: string; view: Viewport }
    | { kind: 'seed'; seed: number; depth: number; view: Viewport };

export type Verdict =
    | { label: string; tier: string; view: string; seconds: number }
    | { label: string; failed: string };

export function views(level: Level): Viewport[] {
    // La taille de conception d'abord : c'est celle qui doit marcher en
    // général, et l'essayer en premier évite dix recherches inutiles.
    return [
        level.reference,
        ...CANDIDATE_VIEWS.filter((view) => view.w !== level.reference.w || view.h !== level.reference.h),
    ];
}

/** Cherche une taille et un thème où le niveau se termine. */
function playable(level: Level): { view: Viewport; seconds: number } | null {
    const themes: Theme[] = level.blocks.some((block) => block.theme) ? ['dark', 'light'] : ['dark'];
    for (const view of views(level)) {
        for (const theme of themes) {
            const attempt = solve(level, view, theme);
            if (attempt.solved) return { view, seconds: attempt.seconds };
        }
    }
    return null;
}

export function work(job: Job): Verdict {
    if (job.kind === 'seed') {
        const level = generateLevel({ seed: job.seed, depth: job.depth, reference: job.view });
        const label = `graine ${String(job.seed).padEnd(6)} palier ${String(job.depth).padEnd(3)}`;
        const attempt = solve(level, job.view);
        return attempt.solved
            ? { label, tier: level.tier, view: `${job.view.w}×${job.view.h}`, seconds: attempt.seconds }
            : { label, failed: 'partie engendrée insoluble' };
    }

    if (job.kind === 'free') {
        const spec = SPECS.find((candidate) => candidate.id === job.id);
        if (!spec) return { label: job.id, failed: 'énigme inconnue' };
        // Sans `gravity`, le vérificateur ne pivote pas : on mesure ce que le
        // joueur obtient en ne touchant à rien.
        const frozen = buildLevel({ ...spec, mechanics: spec.mechanics.filter((key) => key !== 'gravity') });
        const themes: Theme[] = frozen.blocks.some((block) => block.theme) ? ['dark', 'light'] : ['dark'];
        for (const theme of themes) {
            const attempt = solve(frozen, job.view, theme);
            if (attempt.solved) {
                return { label: spec.id, tier: spec.tier, view: 'libre', seconds: attempt.seconds };
            }
        }
        return { label: spec.id, failed: 'exige un réglage' };
    }

    const level = LEVELS.find((candidate) => candidate.id === job.id);
    if (!level) return { label: job.id, failed: 'énigme inconnue' };
    const found = playable(job.kind === 'slow' ? slowMotion(level) : level);
    if (!found) {
        return {
            label: level.id,
            failed:
                job.kind === 'slow'
                    ? 'plus finissable une fois le mouvement ralenti'
                    : `aucune solution trouvée, à aucune des ${views(level).length} tailles essayées`,
        };
    }
    return { label: level.id, tier: level.tier, view: `${found.view.w}×${found.view.h}`, seconds: found.seconds };
}

if (process.argv.includes('--worker')) serveWorker<Job, Verdict>(work);
