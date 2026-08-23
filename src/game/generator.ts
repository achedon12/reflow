import { anchorOf } from './build';
import { MAX_CRUMBLE, maxRunForRise, PLAYER_H, PLAYER_W } from './constants';
import { overlaps, rotateRect, unrotateRect } from './geometry';
import { makeRng } from './rng';
import type { Anchor, Block, Level, Mechanic, Rect, Surface, Tier, Viewport } from './types';

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

/**
 * LES MATIÈRES, ET CE QU'ELLES COÛTENT AU CHEMIN.
 *
 * Une partie engendrée n'avait que des plateformes nues et quelques mobiles :
 * elle était le jeu en plus pauvre que les cent énigmes écrites à la main, ce
 * qui est l'inverse de ce qu'on promet en disant « des parties à l'infini ».
 *
 * Chaque matière est posée sous condition, parce que chacune peut rendre un
 * niveau infaisable pour une raison différente :
 *
 * - la GLACE fait glisser à l'atterrissage : il faut de la piste pour se
 *   rattraper, d'où une largeur minimale ;
 * - le TAPIS pousse en continu : même exigence, et une vitesse modérée ;
 * - le PALIER FRIABLE cède sous les pieds : il se traverse, donc jamais deux de
 *   suite, ni au départ, ni sous la sortie ;
 * - le CLIGNOTANT disparaît : même règle, plus un rapport d'allumage majoritaire
 *   pour qu'il soit là plus souvent qu'absent ;
 * - le REBOND renvoie plus haut qu'on n'est tombé : réservé aux montées, jamais
 *   sous la sortie, où l'on repartirait aussitôt.
 *
 * ⚠️ Aucune de ces règles ne PROUVE quoi que ce soit. C'est `npm run endless`
 * qui prouve, en rejouant des centaines de graines.
 */
const SLIPPERY_MIN_W = 92;
const BELT_MIN_W = 100;
const BELT_SPEED = 108;

/**
 * LE COUDE : la partie change de sol en cours de route.
 *
 * Le serpentin s'arrête sur un palier CARRÉ, et la fin du chemin ne s'écrit
 * plus dans le repère du monde mais dans celui du premier quart de tour. Vus
 * d'aplomb, ces deux derniers paliers sont des PILIERS de quatorze pixels de
 * large : on n'y tient pas. Ils ne redeviennent un sol qu'une fois l'écran
 * couché.
 *
 * C'est ce qui manquait aux parties infinies. Douze énigmes écrites à la main
 * le demandent ; les parties engendrées, elles, se jouaient d'un bout à l'autre
 * sans jamais toucher à la gravité, alors que c'est la mécanique du jeu.
 *
 * ⚠️ Rien ici n'est garanti par construction, contrairement au serpentin :
 * chaque pièce est essayée puis VÉRIFIÉE sans collision, et le coude est
 * abandonné pour cette graine s'il ne tombe pas juste. Une partie sans coude
 * reste une partie ; une partie coincée, non.
 */
const PIVOT_SIDE = 56;
/** Le pivot doit rester assez BAS dans le monde : couché, sa cote verticale
 *  devient l'abscisse du tronçon suivant, qui a besoin de place à sa gauche. */
const PIVOT_MIN_Y = 250;
const CATCH_DROP = 90;
const CATCH_LIP = 4;

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
    /** Ce palier ouvre-t-il une NOUVELLE rangée ? Le serpentin y monte et
     *  repart dans l'autre sens : celui d'avant est donc un palier où l'on
     *  s'arrête, où l'on fait demi-tour, et où rien ne doit se dérober. */
    turn?: boolean;
    surface?: Surface;
    speed?: number;
    crumble?: boolean;
    blink?: { period: number; duty: number };
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

        let turns = false;
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
            turns = true;
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
            turn: turns,
            fromRight: rng.chance(0.45),
            fromBottom: rng.chance(0.4),
        });
        if (moving) placed += 1;
    }

    // ── Le coude ────────────────────────────────────────────────────────────
    // Décidé AVANT les matières et l'émission : il raccourcit le serpentin et
    // change le dernier palier en carré. Le faire après aurait laissé derrière
    // lui les plateformes qu'il retire.
    const elbow = bend(rng, steps, reference, tier, depth);

    // ── Les matières ────────────────────────────────────────────────────────
    // Ni le premier palier (on y apparaît) ni le dernier (il porte la sortie) :
    // les deux doivent rester fermes. Ni deux paliers qui se dérobent de suite,
    // sinon la traversée tient du réflexe et non de la lecture.
    let brittle = 0;
    let previousWasTrap = false;
    for (let i = 1; i < steps.length - 1; i += 1) {
        const step = steps[i]!;
        if (step.moving) continue;

        // ⚠️ LA RÈGLE QUI MANQUAIT. Une matière ne se pose que sur un palier
        // qu'on TRAVERSE d'un trait. Sur celui d'où part un demi-tour, il faut
        // s'arrêter, se retourner et sauter : la glace vous emporte, le rebond
        // vous relance, le palier friable cède avant que vous ayez pivoté.
        // Deux graines sur cent quatre-vingt-douze l'ont prouvé — c'est
        // exactement ce que ce contrôle est là pour trouver.
        if (steps[i + 1]?.turn) {
            previousWasTrap = false;
            continue;
        }

        const trap =
            tier === 'hard' &&
            !previousWasTrap &&
            !steps[i + 1]?.moving &&
            rng.chance(0.45);

        if (trap && brittle < MAX_CRUMBLE && rng.chance(0.6)) {
            step.crumble = true;
            brittle += 1;
            previousWasTrap = true;
            continue;
        }
        if (trap) {
            step.blink = { period: rng.range(2.2, 3.2), duty: rng.range(0.62, 0.72) };
            previousWasTrap = true;
            continue;
        }
        previousWasTrap = false;

        // Le troisième palier de la série goûte à la glace : les deux premiers
        // apprennent à sauter, celui-ci annonce que le sol ne tiendra pas
        // toujours parole.
        if (tier === 'easy') {
            if (depth === 3 && step.w >= SLIPPERY_MIN_W && rng.chance(0.5)) step.surface = 'ice';
            continue;
        }

        // Le rebond ne se pose que sous une MONTÉE : il renvoie plus haut qu'on
        // n'est tombé, ce qui aide à franchir la rangée suivante et n'expédie
        // personne dans le vide.
        const climbs = (steps[i + 1]?.y ?? step.y) < step.y - 20;
        if (tier === 'hard' && climbs && step.w >= SLIPPERY_MIN_W && rng.chance(0.3)) {
            step.surface = 'bouncy';
            continue;
        }
        if (step.w >= BELT_MIN_W && rng.chance(0.42)) {
            step.surface = 'conveyor';
            step.speed = rng.chance(0.5) ? BELT_SPEED : -BELT_SPEED;
            continue;
        }
        if (step.w >= SLIPPERY_MIN_W && rng.chance(0.55)) {
            step.surface = 'ice';
        }
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
        if (stepRect.surface) block.surface = stepRect.surface;
        if (stepRect.speed !== undefined) block.speed = stepRect.speed;
        if (stepRect.crumble) block.crumble = true;
        if (stepRect.blink) block.blink = stepRect.blink;
        blocks.push(block);
    });

    // Les mécaniques déclarées servent aux indices et au vérificateur : elles
    // doivent décrire le niveau REELLEMENT produit, pas celui qu'on espérait.
    if (steps.some((step) => step.moving)) mechanics.push('motion');
    if (steps.some((step) => step.surface === 'ice')) mechanics.push('ice');
    if (steps.some((step) => step.surface === 'conveyor')) mechanics.push('conveyor');
    if (steps.some((step) => step.surface === 'bouncy')) mechanics.push('bounce');
    if (steps.some((step) => step.crumble)) mechanics.push('crumble');
    if (steps.some((step) => step.blink)) mechanics.push('blink');

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

    if (elbow) {
        mechanics.push('gravity');
        blocks.push(...elbow);
    } else {
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
    }

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

/**
 * Tente de terminer la partie par un quart de tour.
 *
 * Rend les blocs du tronçon couché — rattrapage, palier final et sortie — ou
 * `null` si la place manque : le serpentin garde alors sa sortie ordinaire.
 *
 * @param steps modifié sur place : le dernier palier devient le PIVOT, et ceux
 *              qui montaient au-dessus sont retirés.
 */
function bend(
    rng: ReturnType<typeof makeRng>,
    steps: Step[],
    reference: Viewport,
    tier: Tier,
    depth: number,
): Block[] | null {
    if (tier !== 'hard' || depth < 12 || !rng.chance(0.55)) return null;

    // Le pivot se prend assez bas pour que le tronçon couché ait de la place,
    // et assez loin dans la série pour que la partie ait eu lieu avant lui.
    const index = steps.findLastIndex((step, i) => i >= 3 && step.y >= PIVOT_MIN_Y && !step.moving);
    if (index === -1) return null;

    const host = steps[index]!;
    const pivot: Rect = { x: host.x, y: host.y, w: PIVOT_SIDE, h: PIVOT_SIDE };
    // Le pivot pend sous son propre dessus : il ne doit rencontrer personne.
    if (steps.some((step, i) => i !== index && overlaps(pivot, step))) return null;

    const frame = { w: reference.h, h: reference.w };
    const laid = rotateRect(pivot, reference, 1);

    const catchW = 120;
    const grab: Rect = { x: laid.x - catchW - CATCH_LIP, y: laid.y + CATCH_DROP, w: catchW, h: PLATFORM_H };
    const endW = rng.range(110, 140);
    const end: Rect = { x: grab.x - rng.range(44, 60) - endW, y: grab.y - rng.range(46, 58), w: endW, h: PLATFORM_H };
    const exit: Rect = { x: end.x + end.w / 2 - 13, y: end.y - 34, w: 26, h: 34 };

    const inside = (rect: Rect) =>
        rect.x >= 8 && rect.x + rect.w <= frame.w - 8 && rect.y >= 30 && rect.y + rect.h <= frame.h - 8;
    if (![grab, end, exit].every(inside)) return null;

    // Couchés, ces trois blocs sont des PILIERS dans le monde : ils ne doivent
    // traverser aucune plateforme du serpentin, sans quoi le chemin d'aplomb se
    // retrouve barré par un mur qu'on n'a pas voulu.
    const world = [grab, end, exit].map((rect) => unrotateRect(rect, reference, 1));
    if (world.some((rect) => steps.some((step) => overlaps(rect, step)))) return null;

    steps.length = index + 1;
    host.w = PIVOT_SIDE;
    host.h = PIVOT_SIDE;

    return [
        { kind: 'solid', rect: anchorOf(grab, reference, 'left', 'bottom', 1) },
        { kind: 'solid', rect: anchorOf(end, reference, 'left', 'bottom', 1) },
        { kind: 'goal', rect: anchorOf(exit, reference, 'left', 'bottom', 1) },
    ];
}
