import type { Level } from './types';

/**
 * LE MOUVEMENT RÉDUIT.
 *
 * La règle CSS `prefers-reduced-motion` coupe les animations de la page, mais
 * elle ne pouvait rien sur les plateformes et les lames : celles-ci sont
 * pilotées par le moteur, pas par une feuille de style. Seize énigmes
 * restaient donc en mouvement pour qui a réglé sa machine pour l'éviter.
 *
 * Supprimer le mouvement n'était pas une option : il fait la difficulté de ces
 * niveaux, et les figer les rendrait triviaux ou impossibles selon la phase.
 * On allonge donc la PÉRIODE : les blocs parcourent la même course, deux fois
 * plus lentement.
 *
 * ⚠️ La période, et surtout PAS l'amplitude. Le constructeur d'énigmes déduit
 * la portée d'un saut en retirant l'amplitude du mouvement ; y toucher
 * invaliderait la garantie de jouabilité de chaque palier. Un mouvement plus
 * lent, lui, ne fait que laisser plus de temps au joueur — et
 * `npm run levels` rejoue les deux variantes pour le prouver.
 */

export const REDUCED_MOTION_FACTOR = 2;

export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Rend le niveau tel quel s'il ne bouge pas : inutile de recopier des blocs. */
export function slowMotion(level: Level, factor = REDUCED_MOTION_FACTOR): Level {
    if (!level.blocks.some((block) => block.motion)) return level;
    return {
        ...level,
        blocks: level.blocks.map((block) =>
            block.motion
                ? { ...block, motion: { ...block.motion, period: block.motion.period * factor } }
                : block,
        ),
    };
}
