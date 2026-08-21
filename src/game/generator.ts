import { maxRunForRise, PLAYER_H, PLAYER_W } from './constants';
import { makeRng } from './rng';
import type { Anchor, Block, Level, Mechanic, Rect, Tier, Viewport } from './types';

/**
 * LA GÉNÉRATION D'UNE PARTIE, À PARTIR D'UNE GRAINE.
 *
 * Elle ne tire pas des plateformes au hasard pour vérifier ensuite si le
 * niveau se termine : elle CONSTRUIT le chemin, en serpentin, du bas vers le
 * haut. Chaque plateforme est posée à portée de saut de la précédente — la
 * portée étant DÉDUITE de la hauteur à franchir, puisque monter et avancer se
 * disputent le même temps de vol.
 *
 * Le niveau est donc finissable par construction : il n'y a aucun tirage à
 * jeter, et deux joueurs qui entrent la même graine reçoivent le même niveau
 * sans qu'aucun serveur ne le leur envoie.
 *
 * ⚠️ La garantie vaut à la TAILLE DE RÉFÉRENCE, celle affichée en jeu. En
 * dehors, les ancrages écartent le chemin — c'est exactement le jeu, et le
 * joueur peut toujours revenir à la cote.
 */

const PLATFORM_H = 14;
const MARGIN_X = 34;
const MARGIN_TOP = 76;
const MARGIN_BOTTOM = 60;

/** Écart entre deux rangées du serpentin. Il doit rester sous la hauteur de
 *  saut ET au-dessus de la taille du personnage plus l'épaisseur d'une
 *  plateforme, sans quoi deux rangées se toucheraient. */
const ROW_STEP = 66;

/** Variation de hauteur AU SEIN d'une rangée. Bornée pour la même raison. */
const ROW_JITTER = 8;

/** Amplitude maximale d'une plateforme mobile, et la portée qu'elle coûte. */
const MOTION_AMPLITUDE = 18;
const MOTION_SLACK = 36;

export type EndlessOptions = {
    seed: number;
    /** Le rang de la partie dans la série. C'est lui qui monte la difficulté. */
    depth: number;
    reference: Viewport;
};

export function tierFor(depth: number): Tier {
    if (depth <= 3) return 'easy';
    if (depth <= 8) return 'medium';
    return 'hard';
}

/** Traduit un rectangle absolu en ancrage, en tirant au sort le bord de
 *  référence de chaque axe. C'est ce tirage qui décide de la façon dont le
 *  niveau se déforme quand la fenêtre change de taille. */
function toAnchor(rect: Rect, reference: Viewport, fromRight: boolean, fromBottom: boolean): Anchor {
    return {
        ax: fromRight ? 1 : 0,
        ox: fromRight ? rect.x - reference.w : rect.x,
        ay: fromBottom ? 1 : 0,
        oy: fromBottom ? rect.y - reference.h : rect.y,
        aw: 0,
        ah: 0,
        ow: rect.w,
        oh: rect.h,
    };
}

type Step = Rect & {
    moving: boolean;
    /** Le bord d'ancrage tiré au sort. ⚠️ La sortie et les orbes posées sur ce
     *  palier DOIVENT reprendre le même : ancrées autrement, elles s'en
     *  décollent dès que la fenêtre change de taille, et le niveau devient
     *  infinissable partout ailleurs qu'à la cote de référence. */
    fromRight: boolean;
    fromBottom: boolean;
};

export function generateLevel({ seed, depth, reference }: EndlessOptions): Level {
    const rng = makeRng(seed ^ (depth * 0x9e3779b9));
    const tier = tierFor(depth);

    const wanted = tier === 'easy' ? rng.int(5, 6) : tier === 'medium' ? rng.int(7, 9) : rng.int(9, 12);
    const movers = tier === 'easy' ? 0 : tier === 'medium' ? rng.int(1, 2) : rng.int(2, 3);
    const floor: Level['floor'] = tier === 'hard' && rng.chance(0.6) ? 'deadly' : 'solid';

    const top = MARGIN_TOP;
    const bottom = reference.h - MARGIN_BOTTOM - PLATFORM_H;
    const minWidth = tier === 'hard' ? 58 : 76;
    const maxWidth = tier === 'hard' ? 112 : 150;

    // La première plateforme, en bas à gauche : le joueur y apparaît.
    const steps: Step[] = [
        {
            x: MARGIN_X,
            y: bottom,
            w: rng.range(110, 150),
            h: PLATFORM_H,
            moving: false,
            fromRight: false,
            fromBottom: false,
        },
    ];

    let direction: 1 | -1 = 1;
    let rowY = bottom;
    let placed = 0;

    // Le serpentin tourne quand il manque de place — mais sur un écran large il
    // n'en manque jamais, et la partie devient une ligne droite au ras du sol.
    // On lui impose donc de monter au bout de quelques paliers, place ou pas.
    let inRow = 1;
    let rowLimit = rng.int(3, 5);

    for (let i = 1; i < wanted; i += 1) {
        const previous = steps[i - 1]!;
        const width = rng.range(minWidth, maxWidth);

        // Une plateforme mobile se dérobe pendant le vol : le saut qui l'atteint
        // doit être calculé sur la position la moins favorable.
        const moving = movers > 0 && placed < movers && i > 1 && i < wanted - 1 && rng.chance(0.55);
        const slack = moving ? MOTION_SLACK : 0;

        let x: number;
        let y: number;

        const jitter = rng.range(-ROW_JITTER, ROW_JITTER);
        const flat = Math.max(top, Math.min(bottom, rowY + jitter));
        const flatGap = rng.range(34, Math.max(40, maxRunForRise(Math.max(0, previous.y - flat)) - slack));
        const flatX = direction === 1 ? previous.x + previous.w + flatGap : previous.x - flatGap - width;

        const roomAhead =
            direction === 1 ? flatX + width <= reference.w - MARGIN_X : flatX >= MARGIN_X;

        if (roomAhead && inRow < rowLimit) {
            x = flatX;
            y = flat;
            inRow += 1;
        } else {
            // Demi-tour : on monte d'une rangée et on repart dans l'autre sens.
            // Le saut de montée vaut exactement ROW_STEP, jamais davantage.
            const climbY = rowY - ROW_STEP;
            if (climbY < top) break; // Plus de place en hauteur : le niveau s'arrête ici.

            direction = direction === 1 ? -1 : 1;
            rowY = climbY;
            y = climbY;
            inRow = 1;
            rowLimit = rng.int(3, 5);
            const climbGap = rng.range(34, Math.max(40, maxRunForRise(ROW_STEP) - slack));
            x =
                direction === 1
                    ? previous.x + previous.w + climbGap
                    : previous.x - climbGap - width;
            x = Math.max(MARGIN_X, Math.min(reference.w - MARGIN_X - width, x));
        }

        // Le tirage des bords est ce qui rend deux graines VISIBLEMENT
        // différentes une fois la fenêtre redimensionnée.
        steps.push({
            x,
            y,
            w: width,
            h: PLATFORM_H,
            moving,
            fromRight: rng.chance(0.45),
            fromBottom: rng.chance(0.4),
        });
        if (moving) placed += 1;
    }

    const blocks: Block[] = [];
    const mechanics: Mechanic[] = ['resize', 'edge'];

    steps.forEach((stepRect) => {
        const block: Block = {
            kind: 'solid',
            rect: toAnchor(stepRect, reference, stepRect.fromRight, stepRect.fromBottom),
        };
        if (stepRect.moving) {
            block.motion = {
                dx: rng.chance(0.5) ? rng.range(10, MOTION_AMPLITUDE) : 0,
                dy: rng.range(10, MOTION_AMPLITUDE),
                period: rng.range(2.8, 4.4),
                phase: rng.range(0, 1),
            };
        }
        blocks.push(block);
    });
    if (steps.some((stepRect) => stepRect.moving)) mechanics.push('motion');

    // Des pointes AU SOL uniquement : elles rendent la chute coûteuse sans
    // jamais boucher le chemin, qui passe au-dessus.
    if (floor === 'solid' && tier !== 'easy') {
        const strips = rng.int(1, tier === 'hard' ? 3 : 2);
        for (let i = 0; i < strips; i += 1) {
            const width = rng.range(90, 200);
            const left = rng.range(MARGIN_X, Math.max(MARGIN_X, reference.w - MARGIN_X - width));
            blocks.push({
                kind: 'spike',
                rect: toAnchor(
                    { x: left, y: reference.h - 16, w: width, h: 16 },
                    reference,
                    rng.chance(0.5),
                    true,
                ),
            });
        }
    }

    // Les orbes se posent SUR le chemin : ramassées en passant, elles ne
    // demandent aucun détour impossible.
    const orbs = tier === 'easy' || steps.length < 4 ? 0 : rng.int(1, tier === 'hard' ? 3 : 2);
    for (let i = 0; i < orbs; i += 1) {
        const host = steps[rng.int(1, steps.length - 2)]!;
        blocks.push({
            kind: 'orb',
            rect: toAnchor(
                { x: host.x + host.w / 2 - 8, y: host.y - 26, w: 16, h: 16 },
                reference,
                host.fromRight,
                host.fromBottom,
            ),
        });
    }
    if (orbs > 0) mechanics.push('orbs');

    const last = steps[steps.length - 1]!;
    blocks.push({
        kind: 'goal',
        rect: toAnchor(
            { x: last.x + last.w / 2 - 13, y: last.y - 34, w: 26, h: 34 },
            reference,
            last.fromRight,
            last.fromBottom,
        ),
    });

    const first = steps[0]!;

    return {
        id: `endless-${seed}-${depth}`,
        tier,
        mechanics,
        spawn: toAnchor(
            { x: first.x + 14, y: first.y - PLAYER_H, w: PLAYER_W, h: PLAYER_H },
            reference,
            first.fromRight,
            first.fromBottom,
        ),
        floor,
        blocks,
        reference: { w: reference.w, h: reference.h },
    };
}
