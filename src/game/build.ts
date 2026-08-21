import { MAX_JUMP_RISE, maxRunForRise, PLAYER_H, PLAYER_W } from './constants';
import type {
    Anchor,
    Blink,
    Block,
    Condition,
    Level,
    Mechanic,
    Motion,
    Rect,
    Surface,
    Theme,
    Tier,
    Viewport,
} from './types';

/**
 * LE CONSTRUCTEUR D'ÉNIGMES.
 *
 * Une énigme ne s'écrit pas en coordonnées : elle s'écrit en SAUTS. Chaque
 * palier déclare la hauteur qu'il gagne et l'écart qu'il ouvre, et le
 * constructeur en déduit la géométrie.
 *
 * Il refuse à l'écriture tout saut hors de portée — la portée horizontale
 * étant dérivée de la hauteur à franchir, puisque monter et avancer se
 * disputent le même temps de vol. Une énigme impossible ne compile donc pas,
 * bien avant que le vérificateur ne la rejoue.
 *
 * ⚠️ La levée d'exception est VOLONTAIRE : elle casse `npm run build`. Une
 * énigme impossible qui se contenterait d'un avertissement finirait en ligne.
 */

const PLATFORM_H = 14;

export type Edge = 'left' | 'right';
export type VEdge = 'top' | 'bottom';

export type StepSpec = {
    /** Hauteur gagnée sur le palier précédent. Négatif : on descend. */
    rise?: number;
    /** Écart entre le bord d'arrivée du palier précédent et le bord de départ
     *  de celui-ci. C'est la distance réellement sautée. */
    gap?: number;
    w?: number;
    /** Repartir dans l'autre sens. Un serpentin s'écrit avec un `turn` par
     *  demi-tour, et rien d'autre. */
    turn?: boolean;
    /** Bord horizontal d'ancrage. `right` fait venir le palier vers le joueur
     *  quand la fenêtre rétrécit — c'est ce qui rend le niveau sensible à la
     *  largeur. */
    edge?: Edge;
    /** Bord vertical d'ancrage. */
    vedge?: VEdge;
    motion?: Motion;
    /** Le palier n'existe que dans ce thème. */
    theme?: Theme;
    /** Le palier n'existe qu'à certaines tailles de fenêtre. */
    when?: Condition;
    /** Pose une orbe au-dessus du centre du palier. */
    orb?: boolean;
    /** La matière du palier : glace, ressort ou tapis roulant. */
    surface?: Surface;
    /** Vitesse du tapis, signée. Sans effet sur les autres matières. */
    speed?: number;
    /** Le palier clignote. */
    blink?: Blink;
    /** Le palier cède peu après qu'on s'y pose. */
    crumble?: boolean;
    /**
     * Dispense ce palier du contrôle de portée.
     *
     * ⚠️ À n'employer que lorsqu'on N'Y ARRIVE PAS par un saut ordinaire : un
     * rebond, un tapis ou une rafale de vent portent bien au-delà de ce que le
     * constructeur sait calculer. Le palier n'est alors plus garanti par lui —
     * c'est `npm run levels`, qui rejoue la partie, qui en répond.
     */
    assisted?: boolean;
};

export type LevelSpec = {
    id: string;
    tier: Tier;
    mechanics: readonly Mechanic[];
    reference: Viewport;
    floor?: 'solid' | 'deadly';
    /** Le premier palier. `up` est la distance du bas de la fenêtre à son
     *  DESSUS ; `up: 0` fait démarrer le joueur à même le sol de la fenêtre. */
    start: { x: number; up: number; w?: number; edge?: Edge; vedge?: VEdge };
    steps: readonly StepSpec[];
    /** Le palier qui porte la sortie. Par défaut, le dernier. */
    goalOn?: number;
    /** Une sortie posée à la main, quand aucun palier ne convient — un niveau
     *  qui se termine à même le sol, par exemple. Elle remplace `goalOn`. */
    goal?: Anchor;
    /** Tout ce qui n'est pas sur le chemin : murs, pointes, ponts conditionnels. */
    extras?: readonly Block[];
};

type Placed = Rect & { spec: StepSpec | null };

function anchorOf(rect: Rect, reference: Viewport, edge: Edge, vedge: VEdge): Anchor {
    return {
        ax: edge === 'right' ? 1 : 0,
        ox: edge === 'right' ? rect.x - reference.w : rect.x,
        ay: vedge === 'bottom' ? 1 : 0,
        oy: vedge === 'bottom' ? rect.y - reference.h : rect.y,
        aw: 0,
        ah: 0,
        ow: rect.w,
        oh: rect.h,
    };
}

/** L'amplitude d'un mouvement, dans le pire des cas pour celui qui saute. */
function amplitude(motion: Motion | undefined): { x: number; y: number } {
    if (!motion) return { x: 0, y: 0 };
    return { x: Math.abs(motion.dx), y: Math.abs(motion.dy) };
}

export function buildLevel(spec: LevelSpec): Level {
    const { reference } = spec;
    const floor = spec.floor ?? 'solid';

    const blocks: Block[] = [];
    const placed: Placed[] = [];

    // Le palier de départ. `up: 0` signifie « à même le sol de la fenêtre » :
    // il n'y a alors aucun bloc à poser, le sol suffit.
    const startTop = reference.h - spec.start.up;
    const startWidth = spec.start.w ?? 150;
    const startRect: Rect = { x: spec.start.x, y: startTop, w: startWidth, h: PLATFORM_H };

    if (spec.start.up === 0) {
        if (floor === 'deadly') {
            throw new Error(`${spec.id} : départ à même le sol alors que le sol est mortel`);
        }
        // Palier virtuel : la portion de sol le long de laquelle le joueur
        // prend son élan. Volontairement bornée — la mesurer à toute la
        // largeur ferait démarrer le premier écart au bord droit de l'écran.
        placed.push({ x: spec.start.x, y: reference.h, w: 120, h: 0, spec: null });
    } else {
        placed.push({ ...startRect, spec: null });
        blocks.push({
            kind: 'solid',
            rect: anchorOf(startRect, reference, spec.start.edge ?? 'left', spec.start.vedge ?? 'bottom'),
        });
    }

    let direction: 1 | -1 = 1;

    spec.steps.forEach((step, index) => {
        const previous = placed[placed.length - 1]!;
        if (step.turn) direction = direction === 1 ? -1 : 1;

        const rise = step.rise ?? 0;
        const gap = step.gap ?? 60;
        const width = step.w ?? 120;

        const swing = amplitude(step.motion);
        // Le pire cas : la plateforme est au sommet de sa course quand on
        // arrive, et au bout de sa course horizontale du mauvais côté.
        const effectiveRise = rise + swing.y;
        const effectiveGap = gap + swing.x;

        // Un palier « assisté » n'est pas atteint par un saut : le rebond, le
        // tapis ou le vent qui l'amènent sortent du modèle du constructeur.
        // C'est le vérificateur qui en répond, en rejouant la partie.
        if (!step.assisted && effectiveRise > MAX_JUMP_RISE) {
            throw new Error(
                `${spec.id}, palier ${index + 1} : monte de ${effectiveRise} px, le saut plafonne à ${MAX_JUMP_RISE}`,
            );
        }
        const reach = maxRunForRise(Math.max(0, effectiveRise));
        if (!step.assisted && effectiveGap > reach) {
            throw new Error(
                `${spec.id}, palier ${index + 1} : écart de ${Math.round(effectiveGap)} px pour une montée de ${Math.round(effectiveRise)} px, la portée n'est que de ${Math.round(reach)}`,
            );
        }
        // Sans élan, on n'atteint jamais la vitesse de pointe : un saut long
        // demande de la piste sur le palier de départ.
        if (!step.assisted && effectiveGap > 74 && previous.w < 80) {
            throw new Error(
                `${spec.id}, palier ${index + 1} : ${Math.round(effectiveGap)} px à franchir depuis un palier de ${Math.round(previous.w)} px, sans élan possible`,
            );
        }

        const y = previous.y - rise;
        const x = direction === 1 ? previous.x + previous.w + gap : previous.x - gap - width;

        if (x < 8 || x + width > reference.w - 8) {
            throw new Error(
                `${spec.id}, palier ${index + 1} : sort de la fenêtre de référence (x = ${Math.round(x)}, largeur ${reference.w})`,
            );
        }
        if (y < 30 || y > reference.h - 8) {
            throw new Error(`${spec.id}, palier ${index + 1} : sort de la fenêtre en hauteur (y = ${Math.round(y)})`);
        }

        const rect: Rect = { x, y, w: width, h: PLATFORM_H };
        placed.push({ ...rect, spec: step });

        const block: Block = {
            kind: 'solid',
            rect: anchorOf(rect, reference, step.edge ?? 'left', step.vedge ?? 'bottom'),
        };
        if (step.motion) block.motion = step.motion;
        if (step.theme) block.theme = step.theme;
        if (step.when) block.when = step.when;
        if (step.surface) block.surface = step.surface;
        if (step.speed !== undefined) block.speed = step.speed;
        if (step.blink) block.blink = step.blink;
        if (step.crumble) block.crumble = step.crumble;
        blocks.push(block);

        if (step.orb) {
            blocks.push({
                kind: 'orb',
                rect: anchorOf(
                    { x: x + width / 2 - 8, y: y - 26, w: 16, h: 16 },
                    reference,
                    step.edge ?? 'left',
                    step.vedge ?? 'bottom',
                ),
            });
        }
    });

    if (spec.goal) {
        blocks.push({ kind: 'goal', rect: spec.goal });
    } else {
        const goalIndex = spec.goalOn ?? placed.length - 1;
        const host = placed[goalIndex];
        if (!host) throw new Error(`${spec.id} : goalOn pointe sur un palier inexistant`);
        const hostSpec = host.spec;
        blocks.push({
            kind: 'goal',
            rect: anchorOf(
                { x: host.x + host.w / 2 - 13, y: host.y - 34, w: 26, h: 34 },
                reference,
                hostSpec?.edge ?? spec.start.edge ?? 'left',
                hostSpec?.vedge ?? spec.start.vedge ?? 'bottom',
            ),
            ...(hostSpec?.theme ? { theme: hostSpec.theme } : {}),
            ...(hostSpec?.when ? { when: hostSpec.when } : {}),
            ...(hostSpec?.motion ? { motion: hostSpec.motion } : {}),
        });
    }

    const first = placed[0]!;
    const spawnRect: Rect =
        spec.start.up === 0
            ? { x: spec.start.x, y: reference.h - PLAYER_H, w: PLAYER_W, h: PLAYER_H }
            : { x: first.x + 14, y: first.y - PLAYER_H, w: PLAYER_W, h: PLAYER_H };

    return {
        id: spec.id,
        tier: spec.tier,
        mechanics: spec.mechanics,
        spawn: anchorOf(spawnRect, reference, spec.start.edge ?? 'left', spec.start.vedge ?? 'bottom'),
        floor,
        blocks: [...blocks, ...(spec.extras ?? [])],
        reference,
    };
}
