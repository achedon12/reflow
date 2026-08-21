import { PLAYER_H, PLAYER_W, STEP } from './constants';
import { spawnState, step } from './engine';
import { present, resolve } from './geometry';
import type { Level, PlayerState, Theme, Viewport } from './types';

/**
 * LE VÉRIFICATEUR DE NIVEAUX.
 *
 * Il ne relit pas la géométrie : il JOUE. Une recherche en faisceau explore
 * les suites d'actions possibles en appelant le moteur réel, image par image,
 * jusqu'à toucher la sortie. Ce qu'il prouve n'est donc pas « le niveau a
 * l'air faisable » mais « voici une partie qui le termine ».
 *
 * C'est ce qui rend une énigme écrite à la main publiable sans l'avoir jouée :
 * `npm run levels` la refuse tant qu'aucune solution n'existe.
 *
 * ⚠️ Recherche en FAISCEAU, pas exhaustive : chaque palier ne garde que les
 * meilleurs états. Un échec signifie donc « aucune solution trouvée », jamais
 * « aucune solution n'existe ». C'est le bon sens du compromis — un faux échec
 * se corrige en élargissant le faisceau, un faux succès passerait inaperçu.
 */

/** Images de simulation par action. Un joueur ne change pas d'avis 120 fois
 *  par seconde ; à ce grain, l'arbre reste explorable. */
const MACRO = 10;

/** Paliers explorés. MACRO × MAX_LAYERS × STEP donne le temps maximal accordé. */
const MAX_LAYERS = 280;

/** Largeur du faisceau. Au-delà, le coût grimpe sans rien débloquer. */
const BEAM = 1600;

/** Côté d'une case de diversité, en pixels. Trier le faisceau uniquement par
 *  distance à l'objectif le fait s'effondrer sur un seul point de l'écran :
 *  mille états qui décrivent le même saut. On plafonne donc le nombre d'états
 *  gardés PAR CASE, ce qui force le faisceau à couvrir le niveau. */
const CELL = 44;
const PER_CELL = 5;

type Node = {
    player: PlayerState;
    theme: Theme;
    /** Le saut était-il maintenu à la fin du palier précédent ? Il faut le
     *  savoir : `jumpPressed` ne vaut que sur le FRONT montant. */
    holding: boolean;
};

function keyOf(node: Node): string {
    return `${Math.round(node.player.x / 8)}:${Math.round(node.player.y / 8)}:${Math.round(
        node.player.vx / 70,
    )}:${Math.round(node.player.vy / 70)}:${node.player.orbs}:${node.theme}:${node.holding ? 1 : 0}`;
}

/** Distance à l'objectif courant : la prochaine orbe manquante, ou la sortie.
 *  Sert à trier le faisceau — c'est ce qui remplace une exploration complète. */
function heuristic(level: Level, view: Viewport, node: Node): number {
    const px = node.player.x + PLAYER_W / 2;
    const py = node.player.y + PLAYER_H / 2;

    let orbIndex = 0;
    let remaining = 0;
    let best = Infinity;
    for (const block of level.blocks) {
        if (block.kind !== 'orb') continue;
        const taken = (node.player.orbs & (1 << orbIndex)) !== 0;
        orbIndex += 1;
        if (taken) continue;
        remaining += 1;
        if (!present(block, view, node.theme)) continue;
        const rect = resolve(block.rect, view);
        best = Math.min(best, Math.hypot(rect.x + rect.w / 2 - px, rect.y + rect.h / 2 - py));
    }
    // Le NOMBRE d'orbes restantes domine la distance : sans ce poids, un état
    // qui vient d'en ramasser une paraît pire qu'un état resté collé à la
    // suivante, et la recherche n'en prend jamais aucune.
    if (remaining > 0) return remaining * 6000 + (best === Infinity ? 3000 : best);

    for (const block of level.blocks) {
        if (block.kind !== 'goal') continue;
        if (!present(block, view, node.theme)) continue;
        const rect = resolve(block.rect, view);
        best = Math.min(best, Math.hypot(rect.x + rect.w / 2 - px, rect.y + rect.h / 2 - py));
    }
    return best;
}

/** Le niveau demande-t-il de basculer le thème ? Si non, on n'ajoute pas cette
 *  action : elle doublerait l'arbre pour rien. */
function usesTheme(level: Level): boolean {
    return level.blocks.some((block) => block.theme !== undefined);
}

/**
 * Réduit un palier trop large en gardant sa DIVERSITÉ.
 *
 * On garde les meilleurs états de chaque case de l'écran avant de compléter
 * avec les meilleurs restants : le faisceau couvre alors tout le niveau au
 * lieu de se masser devant le premier obstacle.
 */
function narrow(level: Level, view: Viewport, nodes: Node[]): Node[] {
    const scored = nodes
        .map((node) => ({ node, score: heuristic(level, view, node) }))
        .sort((a, b) => a.score - b.score);

    const perCell = new Map<string, number>();
    const kept: Node[] = [];
    const rest: Node[] = [];

    for (const { node } of scored) {
        const cell = `${Math.floor(node.player.x / CELL)}:${Math.floor(node.player.y / CELL)}:${node.player.orbs}:${node.theme}`;
        const used = perCell.get(cell) ?? 0;
        if (used < PER_CELL && kept.length < BEAM) {
            perCell.set(cell, used + 1);
            kept.push(node);
        } else {
            rest.push(node);
        }
    }

    for (const node of rest) {
        if (kept.length >= BEAM) break;
        kept.push(node);
    }
    return kept;
}

export type Attempt = { solved: boolean; seconds: number; explored: number };

export function solve(level: Level, view: Viewport, startTheme: Theme = 'dark'): Attempt {
    const themeMatters = usesTheme(level);
    const actions: { dir: -1 | 0 | 1; jump: boolean; toggle: boolean }[] = [];
    for (const dir of [-1, 0, 1] as const) {
        for (const jump of [false, true]) {
            actions.push({ dir, jump, toggle: false });
            if (themeMatters) actions.push({ dir, jump, toggle: true });
        }
    }

    let layer: Node[] = [{ player: spawnState(level, view), theme: startTheme, holding: false }];
    let explored = 0;

    for (let depth = 0; depth < MAX_LAYERS; depth += 1) {
        const seen = new Set<string>();
        const next: Node[] = [];

        for (const node of layer) {
            for (const action of actions) {
                const theme: Theme = action.toggle
                    ? node.theme === 'dark'
                        ? 'light'
                        : 'dark'
                    : node.theme;

                let player = node.player;
                let dead = false;
                let won = false;

                for (let frame = 0; frame < MACRO; frame += 1) {
                    const pressed = action.jump && frame === 0 && !node.holding;
                    const result = step(
                        level,
                        view,
                        theme,
                        player,
                        {
                            left: action.dir === -1,
                            right: action.dir === 1,
                            jump: action.jump,
                            jumpPressed: pressed,
                        },
                        STEP,
                    );
                    explored += 1;
                    player = result.player;
                    if (result.outcome === 'won') {
                        won = true;
                        break;
                    }
                    if (result.outcome !== 'playing') {
                        dead = true;
                        break;
                    }
                }

                if (won) {
                    return { solved: true, seconds: player.time, explored };
                }
                if (dead) continue;

                const candidate: Node = { player, theme, holding: action.jump };
                const key = keyOf(candidate);
                if (seen.has(key)) continue;
                seen.add(key);
                next.push(candidate);
            }
        }

        if (next.length === 0) break;

        layer = next.length > BEAM ? narrow(level, view, next) : next;
    }

    return { solved: false, seconds: MAX_LAYERS * MACRO * STEP, explored };
}

/** Les tailles de fenêtre essayées quand la taille de référence ne suffit pas.
 *  Un niveau conçu pour être résolu APRÈS redimensionnement n'est finissable
 *  qu'à certaines cotes — c'est le jeu, pas un défaut. */
export const CANDIDATE_VIEWS: readonly Viewport[] = [
    { w: 640, h: 420 },
    { w: 640, h: 560 },
    { w: 760, h: 480 },
    { w: 760, h: 620 },
    { w: 880, h: 440 },
    { w: 880, h: 560 },
    { w: 1000, h: 500 },
    { w: 1000, h: 620 },
    { w: 1180, h: 540 },
    { w: 1360, h: 620 },
];
