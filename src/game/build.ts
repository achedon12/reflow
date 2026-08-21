import { MAX_JUMP_RISE, maxRunForRise, PLAYER_H, PLAYER_W } from './constants';
import { playViewport, rotateRect, unrotateRect } from './geometry';
import type {
    Anchor,
    Blink,
    Block,
    Condition,
    Level,
    Mechanic,
    Motion,
    Quarter,
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

/** Côté d'un palier pivot. Assez large pour recevoir un saut, assez petit pour
 *  ne pas boucher le niveau une fois couché. */
const PIVOT_SIDE = 70;

/**
 * LE RATTRAPAGE, en pixels.
 *
 * Au moment du quart de tour, le joueur est debout SUR le pivot ; l'instant
 * d'après, la gravité tire de côté et il longe sa paroi. `CATCH_DROP` est la
 * chute qu'on lui laisse avant de le rattraper, `CATCH_LIP` le jeu latéral qui
 * garantit que la plateforme de rattrapage passe sous lui sans le heurter.
 */
const CATCH_DROP = 90;
const CATCH_LIP = 4;

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
    /**
     * Fait de ce palier un PIVOT : un bloc carré, praticable dans les quatre
     * orientations.
     *
     * ⚠️ Un palier ordinaire fait 150 × 14. Pivoté d'un quart de tour il
     * devient un pilier de 14 × 150, sur lequel on ne tient plus. Un segment
     * qui change d'orientation doit donc se raccorder sur un carré — sans quoi
     * le joueur bascule dans le vide au moment même où il pivote.
     */
    pivot?: boolean;
    /**
     * LE RATTRAPAGE : le palier qui reçoit le joueur après un quart de tour.
     *
     * Il n'est pas atteint par un saut — le joueur TOMBE dessus, parce que la
     * gravité vient de changer de côté pendant qu'il était sur le pivot. Sa
     * position ne se déclare donc pas : le constructeur la déduit du pivot et
     * du sens de rotation. `rise` et `gap` sont ignorés, seule `w` compte.
     */
    catch?: boolean;
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
    steps?: readonly StepSpec[];
    /** Le palier qui porte la sortie. Par défaut, le dernier. */
    goalOn?: number;
    /** Une sortie posée à la main, quand aucun palier ne convient — un niveau
     *  qui se termine à même le sol, par exemple. Elle remplace `goalOn`. */
    goal?: Anchor;
    /** Tout ce qui n'est pas sur le chemin : murs, pointes, ponts conditionnels. */
    extras?: readonly Block[];
    /**
     * L'ORIENTATION POUR LAQUELLE LE CHEMIN EST ÉCRIT.
     *
     * Par défaut 0 : la gravité tombe, et l'énigme se lit comme n'importe
     * quelle autre. Avec 1, 2 ou 3, le chemin est bâti dans le repère
     * correspondant puis reporté dans le monde — il ne devient donc praticable
     * qu'une fois l'écran pivoté d'autant.
     *
     * ⚠️ Ce n'est PAS un habillage : à l'orientation de départ, un chemin écrit
     * pour un quart de tour pend du plafond ou colle à un mur. C'est ce qui
     * permet d'écrire une énigme qu'aucun réglage de taille ne résout.
     */
    designedFor?: Quarter;
    /**
     * LES TRONÇONS, chacun dans SON orientation.
     *
     * C'est ce qui fait de la gravité une mécanique et non une prise de
     * conscience. Avec `designedFor` seul, on pivote une fois au départ puis on
     * joue un niveau ordinaire ; avec des tronçons, une partie du chemin
     * n'existe que couchée, la suite que retournée, et il faut pivoter EN COURS
     * de traversée pour atteindre ce qu'aucune orientation ne donne seule.
     *
     * ⚠️ Le DERNIER tronçon décide si l'énigme résiste. Dans un repère tourné,
     * « monter » ne monte pas dans le monde : au premier quart, la montée part
     * vers la droite, au deuxième elle DESCEND, au troisième elle part vers la
     * gauche. Ce qui éloigne du sol d'origine, c'est le déplacement latéral du
     * tronçon — vers la gauche au premier quart, vers la droite au troisième.
     * Un tronçon final qui redescend pose sa sortie à portée de marche, et
     * l'énigme se termine sans jamais pivoter. `npm run levels` le refuse.
     *
     * ⚠️ Le raccord entre deux tronçons doit être un palier PIVOT — un carré.
     * Un palier ordinaire de 150 × 14 devient un pilier de 14 × 150 une fois
     * couché, et le joueur bascule à l'instant même où il pivote. Le
     * constructeur l'impose.
     */
    segments?: readonly Segment[];
};

export type Segment = {
    designedFor: Quarter;
    steps: readonly StepSpec[];
};

/**
 * Le bord du MONDE qui correspond à un bord du repère de conception.
 *
 * Écrit en toutes lettres plutôt que dérivé : une erreur de correspondance ne
 * se verrait qu'en jouant, et seulement à une orientation sur quatre.
 */
const WORLD_EDGE: Record<Quarter, { left: Edge | VEdge; right: Edge | VEdge; top: Edge | VEdge; bottom: Edge | VEdge }> = {
    0: { left: 'left', right: 'right', top: 'top', bottom: 'bottom' },
    1: { left: 'top', right: 'bottom', top: 'right', bottom: 'left' },
    2: { left: 'right', right: 'left', top: 'bottom', bottom: 'top' },
    3: { left: 'bottom', right: 'top', top: 'left', bottom: 'right' },
};

type Placed = Rect & { spec: StepSpec | null };

function anchorOf(
    rect: Rect,
    reference: Viewport,
    edge: Edge,
    vedge: VEdge,
    design: Quarter = 0,
): Anchor {
    if (design !== 0) {
        // Du repère de conception vers le monde : le rectangle ET les bords
        // auxquels il s'accroche pivotent ensemble.
        const world = unrotateRect(rect, reference, design);
        const table = WORLD_EDGE[design];
        const mappedX = table[edge] as Edge | VEdge;
        const mappedY = table[vedge] as Edge | VEdge;
        const horizontal = (mappedX === 'left' || mappedX === 'right' ? mappedX : mappedY) as Edge;
        const vertical = (mappedX === 'top' || mappedX === 'bottom' ? mappedX : mappedY) as VEdge;
        return anchorOf(world, reference, horizontal, vertical, 0);
    }
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
    // Le repère du DÉPART — celui du premier tronçon quand l'énigme en a.
    const design = spec.segments?.[0]?.designedFor ?? spec.designedFor ?? 0;
    // Le chemin s'écrit dans le repère où la gravité tombe — donc dans la vue
    // TOURNÉE quand l'énigme est conçue pour une autre orientation.
    const frame = playViewport(reference, design);

    const blocks: Block[] = [];
    const placed: Placed[] = [];

    // Le palier de départ. `up: 0` signifie « à même le sol de la fenêtre » :
    // il n'y a alors aucun bloc à poser, le sol suffit.
    const startTop = frame.h - spec.start.up;
    const startWidth = spec.start.w ?? 150;
    const startRect: Rect = { x: spec.start.x, y: startTop, w: startWidth, h: PLATFORM_H };

    if (spec.start.up === 0) {
        if (floor === 'deadly') {
            throw new Error(`${spec.id} : départ à même le sol alors que le sol est mortel`);
        }
        // Palier virtuel : la portion de sol le long de laquelle le joueur
        // prend son élan. Volontairement bornée — la mesurer à toute la
        // largeur ferait démarrer le premier écart au bord droit de l'écran.
        placed.push({ x: spec.start.x, y: frame.h, w: 120, h: 0, spec: null });
    } else {
        placed.push({ ...startRect, spec: null });
        blocks.push({
            kind: 'solid',
            rect: anchorOf(startRect, reference, spec.start.edge ?? 'left', spec.start.vedge ?? 'bottom', design),
        });
    }

    /**
     * Pose une suite de paliers dans un repère donné.
     *
     * Extraite pour être appelée une fois par tronçon : chacun se construit
     * dans SON orientation, et se raccorde au précédent par un palier pivot
     * reporté d'un repère à l'autre.
     */
    function lay(steps: readonly StepSpec[], segmentDesign: Quarter, label: string, entry: 0 | 1 | 3 = 0) {
        const segmentFrame = playViewport(reference, segmentDesign);
        let direction: 1 | -1 = 1;

        steps.forEach((step, index) => {
            const previous = placed[placed.length - 1]!;
            if (step.turn) direction = direction === 1 ? -1 : 1;

            const rise = step.rise ?? 0;
            const gap = step.gap ?? 60;
            const width = step.w ?? 120;

            if (step.catch) {
                if (index !== 0 || entry === 0) {
                    throw new Error(
                        `${spec.id}${label}, palier ${index + 1} : \`catch\` n'a de sens qu'au PREMIER palier d'un tronçon qui suit un quart de tour`,
                    );
                }
                if (width < 60) {
                    throw new Error(
                        `${spec.id}${label} : un palier de rattrapage de ${width} px ne couvre pas le joueur qui longe le pivot`,
                    );
                }
                // Un quart de tour dans le sens direct fait basculer le joueur du
                // côté GAUCHE du pivot, l'autre sens du côté droit.
                const cx = entry === 1 ? previous.x - width - CATCH_LIP : previous.x + previous.w + CATCH_LIP;
                const cy = previous.y + CATCH_DROP;
                if (cx < 8 || cx + width > segmentFrame.w - 8 || cy > segmentFrame.h - 8) {
                    throw new Error(
                        `${spec.id}${label} : le rattrapage tombe hors de la fenêtre (x = ${Math.round(cx)}, y = ${Math.round(cy)}, fenêtre ${segmentFrame.w}×${segmentFrame.h})`,
                    );
                }
                direction = entry === 1 ? -1 : 1;
                emit(step, { x: cx, y: cy, w: width, h: PLATFORM_H }, width, segmentDesign);
                return;
            }

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
                    `${spec.id}${label}, palier ${index + 1} : monte de ${effectiveRise} px, le saut plafonne à ${MAX_JUMP_RISE}`,
                );
            }
            const reach = maxRunForRise(Math.max(0, effectiveRise));
            if (!step.assisted && effectiveGap > reach) {
                throw new Error(
                    `${spec.id}${label}, palier ${index + 1} : écart de ${Math.round(effectiveGap)} px pour une montée de ${Math.round(effectiveRise)} px, la portée n'est que de ${Math.round(reach)}`,
                );
            }
            // Sans élan, on n'atteint jamais la vitesse de pointe : un saut long
            // demande de la piste sur le palier de départ.
            if (!step.assisted && effectiveGap > 74 && previous.w < 80) {
                throw new Error(
                    `${spec.id}${label}, palier ${index + 1} : ${Math.round(effectiveGap)} px à franchir depuis un palier de ${Math.round(previous.w)} px, sans élan possible`,
                );
            }

            const y = previous.y - rise;
            // Un pivot est carré : c'est SA largeur, pas celle déclarée, qui doit
            // tenir dans la fenêtre.
            const laid = step.pivot ? PIVOT_SIDE : width;
            const x = direction === 1 ? previous.x + previous.w + gap : previous.x - gap - laid;

            if (x < 8 || x + laid > segmentFrame.w - 8) {
                throw new Error(
                    `${spec.id}${label}, palier ${index + 1} : sort de la fenêtre de référence (x = ${Math.round(x)}, largeur ${segmentFrame.w})`,
                );
            }
            if (y < 30 || y > segmentFrame.h - 8) {
                throw new Error(`${spec.id}${label}, palier ${index + 1} : sort de la fenêtre en hauteur (y = ${Math.round(y)})`);
            }

            emit(
                step,
                { x, y, w: step.pivot ? PIVOT_SIDE : width, h: step.pivot ? PIVOT_SIDE : PLATFORM_H },
                width,
                segmentDesign,
            );
        });
    }

    /** Pose un palier et ce qu'il porte. Partagée par le cas ordinaire et par
     *  le rattrapage, qui calculent leur rectangle autrement. */
    function emit(step: StepSpec, rect: Rect, width: number, segmentDesign: Quarter) {
        placed.push({ ...rect, spec: step });
        const x = rect.x;
        const y = rect.y;

        const block: Block = {
            kind: 'solid',
            rect: anchorOf(rect, reference, step.edge ?? 'left', step.vedge ?? 'bottom', segmentDesign),
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
                    segmentDesign,
                ),
            });
        }
    }

    const segments: Segment[] = spec.segments
        ? [...spec.segments]
        : [{ designedFor: design, steps: spec.steps ?? [] }];

    segments.forEach((segment, order) => {
        let entry: 0 | 1 | 3 = 0;
        if (order > 0) {
            const delta = (4 + segment.designedFor - segments[order - 1]!.designedFor) % 4;
            // Un demi-tour laisserait le joueur sous le pivot, chutant dans le
            // vide qu'il vient de traverser : il n'y a rien à quoi le
            // rattraper. Deux quarts de tour, oui — c'est un tronçon de plus.
            if (delta !== 1 && delta !== 3) {
                throw new Error(
                    `${spec.id} : le tronçon ${order + 1} tourne de ${delta} quart(s) d'un coup — seuls les quarts de tour simples se raccordent`,
                );
            }
            entry = delta;
            // Le raccord : le dernier palier du tronçon précédent, reporté dans
            // le repère du suivant.
            const previous = placed[placed.length - 1]!;
            if (previous.w !== PIVOT_SIDE || previous.h !== PIVOT_SIDE) {
                throw new Error(
                    `${spec.id} : le tronçon ${order + 1} se raccorde sur un palier de ${Math.round(previous.w)} × ${Math.round(previous.h)} — il faut un pivot carré, sinon le joueur tombe en pivotant`,
                );
            }
            const world = unrotateRect(previous, reference, segments[order - 1]!.designedFor);
            const moved = rotateRect(world, reference, segment.designedFor);
            placed.push({ ...moved, spec: previous.spec });
        }
        lay(segment.steps, segment.designedFor, segments.length > 1 ? ` tronçon ${order + 1}` : '', entry);
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
                segments[segments.length - 1]!.designedFor,
            ),
            ...(hostSpec?.theme ? { theme: hostSpec.theme } : {}),
            ...(hostSpec?.when ? { when: hostSpec.when } : {}),
            ...(hostSpec?.motion ? { motion: hostSpec.motion } : {}),
        });
    }

    const first = placed[0]!;
    const spawnRect: Rect =
        spec.start.up === 0
            ? { x: spec.start.x, y: frame.h - PLAYER_H, w: PLAYER_W, h: PLAYER_H }
            : { x: first.x + 14, y: first.y - PLAYER_H, w: PLAYER_W, h: PLAYER_H };

    return {
        id: spec.id,
        tier: spec.tier,
        mechanics: spec.mechanics,
        spawn: anchorOf(spawnRect, reference, spec.start.edge ?? 'left', spec.start.vedge ?? 'bottom', design),
        floor,
        blocks: [...blocks, ...(spec.extras ?? [])],
        reference,
    };
}
