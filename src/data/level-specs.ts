// Imports RELATIFS et non `@/` : ce module est lu par `scripts/check-levels.mts`
// et par le générateur de redirections nginx, qui tournent dans Node sans la
// résolution d'alias de Next.
import type { LevelSpec } from '../game/build';
import { anchored } from '../game/geometry';
import type { Anchor, Block, Condition, Theme } from '../game/types';

/**
 * LES ÉNIGMES ÉCRITES À LA MAIN.
 *
 * Elles ne se lisent pas en coordonnées mais en SAUTS : chaque palier déclare
 * la hauteur qu'il gagne (`rise`) et l'écart qu'il ouvre (`gap`). Le
 * constructeur en déduit la géométrie et REFUSE tout saut hors de portée — une
 * énigme impossible ne compile pas.
 *
 * Ce qui fait le jeu est ailleurs : `edge` et `vedge` disent à quel bord de la
 * fenêtre chaque palier est accroché. Un chemin dont les paliers alternent
 * entre le bord gauche et le bord droit se déforme entièrement quand on tire
 * sur un coin.
 *
 * ⚠️ `npm run levels` rejoue ensuite le moteur physique sur chacune et refuse
 * la construction si l'une n'est pas finissable.
 *
 * ⚠️ `id` est un segment d'URL public et définitif : ASCII, sans accent, et il
 * doit exister dans `puzzles` des QUATRE dictionnaires.
 */

const REF = { w: 1000, h: 560 };

// ── Décor posé à la main, hors du chemin vérifié ────────────────────────────

/** Une bande de pointes sur le sol de la fenêtre. */
const floorSpikes = (x: number, w: number): Block => ({
    kind: 'spike',
    rect: anchored(0, x, 1, -16, w, 16),
});

/** Idem, mais mesurée depuis le bord droit. */
const floorSpikesR = (right: number, w: number): Block => ({
    kind: 'spike',
    rect: anchored(1, -right, 1, -16, w, 16),
});

/**
 * Une lame suspendue au-dessus d'un palier, qui descend le traverser.
 *
 * ⚠️ `up` est la hauteur du palier QU'ELLE MENACE, mesurée depuis le bas de la
 * fenêtre — et la lame est ancrée au bas comme lui.
 *
 * La version précédente l'accrochait au HAUT de la fenêtre, avec une simple
 * course en pixels. Comme tous les paliers pendent du bas, les deux ne se
 * rencontraient jamais : à la cote de référence, les lames de « La guillotine »
 * s'arrêtaient 200 px au-dessus de la tête du joueur, et s'en éloignaient
 * encore dès qu'on agrandissait la fenêtre. Cinq énigmes ont vécu avec des
 * lames purement décoratives.
 *
 * Le vérificateur ne pouvait rien y voir : il prouve qu'un niveau se TERMINE,
 * jamais qu'il résiste. Un piège inoffensif rend le niveau plus facile, donc
 * il passe.
 *
 * Au repos la lame laisse 40 px au-dessus de la tête ; au bas de sa course elle
 * descend 40 px SOUS le dessus du palier, donc à travers le joueur.
 */
const blade = (x: number, up: number, period = 2.2, phase = 0): Block => ({
    kind: 'spike',
    rect: anchored(0, x, 1, -(up + 220), 22, 150),
    motion: { dx: 0, dy: 110, period, phase },
});

/** Un mur posé sur le sol, ancré à un bord. */
const wall = (edge: 'left' | 'right', offset: number, height: number, extra: Partial<Block> = {}): Block => ({
    kind: 'solid',
    rect: edge === 'left' ? anchored(0, offset, 1, -height, 26, height) : anchored(1, -offset, 1, -height, 26, height),
    ...extra,
});

/** Une plateforme posée à la main, sans passer par le chemin vérifié. */
const slab = (
    rect: Anchor,
    extra: { theme?: Theme; when?: Condition; motion?: Block['motion'] } = {},
): Block => ({ kind: 'solid', rect, ...extra });

/** Une zone de vent. `force` est signée : positive vers la droite. */
const windZone = (x: number, up: number, w: number, h: number, force: number): Block => ({
    kind: 'wind',
    rect: anchored(0, x, 1, -up, w, h),
    force,
});

/**
 * La lame suspendue qui se cale sur le joueur, et retombe à intervalle fixe.
 *
 * ⚠️ Même correction que `blade` : elle pendait du HAUT de la fenêtre et
 * s'arrêtait deux cents pixels au-dessus de la tête du joueur. `up` est
 * désormais la hauteur du palier le plus BAS qu'elle doit menacer, mesurée
 * depuis le bas de la fenêtre — et sa course de 420 px lui permet de balayer
 * plusieurs paliers d'un même niveau.
 */
const stalker = (up: number, period: number, phase = 0): Block => ({
    kind: 'spike',
    rect: anchored(0, 0, 1, -(up + 260), 24, 180),
    chase: true,
    motion: { dx: 0, dy: 120, period, phase },
});

export const SPECS: readonly LevelSpec[] = [
    // ══ FACILES ═════════════════════════════════════════════════════════════
    {
        // Rien à sauter. Le seul enseignement : la sortie est accrochée au bord
        // DROIT, et elle se déplace avec lui.
        id: 'seuil',
        tier: 'easy',
        mechanics: ['edge'],
        reference: REF,
        start: { x: 70, up: 0 },
        steps: [],
        goal: anchored(1, -110, 1, -34, 26, 34),
    },
    {
        id: 'marche',
        tier: 'easy',
        mechanics: ['resize'],
        reference: REF,
        start: { x: 80, up: 0 },
        steps: [{ rise: 64, gap: 90, w: 180 }],
    },
    {
        id: 'enjambee',
        tier: 'easy',
        mechanics: ['resize'],
        reference: REF,
        start: { x: 70, up: 0 },
        steps: [],
        // Deux bandes de pointes à même le sol : rien à escalader, seulement
        // deux élans à prendre.
        goal: anchored(1, -110, 1, -34, 26, 34),
        extras: [floorSpikes(260, 100), floorSpikes(520, 96)],
    },
    {
        id: 'corniche',
        tier: 'easy',
        mechanics: ['resize', 'ice'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 72, w: 130, vedge: 'top', surface: 'ice' },
            { rise: 62, gap: 72, w: 130, edge: 'right', when: { minW: 960 } },
            { rise: 62, gap: 72, w: 130, edge: 'right' },
        ],
    },
    {
        id: 'descente',
        tier: 'easy',
        mechanics: ['resize', 'ice'],
        reference: REF,
        start: { x: 60, up: 300, w: 170 },
        steps: [
            { rise: -70, gap: 96, w: 140, vedge: 'top', surface: 'ice' },
            { rise: -70, gap: 96, w: 140, edge: 'right', when: { maxW: 860 } },
            { rise: -70, gap: 96, w: 150, edge: 'right' },
        ],
        extras: [floorSpikes(300, 220)],
    },
    {
        // Le palier d'arrivée est accroché à DROITE, celui de départ à gauche :
        // l'écart entre les deux vaut la largeur de la fenêtre moins une
        // constante. Il n'existe qu'une façon de le réduire.
        id: 'bordure',
        tier: 'easy',
        mechanics: ['edge', 'ice'],
        reference: { w: 820, h: 560 },
        start: { x: 90, up: 0 },
        steps: [
            { rise: 56, gap: 88, w: 170, surface: 'ice' },
            { rise: 40, gap: 96, w: 190, edge: 'right', when: { maxW: 860 } },
        ],
        extras: [floorSpikes(320, 260)],
    },
    {
        // Tout le chemin pend du HAUT de la fenêtre. Plus elle est haute, plus
        // il s'éloigne du sol.
        id: 'suspendu',
        tier: 'easy',
        mechanics: ['edge', 'gravity', 'ice'],
        reference: { w: 1000, h: 470 },
        designedFor: 2,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 70, gap: 62, w: 170, vedge: 'top', surface: 'ice' },
            { rise: 66, gap: 62, w: 170, vedge: 'top', edge: 'right', when: { minW: 960 } },
            { rise: 66, gap: 62, w: 170, vedge: 'top', edge: 'right' },
        ],
        extras: [floorSpikes(250, 600)],
    },
    {
        // Le pont du milieu n'existe qu'en dessous de 880 px de large. Rien ne
        // l'annonce : on le découvre en tirant sur le bord.
        id: 'lucarne',
        tier: 'easy',
        mechanics: ['appear', 'ice'],
        reference: { w: 820, h: 560 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 70, gap: 76, w: 140, vedge: 'top', surface: 'ice' },
            { rise: 0, gap: 76, w: 130, when: { maxW: 880 }, edge: 'right' },
            { rise: 0, gap: 76, w: 130, edge: 'right' },
        ],
        extras: [floorSpikes(300, 320)],
    },
    {
        id: 'balancier',
        tier: 'easy',
        mechanics: ['motion', 'ice'],
        reference: REF,
        start: { x: 70, up: 0 },
        steps: [
            { rise: 62, gap: 74, w: 140, vedge: 'top', surface: 'ice' },
            { rise: 30, gap: 62, w: 120, motion: { dx: 0, dy: 30, period: 3.4 }, edge: 'right', when: { minW: 960 } },
            { rise: 30, gap: 70, w: 150, edge: 'right' },
        ],
        extras: [floorSpikes(280, 300)],
    },
    {
        id: 'navette',
        tier: 'easy',
        mechanics: ['motion', 'ice'],
        reference: REF,
        start: { x: 70, up: 0 },
        steps: [
            { rise: 58, gap: 76, w: 140, vedge: 'top', surface: 'ice' },
            { rise: 20, gap: 58, w: 110, motion: { dx: 34, dy: 0, period: 3.6 }, edge: 'right', when: { minW: 960 } },
            { rise: 20, gap: 64, w: 150, edge: 'right' },
        ],
        extras: [floorSpikes(300, 320)],
    },
    {
        // Le chemin n'existe qu'en thème CLAIR. Le bouton du pied de page vient
        // de changer de métier.
        id: 'clairiere',
        tier: 'easy',
        mechanics: ['theme', 'ice'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 64, gap: 78, w: 140, theme: 'light', vedge: 'top', surface: 'ice' },
            { rise: 58, gap: 82, w: 140, theme: 'light', edge: 'right', when: { minW: 960 } },
            { rise: 58, gap: 82, w: 150, theme: 'light', edge: 'right' },
        ],
        extras: [floorSpikes(230, 620)],
    },
    {
        id: 'nocturne',
        tier: 'easy',
        mechanics: ['theme', 'ice'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 64, gap: 78, w: 150, theme: 'dark', vedge: 'top', surface: 'ice' },
            { rise: 58, gap: 82, w: 150, theme: 'dark', edge: 'right', when: { minW: 960 } },
            { rise: 58, gap: 82, w: 150, theme: 'dark', edge: 'right' },
        ],
        extras: [
            floorSpikes(230, 620),
            { kind: 'spike', rect: anchored(0, 248, 1, -78, 150, 14), theme: 'light' },
            { kind: 'spike', rect: anchored(0, 480, 1, -136, 150, 14), theme: 'light' },
        ],
    },
    {
        id: 'collecte',
        tier: 'easy',
        mechanics: ['orbs', 'ice'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 74, w: 150, orb: true, vedge: 'top', surface: 'ice' },
            { rise: 44, gap: 84, w: 150, orb: true, edge: 'right', when: { minH: 530 } },
            { rise: -44, gap: 88, w: 160, edge: 'right' },
        ],
        extras: [floorSpikes(260, 180)],
    },
    {
        // Les orbes sont sur le chemin de l'aller ; la sortie, elle, est
        // revenue au point de départ. Le niveau se traverse deux fois.
        id: 'detour',
        tier: 'easy',
        mechanics: ['orbs', 'ice'],
        reference: REF,
        start: { x: 70, up: 0, w: 160 },
        steps: [
            { rise: 60, gap: 78, w: 140, orb: true, surface: 'ice' },
            { rise: 46, gap: 84, w: 140, orb: true, edge: 'right', when: { minW: 960 } },
        ],
        goalOn: 0,
        extras: [floorSpikes(560, 200)],
    },
    {
        // Les paliers alternent entre le bord gauche et le bord droit : la
        // fenêtre les écarte ou les rapproche deux par deux.
        id: 'ecart',
        tier: 'easy',
        mechanics: ['edge', 'ice'],
        reference: { w: 900, h: 560 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 60, gap: 72, w: 140, vedge: 'top', surface: 'ice' },
            { rise: 44, gap: 80, w: 130, edge: 'right', when: { minH: 530 } },
            { rise: 44, gap: 78, w: 140, edge: 'right' },
        ],
        extras: [floorSpikes(280, 340)],
    },
    {
        id: 'rebord',
        tier: 'easy',
        mechanics: ['resize', 'ice'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 58, gap: 70, w: 84, surface: 'ice' },
            { rise: 44, gap: 66, w: 76, vedge: 'top' },
            { rise: 44, gap: 66, w: 76, edge: 'right', when: { minW: 960 } },
            { rise: 44, gap: 70, w: 140, edge: 'right' },
        ],
        extras: [floorSpikes(250, 420)],
    },
    {
        id: 'couloir',
        tier: 'easy',
        mechanics: ['resize', 'ice'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 66, gap: 82, w: 140, vedge: 'top', surface: 'ice' },
            { rise: 0, gap: 96, w: 140, edge: 'right', when: { minW: 960 } },
            { rise: 0, gap: 96, w: 150, edge: 'right' },
        ],
        extras: [wall('left', 300, 60), wall('left', 560, 60), floorSpikes(700, 200)],
    },
    {
        // Première énigme sans sol : tomber ne coûte plus une bande de pointes,
        // mais la tentative.
        id: 'vide',
        tier: 'easy',
        mechanics: ['resize', 'ice'],
        reference: REF,
        floor: 'deadly',
        start: { x: 40, up: 60, w: 170 },
        steps: [
            { rise: 50, gap: 86, w: 140, vedge: 'top', surface: 'ice' },
            { rise: 50, gap: 86, w: 140, edge: 'right', when: { minW: 960 } },
            { rise: 50, gap: 86, w: 160, edge: 'right' },
        ],
    },

    // ══ MOYENNES ════════════════════════════════════════════════════════════
    {
        id: 'pendule',
        tier: 'medium',
        mechanics: ['motion', 'edge', 'ice', 'conveyor'],
        reference: REF,
        floor: 'deadly',
        start: { x: 40, up: 60, w: 180 },
        steps: [
            { rise: 40, gap: 62, w: 110, motion: { dx: 26, dy: 0, period: 3.2 }, vedge: 'top', surface: 'ice' },
            { rise: 40, gap: 56, w: 110, motion: { dx: 0, dy: 26, period: 3.8, phase: 0.5 }, edge: 'right', when: { maxW: 820 }, surface: 'conveyor', speed: 110 },
            { rise: 40, gap: 76, w: 170, edge: 'right' },
        ],
    },
    {
        // Deux routes s'excluent : l'une au-dessus de 860 px de large, l'autre
        // en dessous. Le chemin vérifié est celui du bas.
        id: 'entonnoir',
        tier: 'medium',
        mechanics: ['appear', 'edge', 'ice', 'conveyor'],
        reference: { w: 780, h: 560 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 74, w: 130, vedge: 'top', surface: 'ice' },
            { rise: 34, gap: 76, w: 120, when: { maxW: 860 }, edge: 'right', surface: 'conveyor', speed: 110 },
            { rise: 34, gap: 62, w: 130, edge: 'right' },
        ],
        extras: [
            slab(anchored(0, 340, 0, 110, 160, 14), { when: { minW: 860 } }),
            slab(anchored(1, -300, 0, 170, 150, 14), { when: { minW: 860 } }),
            floorSpikes(280, 360),
        ],
    },
    {
        // Deux murs, l'un ancré à gauche, l'autre à droite. Rétrécir les fait
        // se rejoindre — sur le joueur, s'il est entre les deux.
        id: 'etau',
        tier: 'medium',
        mechanics: ['crush', 'edge', 'ice', 'conveyor'],
        reference: { w: 900, h: 560 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 84, w: 130, vedge: 'top', surface: 'ice' },
            { rise: 48, gap: 80, w: 130, edge: 'right', surface: 'conveyor', speed: 110, when: { minH: 530 } },
            { rise: 48, gap: 76, w: 150, edge: 'right' },
        ],
        extras: [wall('left', 300, 70), wall('right', 326, 70), floorSpikes(420, 120)],
    },
    {
        id: 'escalier',
        tier: 'medium',
        mechanics: ['resize', 'motion', 'ice', 'conveyor'],
        reference: REF,
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 66, w: 110, surface: 'ice' },
            { rise: 60, gap: 66, w: 110, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 60, gap: 66, w: 110, edge: 'right', when: { minW: 960 } },
            { rise: 60, gap: 66, w: 140, edge: 'right' },
        ],
        extras: [blade(300, 60), blade(560, 180, 2.2, 0.5), floorSpikes(180, 640)],
    },
    {
        id: 'traverse',
        tier: 'medium',
        mechanics: ['edge', 'motion', 'ice', 'conveyor'],
        reference: { w: 860, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 66, w: 160 },
        steps: [
            { rise: 46, gap: 70, w: 120, edge: 'right', vedge: 'top', surface: 'ice' },
            { rise: 40, gap: 60, w: 110, edge: 'right', motion: { dx: 0, dy: 24, period: 3.6 }, when: { minH: 530 }, surface: 'conveyor', speed: 110 },
            { rise: 40, gap: 68, w: 150, edge: 'right' },
        ],
    },
    {
        // Une plateforme claire, une sombre, en alternance : il faut basculer
        // le thème en pleine traversée.
        id: 'alternance',
        tier: 'medium',
        mechanics: ['theme', 'ice', 'conveyor'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 130, theme: 'light', surface: 'ice' },
            { rise: 48, gap: 70, w: 130, theme: 'dark', vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 48, gap: 70, w: 130, theme: 'light', edge: 'right', when: { minW: 960 } },
            { rise: 48, gap: 70, w: 130, theme: 'dark', edge: 'right' },
        ],
        extras: [floorSpikes(200, 700)],
    },
    {
        id: 'guillotine',
        tier: 'medium',
        mechanics: ['motion', 'ice', 'conveyor'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 66, gap: 80, w: 150, vedge: 'top', surface: 'ice' },
            { rise: 0, gap: 96, w: 150, edge: 'right', when: { minW: 960 }, surface: 'conveyor', speed: 110 },
            { rise: 0, gap: 96, w: 150, edge: 'right' },
        ],
        extras: [
            blade(268, 66),
            blade(520, 66, 2.2, 0.5),
            blade(770, 66, 2.2, 0.25),
            floorSpikes(180, 660),
        ],
    },
    {
        id: 'serpentin',
        tier: 'medium',
        mechanics: ['resize', 'ice', 'conveyor'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 58, gap: 74, w: 130, surface: 'ice' },
            { rise: 58, gap: 74, w: 130, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 62, gap: 60, w: 130, turn: true, edge: 'right', when: { minW: 960 } },
            { rise: 58, gap: 74, w: 130, edge: 'right' },
            { rise: 62, gap: 60, w: 140, turn: true, edge: 'right' },
        ],
        extras: [floorSpikes(240, 520)],
    },
    {
        id: 'bascule',
        tier: 'medium',
        mechanics: ['motion', 'edge', 'gravity', 'ice', 'conveyor'],
        reference: REF,
        floor: 'deadly',
        start: { x: 36, up: 60, w: 160 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 42, gap: 60, w: 110, motion: { dx: 0, dy: 28, period: 3.0 }, vedge: 'top', surface: 'ice' },
                    { rise: 42, gap: 60, w: 120, surface: 'conveyor', speed: 110 },
                    { rise: 42, gap: 60, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 130, surface: 'ice' },
                    { rise: 50, gap: 58, w: 120, surface: 'conveyor', speed: 110 },
                ],
            },
        ],
    },
    {
        id: 'jachere',
        tier: 'medium',
        mechanics: ['theme', 'motion', 'ice', 'conveyor'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 76, w: 140, theme: 'light', vedge: 'top', surface: 'ice' },
            { rise: 40, gap: 62, w: 110, theme: 'light', motion: { dx: 0, dy: 26, period: 3.2 }, edge: 'right', when: { minW: 960 }, surface: 'conveyor', speed: 110 },
            { rise: 40, gap: 78, w: 150, theme: 'light', edge: 'right' },
        ],
        extras: [floorSpikes(220, 620), { ...blade(430, 102), theme: 'light' }],
    },
    {
        id: 'cordee',
        tier: 'medium',
        mechanics: ['orbs', 'resize', 'ice', 'conveyor'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 120, orb: true, surface: 'ice' },
            { rise: 58, gap: 74, w: 120, orb: true, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 58, gap: 74, w: 120, orb: true, edge: 'right', when: { minW: 960 } },
            { rise: 58, gap: 74, w: 140, edge: 'right' },
        ],
        extras: [floorSpikes(220, 620)],
    },
    {
        // Tout pend du haut ET le dernier palier est à droite : la fenêtre doit
        // être basse ET étroite.
        id: 'grenier',
        tier: 'medium',
        mechanics: ['edge', 'gravity', 'ice', 'conveyor'],
        reference: { w: 880, h: 490 },
        designedFor: 2,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 70, gap: 64, w: 160, vedge: 'top', surface: 'ice' },
            { rise: 62, gap: 66, w: 150, vedge: 'top', edge: 'right', surface: 'conveyor', speed: 110 },
            { rise: 62, gap: 66, w: 150, vedge: 'top', edge: 'right' },
        ],
        extras: [floorSpikes(240, 520)],
    },
    {
        id: 'passerelle',
        tier: 'medium',
        mechanics: ['appear', 'edge', 'ice', 'conveyor'],
        reference: { w: 760, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 64, gap: 66, w: 130, vedge: 'top', surface: 'ice' },
            { rise: 0, gap: 72, w: 120, edge: 'right', when: { maxW: 800 }, surface: 'conveyor', speed: 110 },
            { rise: 34, gap: 66, w: 130, edge: 'right' },
        ],
        extras: [floorSpikes(240, 340)],
    },
    {
        id: 'tourniquet',
        tier: 'medium',
        mechanics: ['edge', 'gravity', 'ice', 'conveyor'],
        reference: { w: 940, h: 540 },
        start: { x: 60, up: 0 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 60, gap: 60, w: 130, surface: 'ice' },
                    { rise: 44, gap: 60, w: 120, surface: 'conveyor', speed: 110 },
                    { rise: 44, gap: 60, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 130, surface: 'conveyor', speed: -110 },
                    { rise: 52, gap: 56, pivot: true, surface: 'ice' },
                ],
            },
            {
                designedFor: 2,
                steps: [
                    { catch: true, w: 130, surface: 'ice' },
                    { turn: true, rise: 50, gap: 32, w: 100 },
                ],
            },
        ],
        extras: [floorSpikes(240, 480)],
    },
    {
        id: 'cascade',
        tier: 'medium',
        mechanics: ['resize', 'motion', 'ice', 'conveyor'],
        reference: REF,
        start: { x: 60, up: 330, w: 170 },
        steps: [
            { rise: -60, gap: 66, w: 110, surface: 'ice' },
            { rise: -60, gap: 66, w: 110, motion: { dx: 30, dy: 0, period: 3.4 }, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: -60, gap: 66, w: 110, edge: 'right', when: { maxW: 760 } },
            { rise: -60, gap: 66, w: 140, edge: 'right' },
        ],
        extras: [floorSpikes(300, 200), floorSpikesR(120, 160)],
    },
    {
        // Le passage du milieu ne s'ouvre qu'en dessous de 780 px : la fenêtre
        // doit être franchement étroite.
        id: 'sablier',
        tier: 'medium',
        mechanics: ['appear', 'crush', 'ice', 'conveyor'],
        reference: { w: 720, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 60, gap: 60, w: 120, vedge: 'top', surface: 'ice' },
            { rise: 40, gap: 66, w: 110, when: { maxW: 780 }, edge: 'right', surface: 'conveyor', speed: 110 },
            { rise: 40, gap: 60, w: 130, edge: 'right' },
        ],
        extras: [wall('left', 250, 130, { when: { minW: 780 } }), floorSpikes(300, 260)],
    },
    {
        id: 'relais',
        tier: 'medium',
        mechanics: ['orbs', 'motion', 'ice', 'conveyor'],
        reference: REF,
        floor: 'deadly',
        start: { x: 36, up: 60, w: 170 },
        steps: [
            { rise: 42, gap: 60, w: 110, orb: true, motion: { dx: 0, dy: 24, period: 3.2 }, surface: 'ice' },
            { rise: 42, gap: 62, w: 110, orb: true, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 42, gap: 60, w: 110, motion: { dx: 24, dy: 0, period: 3.6, phase: 0.4 }, edge: 'right', when: { minW: 960 } },
            { rise: 42, gap: 70, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'faille',
        tier: 'medium',
        mechanics: ['resize', 'edge', 'ice', 'conveyor'],
        reference: { w: 940, h: 560 },
        floor: 'deadly',
        start: { x: 36, up: 66, w: 190 },
        steps: [
            { rise: 0, gap: 110, w: 120, vedge: 'top', surface: 'ice' },
            { rise: 0, gap: 110, w: 120, edge: 'right', when: { minW: 900 }, surface: 'conveyor', speed: 110 },
            { rise: 0, gap: 100, w: 140, edge: 'right' },
        ],
    },

    // ══ DIFFICILES ══════════════════════════════════════════════════════════
    {
        id: 'vertige',
        tier: 'hard',
        mechanics: ['motion', 'edge', 'ice', 'conveyor', 'crumble'],
        reference: REF,
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 44, gap: 56, w: 96, motion: { dx: 0, dy: 26, period: 3.0 }, surface: 'ice' },
            { rise: 44, gap: 52, w: 96, motion: { dx: 24, dy: 0, period: 3.4, phase: 0.25 }, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 44, gap: 52, w: 96, edge: 'right', motion: { dx: 0, dy: 26, period: 2.9, phase: 0.5 }, when: { maxW: 780 }, crumble: true },
            { rise: 44, gap: 66, w: 150, edge: 'right' },
        ],
    },
    {
        // Le niveau a deux visages selon la largeur, et la sortie n'est pas au
        // même endroit dans les deux.
        id: 'dedale',
        tier: 'hard',
        mechanics: ['appear', 'edge', 'ice', 'conveyor'],
        reference: { w: 740, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 62, gap: 60, w: 120, vedge: 'top', surface: 'ice' },
            { rise: 40, gap: 66, w: 120, when: { maxW: 800 }, edge: 'right', surface: 'conveyor', speed: 110 },
            { rise: 40, gap: 60, w: 130, edge: 'right', when: { maxW: 800 } },
        ],
        extras: [
            slab(anchored(0, 330, 1, -140, 130, 14), { when: { minW: 800 } }),
            slab(anchored(1, -300, 1, -200, 130, 14), { when: { minW: 800 } }),
            { kind: 'goal', rect: anchored(1, -250, 1, -234, 26, 34), when: { minW: 800 } },
            floorSpikes(200, 400),
        ],
    },
    {
        id: 'funambule',
        tier: 'hard',
        mechanics: ['orbs', 'motion', 'ice', 'conveyor', 'crumble'],
        reference: REF,
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 44, gap: 58, w: 70, orb: true, surface: 'ice' },
            { rise: 44, gap: 54, w: 70, motion: { dx: 0, dy: 24, period: 3.2 }, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 44, gap: 58, w: 70, orb: true, edge: 'right', when: { minW: 960 }, crumble: true },
            { rise: 44, gap: 62, w: 150, edge: 'right' },
        ],
    },
    {
        // Un palier accroché en haut entre deux accrochés en bas : l'écart
        // dépend de la hauteur de la fenêtre, et une seule plage laisse passer.
        id: 'contrepoids',
        tier: 'hard',
        mechanics: ['edge', 'gravity', 'ice', 'conveyor'],
        reference: { w: 1000, h: 500 },
        designedFor: 2,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 74, w: 150, vedge: 'top', surface: 'ice' },
            { rise: 44, gap: 78, w: 150, vedge: 'top', edge: 'right', surface: 'conveyor', speed: 110, when: { minW: 960 } },
            { rise: 44, gap: 78, w: 160, edge: 'right' },
        ],
        extras: [floorSpikes(220, 600)],
    },
    {
        id: 'retour',
        tier: 'hard',
        mechanics: ['rewind', 'motion', 'gravity', 'ice', 'conveyor', 'crumble'],
        reference: REF,
        floor: 'deadly',
        start: { x: 24, up: 56, w: 140 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 40, gap: 52, w: 84, motion: { dx: 0, dy: 24, period: 2.4 }, surface: 'ice' },
                    { rise: 40, gap: 50, w: 90, surface: 'conveyor', speed: 110 },
                    { rise: 40, gap: 52, pivot: true },
                ],
            },
            {
                designedFor: 3,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 50, gap: 56, w: 110, crumble: true },
                ],
            },
        ],
    },
    {
        id: 'metronome',
        tier: 'hard',
        mechanics: ['motion', 'ice', 'conveyor', 'crumble'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 66, w: 130, surface: 'ice' },
            { rise: 0, gap: 70, w: 130, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 0, gap: 70, w: 130, edge: 'right', when: { minW: 960 }, crumble: true },
            { rise: 0, gap: 70, w: 140, edge: 'right' },
        ],
        extras: [
            blade(398, 62, 2.0),
            blade(598, 62, 2.0, 0.33),
            blade(798, 62, 2.0, 0.66),
            floorSpikes(180, 700),
        ],
    },
    {
        id: 'eclipse',
        tier: 'hard',
        mechanics: ['theme', 'motion', 'ice', 'conveyor', 'crumble'],
        reference: REF,
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 44, gap: 60, w: 110, theme: 'dark', surface: 'ice' },
            { rise: 44, gap: 60, w: 110, theme: 'light', vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 44, gap: 56, w: 110, theme: 'dark', motion: { dx: 0, dy: 24, period: 3.0 }, edge: 'right', when: { minW: 960 }, crumble: true },
            { rise: 44, gap: 66, w: 150, theme: 'light', edge: 'right' },
        ],
    },
    {
        id: 'tenaille',
        tier: 'hard',
        mechanics: ['crush', 'edge', 'appear', 'ice', 'conveyor'],
        reference: { w: 860, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 130, vedge: 'top', surface: 'ice' },
            { rise: 44, gap: 72, w: 120, edge: 'right', when: { minH: 530 }, surface: 'conveyor', speed: 110 },
            { rise: 44, gap: 66, w: 140, edge: 'right' },
        ],
        extras: [
            wall('left', 280, 120),
            wall('right', 300, 120),
            floorSpikes(330, 200),
        ],
    },
    {
        id: 'verticale',
        tier: 'hard',
        mechanics: ['resize', 'gravity', 'ice', 'conveyor', 'crumble'],
        reference: { w: 620, h: 640 },
        start: { x: 40, up: 0 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 62, gap: 50, w: 100, surface: 'ice' },
                    { rise: 62, gap: 50, w: 100, surface: 'conveyor', speed: 110 },
                    { rise: 62, gap: 50, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 56, gap: 58, w: 130, when: { maxW: 680 }, crumble: true },
                ],
            },
        ],
        extras: [floorSpikes(180, 300)],
    },
    {
        id: 'gouffre',
        tier: 'hard',
        mechanics: ['motion', 'edge', 'ice', 'conveyor', 'crumble'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 160 },
        steps: [
            { rise: 0, gap: 92, w: 90, motion: { dx: 0, dy: 22, period: 3.0 }, surface: 'ice' },
            { rise: 0, gap: 92, w: 90, motion: { dx: 0, dy: 22, period: 3.0, phase: 0.5 }, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 0, gap: 92, w: 90, edge: 'right', motion: { dx: 0, dy: 22, period: 3.0, phase: 0.25 }, when: { minW: 960 }, crumble: true },
            { rise: 0, gap: 92, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'spirale',
        tier: 'hard',
        mechanics: ['edge', 'gravity', 'ice', 'conveyor', 'crumble'],
        reference: { w: 900, h: 600 },
        floor: 'deadly',
        start: { x: 50, up: 56, w: 150 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 60, gap: 70, w: 130, surface: 'ice' },
                    { rise: 46, gap: 66, w: 120, surface: 'conveyor', speed: 110 },
                    { rise: 46, gap: 60, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 54, gap: 58, pivot: true, crumble: true },
                ],
            },
            {
                designedFor: 2,
                steps: [
                    { catch: true, w: 120, surface: 'conveyor', speed: 110 },
                    { turn: true, rise: 52, gap: 58, pivot: true },
                ],
            },
            {
                designedFor: 3,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    // `turn` remonte dans le MONDE : dans un repère au
                    // troisième quart, c'est le sens croissant qui s'éloigne du
                    // sol d'origine, et la sortie doit finir hors de portée du
                    // chemin de départ.
                    { turn: true, rise: 50, gap: 32, w: 100 },
                ],
            },
        ],
    },
    {
        id: 'veilleuse',
        tier: 'hard',
        mechanics: ['theme', 'appear', 'ice', 'conveyor'],
        reference: { w: 820, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 130, theme: 'dark', vedge: 'top', surface: 'ice' },
            { rise: 44, gap: 74, w: 120, theme: 'dark', edge: 'right', when: { maxW: 860 }, surface: 'conveyor', speed: 110 },
            { rise: 44, gap: 66, w: 140, theme: 'dark', edge: 'right' },
        ],
        extras: [
            floorSpikes(200, 460),
            { kind: 'spike', rect: anchored(0, 250, 1, -74, 130, 14), theme: 'light' },
        ],
    },
    {
        id: 'horloge',
        tier: 'hard',
        mechanics: ['motion', 'ice', 'conveyor', 'crumble'],
        reference: REF,
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 40, gap: 54, w: 100, motion: { dx: 0, dy: 26, period: 2.4 }, surface: 'ice' },
            { rise: 40, gap: 54, w: 100, motion: { dx: 0, dy: 26, period: 2.4, phase: 0.33 }, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 40, gap: 54, w: 100, motion: { dx: 0, dy: 26, period: 2.4, phase: 0.66 }, edge: 'right', when: { minW: 960 }, crumble: true },
            { rise: 40, gap: 66, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'cordon',
        tier: 'hard',
        mechanics: ['orbs', 'edge', 'ice', 'conveyor', 'crumble'],
        reference: { w: 940, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 120, orb: true, surface: 'ice' },
            { rise: 44, gap: 74, w: 120, edge: 'right', orb: true, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 44, gap: 70, w: 120, vedge: 'top', orb: true, edge: 'right', when: { minW: 900 }, crumble: true },
            { rise: 44, gap: 70, w: 110, edge: 'right' },
        ],
        goalOn: 0,
        extras: [floorSpikes(240, 460)],
    },
    {
        id: 'abime',
        tier: 'hard',
        mechanics: ['appear', 'motion', 'ice', 'conveyor', 'crumble'],
        reference: { w: 800, h: 560 },
        floor: 'deadly',
        start: { x: 24, up: 60, w: 150 },
        steps: [
            { rise: 40, gap: 50, w: 100, when: { maxW: 860 }, surface: 'ice' },
            { rise: 40, gap: 50, w: 90, motion: { dx: 0, dy: 24, period: 3.0 }, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 40, gap: 50, w: 100, edge: 'right', when: { maxW: 840 }, crumble: true },
            { rise: 40, gap: 50, w: 120, edge: 'right' },
        ],
    },
    {
        id: 'charniere',
        tier: 'hard',
        mechanics: ['appear', 'edge', 'crush', 'gravity', 'ice', 'conveyor'],
        reference: { w: 720, h: 560 },
        start: { x: 40, up: 0 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 60, gap: 58, w: 110, vedge: 'top', surface: 'ice' },
                    { rise: 44, gap: 60, w: 110, surface: 'conveyor', speed: 110 },
                    { rise: 44, gap: 56, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 48, gap: 56, w: 110, when: { maxW: 780 }, surface: 'conveyor', speed: 110 },
                ],
            },
        ],
        extras: [
            wall('left', 240, 150, { when: { minW: 780 } }),
            wall('right', 260, 150, { when: { minW: 780 } }),
            floorSpikes(280, 260),
        ],
    },
    {
        id: 'souffle',
        tier: 'hard',
        mechanics: ['motion', 'edge', 'orbs', 'ice', 'conveyor', 'crumble'],
        reference: REF,
        floor: 'deadly',
        start: { x: 24, up: 56, w: 140 },
        steps: [
            { rise: 40, gap: 52, w: 84, orb: true, motion: { dx: 0, dy: 24, period: 2.6 }, surface: 'ice' },
            { rise: 40, gap: 50, w: 84, motion: { dx: 20, dy: 0, period: 3.0, phase: 0.4 }, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 40, gap: 52, w: 84, orb: true, motion: { dx: 0, dy: 24, period: 2.6, phase: 0.5 }, edge: 'right', when: { minH: 530 }, crumble: true },
            { rise: 40, gap: 54, w: 90, edge: 'right' },
            { rise: 40, gap: 62, w: 140, edge: 'right' },
        ],
    },
    {
        // Tout à la fois : les bords, le thème, le mouvement, les orbes et le
        // vide. La dernière énigme du catalogue.
        id: 'epilogue',
        tier: 'hard',
        mechanics: ['edge', 'appear', 'theme', 'motion', 'orbs', 'ice', 'conveyor', 'crumble'],
        reference: { w: 880, h: 560 },
        floor: 'deadly',
        start: { x: 24, up: 60, w: 150 },
        steps: [
            { rise: 42, gap: 58, w: 110, theme: 'dark', orb: true, surface: 'ice' },
            { rise: 42, gap: 54, w: 100, motion: { dx: 0, dy: 24, period: 3.0 }, vedge: 'top', surface: 'conveyor', speed: 110 },
            { rise: 42, gap: 58, w: 110, when: { maxW: 940 }, orb: true, edge: 'right', crumble: true },
            { rise: 42, gap: 64, w: 130, edge: 'right' },
        ],
        extras: [
            slab(anchored(0, 260, 1, -102, 110, 14), { theme: 'light' }),
        ],
    },

    // ══ IMPOSSIBLES ═════════════════════════════════════════════════════════
    // Sept matières s'ajoutent ici : la glace, le rebond, le tapis, le
    // clignotement, la lame qui suit, le vent et les paliers friables. Aucune
    // n'est une variation des précédentes — chacune change une règle de la
    // physique, et elles se combinent.
    {
        id: 'verglas',
        tier: 'impossible',
        mechanics: ['ice', 'edge'],
        reference: { w: 1100, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 40, gap: 58, w: 110, surface: 'ice' },
            { rise: 36, gap: 58, w: 110, surface: 'ice', vedge: 'top' },
            { rise: 36, gap: 58, w: 110, surface: 'ice', edge: 'right', when: { minW: 1060 } },
            { rise: 36, gap: 62, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'patinoire',
        tier: 'impossible',
        mechanics: ['ice', 'resize'],
        reference: { w: 1100, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 66, w: 220, surface: 'ice', vedge: 'top' },
            { rise: 40, gap: 72, w: 200, surface: 'ice', edge: 'right', when: { minW: 1060 } },
            { rise: 40, gap: 72, w: 150, edge: 'right' },
        ],
        extras: [floorSpikes(240, 620)],
    },
    {
        id: 'banquise',
        tier: 'impossible',
        mechanics: ['ice', 'edge'],
        reference: { w: 900, h: 620 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 40, gap: 58, w: 120, surface: 'ice' },
            { rise: 40, gap: 58, w: 120, surface: 'ice', vedge: 'top' },
            { rise: 62, gap: 60, w: 120, turn: true, surface: 'ice', edge: 'right', when: { minH: 590 } },
            { rise: 40, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'derapage',
        tier: 'impossible',
        mechanics: ['ice', 'conveyor'],
        reference: { w: 1050, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 40, gap: 58, w: 150, surface: 'conveyor', speed: -120 },
            { rise: 36, gap: 58, w: 130, surface: 'ice', vedge: 'top' },
            { rise: 36, gap: 58, w: 150, surface: 'conveyor', speed: 120, edge: 'right', when: { minW: 1010 } },
            { rise: 36, gap: 60, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'tremplin',
        tier: 'impossible',
        mechanics: ['bounce', 'resize'],
        reference: { w: 950, h: 620 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 40, gap: 70, w: 150, surface: 'bouncy', vedge: 'top' },
            { rise: 180, gap: 66, w: 150, assisted: true, edge: 'right', when: { minW: 910 } },
            { rise: 40, gap: 66, w: 150, edge: 'right' },
        ],
        extras: [floorSpikes(230, 600)],
    },
    {
        id: 'catapulte',
        tier: 'impossible',
        mechanics: ['bounce', 'motion'],
        reference: { w: 1000, h: 640 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 60, w: 130, surface: 'bouncy', vedge: 'top' },
            { rise: 190, gap: 62, w: 120, assisted: true, motion: { dx: 0, dy: 22, period: 3.2 }, edge: 'right', when: { minW: 960 } },
            { rise: 40, gap: 60, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'ressac',
        tier: 'impossible',
        mechanics: ['bounce', 'wind'],
        reference: { w: 1000, h: 620 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 60, w: 130, surface: 'bouncy', vedge: 'top' },
            { rise: 170, gap: 90, w: 140, assisted: true, edge: 'right', when: { minW: 960 } },
            { rise: 40, gap: 62, w: 150, edge: 'right' },
        ],
        extras: [windZone(220, 420, 320, 300, 620)],
    },
    {
        id: 'soufflerie',
        tier: 'impossible',
        mechanics: ['wind', 'edge'],
        reference: { w: 1100, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 0, gap: 140, w: 120, assisted: true, vedge: 'top' },
            { rise: 0, gap: 140, w: 120, assisted: true, edge: 'right', when: { minW: 1060 } },
            { rise: 0, gap: 120, w: 160, assisted: true, edge: 'right' },
        ],
        extras: [
            windZone(180, 200, 200, 160, 760),
            windZone(440, 200, 200, 160, 760),
            windZone(700, 200, 200, 160, 760),
        ],
    },
    {
        id: 'bourrasque',
        tier: 'impossible',
        mechanics: ['wind', 'motion'],
        reference: { w: 1050, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 120, w: 110, assisted: true, vedge: 'top' },
            { rise: 30, gap: 60, w: 110, motion: { dx: 0, dy: 24, period: 3.0 }, edge: 'right', when: { minW: 1010 } },
            { rise: 30, gap: 120, w: 160, assisted: true, edge: 'right' },
        ],
        extras: [windZone(190, 240, 220, 200, 700), windZone(600, 300, 220, 200, 700)],
    },
    {
        id: 'alize',
        tier: 'impossible',
        mechanics: ['wind', 'ice'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 36, gap: 58, w: 130, surface: 'ice', vedge: 'top' },
            { rise: 36, gap: 58, w: 130, surface: 'ice', edge: 'right', when: { minW: 960 } },
            { rise: 36, gap: 60, w: 150, edge: 'right' },
        ],
        // Le vent souffle À CONTRESENS de la marche : sur la glace, il suffit à
        // renvoyer le joueur vers le vide qu'il vient de franchir.
        extras: [windZone(200, 320, 420, 280, -420)],
    },
    {
        id: 'tapis',
        tier: 'impossible',
        mechanics: ['conveyor', 'resize'],
        reference: { w: 1050, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 66, w: 190, surface: 'conveyor', speed: 130, vedge: 'top' },
            { rise: 40, gap: 66, w: 190, surface: 'conveyor', speed: -130, edge: 'right', when: { minW: 1010 } },
            { rise: 40, gap: 66, w: 150, edge: 'right' },
        ],
        extras: [floorSpikes(230, 620)],
    },
    {
        id: 'contresens',
        tier: 'impossible',
        mechanics: ['conveyor', 'edge'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 160 },
        steps: [
            { rise: 36, gap: 56, w: 170, surface: 'conveyor', speed: -160, vedge: 'top' },
            { rise: 36, gap: 56, w: 170, surface: 'conveyor', speed: -160, edge: 'right', when: { minW: 960 } },
            { rise: 36, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'laminoir',
        tier: 'impossible',
        mechanics: ['conveyor', 'crush'],
        reference: { w: 980, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 62, w: 180, surface: 'conveyor', speed: 140, vedge: 'top' },
            { rise: 40, gap: 66, w: 170, surface: 'conveyor', speed: -140, edge: 'right', when: { minW: 940 } },
            { rise: 40, gap: 62, w: 150, edge: 'right' },
        ],
        extras: [wall('left', 300, 80), wall('right', 320, 80), floorSpikes(380, 200)],
    },
    {
        id: 'stroboscope',
        tier: 'impossible',
        mechanics: ['blink', 'edge'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 36, gap: 58, w: 120, blink: { period: 2.2, duty: 0.5 }, vedge: 'top' },
            { rise: 36, gap: 58, w: 120, blink: { period: 2.2, duty: 0.5, phase: 0.5 }, edge: 'right', when: { minW: 960 } },
            { rise: 36, gap: 60, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'intermittence',
        tier: 'impossible',
        mechanics: ['blink', 'resize'],
        reference: { w: 1050, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 62, w: 140, blink: { period: 2.6, duty: 0.55 }, vedge: 'top' },
            { rise: 40, gap: 66, w: 140, blink: { period: 2.6, duty: 0.55, phase: 0.33 }, edge: 'right', when: { minW: 1010 } },
            { rise: 40, gap: 66, w: 150, edge: 'right' },
        ],
        extras: [floorSpikes(220, 640)],
    },
    {
        id: 'battement',
        tier: 'impossible',
        mechanics: ['blink', 'motion'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 34, gap: 56, w: 110, blink: { period: 2.4, duty: 0.6 } },
            { rise: 34, gap: 54, w: 100, motion: { dx: 0, dy: 22, period: 2.8 }, vedge: 'top' },
            { rise: 34, gap: 56, w: 110, blink: { period: 2.4, duty: 0.6, phase: 0.5 }, edge: 'right', when: { minW: 960 } },
            { rise: 34, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'cendres',
        tier: 'impossible',
        mechanics: ['crumble', 'edge'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 34, gap: 56, w: 110, crumble: true },
            { rise: 34, gap: 56, w: 110, crumble: true, vedge: 'top' },
            { rise: 34, gap: 56, w: 110, crumble: true, edge: 'right', when: { minW: 960 } },
            { rise: 34, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'effondrement',
        tier: 'impossible',
        mechanics: ['crumble', 'motion'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 34, gap: 54, w: 100, crumble: true },
            { rise: 34, gap: 52, w: 96, motion: { dx: 0, dy: 20, period: 2.6 }, vedge: 'top' },
            { rise: 34, gap: 54, w: 100, crumble: true, edge: 'right', when: { minW: 960 } },
            { rise: 34, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'poussiere',
        tier: 'impossible',
        mechanics: ['crumble', 'orbs'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 160 },
        steps: [
            { rise: 34, gap: 54, w: 110, crumble: true, orb: true, vedge: 'top' },
            { rise: 34, gap: 54, w: 110, crumble: true, orb: true, edge: 'right', when: { minW: 960 } },
            { rise: 34, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'damocles',
        tier: 'impossible',
        mechanics: ['chase', 'resize'],
        reference: { w: 1000, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 66, w: 150, vedge: 'top' },
            { rise: 40, gap: 70, w: 150, edge: 'right', when: { minW: 960 } },
            { rise: 40, gap: 70, w: 150, edge: 'right' },
        ],
        extras: [stalker(56, 2.4), floorSpikes(230, 620)],
    },
    {
        id: 'traque',
        tier: 'impossible',
        mechanics: ['chase', 'crumble'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 34, gap: 52, w: 140, crumble: true, vedge: 'top' },
            { rise: 34, gap: 52, w: 140, crumble: true, edge: 'right', when: { minW: 960 } },
            { rise: 34, gap: 56, w: 150, edge: 'right' },
        ],
        // ⚠️ Période 4,2 s et non 2,2 : une lame rapide au-dessus de paliers
        // qui s'effondrent ne laissait qu'une demi-seconde pour fuir, sur
        // 110 px de large et au-dessus du vide. Le niveau n'était plus
        // difficile, il était insoluble — le vérificateur l'a refusé. À 3,4 s
        // il ne se terminait qu'en fenêtre réduite, donc pas à la cote que le
        // jeu affiche comme repère.
        extras: [stalker(60, 4.2)],
    },
    {
        id: 'ombre',
        tier: 'impossible',
        mechanics: ['chase', 'theme'],
        reference: { w: 1000, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 64, w: 140, theme: 'dark', vedge: 'top' },
            { rise: 40, gap: 68, w: 140, theme: 'dark', edge: 'right', when: { minW: 960 } },
            { rise: 40, gap: 68, w: 150, theme: 'dark', edge: 'right' },
        ],
        extras: [stalker(56, 2.6), floorSpikes(220, 640)],
    },
    {
        id: 'frimas',
        tier: 'impossible',
        mechanics: ['ice', 'motion'],
        reference: { w: 1000, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 64, w: 150, surface: 'ice', vedge: 'top' },
            { rise: 40, gap: 60, w: 110, surface: 'ice', motion: { dx: 0, dy: 22, period: 3.0 }, edge: 'right', when: { minW: 960 } },
            { rise: 40, gap: 64, w: 150, edge: 'right' },
        ],
        extras: [floorSpikes(220, 640)],
    },
    {
        id: 'avalanche',
        tier: 'impossible',
        mechanics: ['ice', 'crumble'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 34, gap: 56, w: 120, surface: 'ice', crumble: true, vedge: 'top' },
            { rise: 34, gap: 56, w: 120, surface: 'ice', crumble: true, edge: 'right', when: { minW: 960 } },
            { rise: 34, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'congere',
        tier: 'impossible',
        mechanics: ['ice', 'appear'],
        reference: { w: 860, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 34, gap: 56, w: 120, surface: 'ice', vedge: 'top' },
            { rise: 34, gap: 56, w: 120, surface: 'ice', edge: 'right', when: { minH: 530 } },
            { rise: 34, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'trebuchet',
        tier: 'impossible',
        mechanics: ['bounce', 'crush'],
        reference: { w: 950, h: 640 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 30, gap: 62, w: 140, surface: 'bouncy', vedge: 'top' },
            { rise: 175, gap: 64, w: 150, assisted: true, edge: 'right', when: { minW: 910 } },
            { rise: 40, gap: 64, w: 150, edge: 'right' },
        ],
        extras: [
            floorSpikes(220, 560),
            { kind: 'spike', rect: anchored(0, 300, 0, 60, 220, 22) },
        ],
    },
    {
        id: 'mortier',
        tier: 'impossible',
        mechanics: ['bounce', 'orbs'],
        reference: { w: 980, h: 640 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 60, w: 130, surface: 'bouncy', orb: true, vedge: 'top' },
            { rise: 180, gap: 62, w: 140, assisted: true, orb: true, edge: 'right', when: { minW: 940 } },
            { rise: 40, gap: 62, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'rafale',
        tier: 'impossible',
        mechanics: ['wind', 'blink'],
        reference: { w: 1050, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 118, w: 120, assisted: true, blink: { period: 2.6, duty: 0.6 } },
            { rise: 30, gap: 118, w: 160, assisted: true, edge: 'right', when: { minW: 1010 } },
        ],
        extras: [windZone(190, 260, 240, 220, 720), windZone(500, 300, 240, 220, 720)],
    },
    {
        id: 'tourmente',
        tier: 'impossible',
        mechanics: ['wind', 'chase'],
        reference: { w: 1000, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 64, w: 140, vedge: 'top' },
            { rise: 40, gap: 110, w: 140, assisted: true, edge: 'right', when: { minW: 960 } },
            { rise: 40, gap: 64, w: 150, edge: 'right' },
        ],
        extras: [windZone(280, 300, 260, 240, 640), stalker(56, 2.8), floorSpikes(230, 600)],
    },
    {
        id: 'sirocco',
        tier: 'impossible',
        mechanics: ['wind', 'crumble'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 32, gap: 54, w: 110, crumble: true, vedge: 'top' },
            { rise: 32, gap: 108, w: 120, assisted: true, crumble: true, edge: 'right', when: { minW: 960 } },
            { rise: 32, gap: 58, w: 150, edge: 'right' },
        ],
        extras: [windZone(280, 300, 260, 220, 660)],
    },
    {
        id: 'engrenage',
        tier: 'impossible',
        mechanics: ['conveyor', 'gravity', 'crumble', 'ice'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 32, gap: 54, w: 150, surface: 'conveyor', speed: -140, vedge: 'top' },
                    { rise: 32, gap: 54, w: 110, crumble: true },
                    { rise: 32, gap: 58, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 46, gap: 56, pivot: true, surface: 'conveyor', speed: 140 },
                ],
            },
            {
                designedFor: 2,
                steps: [
                    { catch: true, w: 120, crumble: true },
                    { rise: 44, gap: 58, w: 150 },
                ],
            },
        ],
    },
    {
        id: 'moulin',
        tier: 'impossible',
        mechanics: ['conveyor', 'motion', 'gravity', 'ice'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 32, gap: 54, w: 140, surface: 'conveyor', speed: 150 },
                    { rise: 32, gap: 52, w: 100, motion: { dx: 22, dy: 0, period: 3.0 }, vedge: 'top' },
                    { rise: 32, gap: 54, pivot: true },
                ],
            },
            {
                designedFor: 3,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 46, gap: 56, pivot: true, surface: 'conveyor', speed: -150 },
                ],
            },
            {
                designedFor: 2,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 44, gap: 58, w: 150 },
                ],
            },
        ],
    },
    {
        id: 'pilon',
        tier: 'impossible',
        mechanics: ['conveyor', 'motion'],
        reference: { w: 1000, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 62, w: 170, surface: 'conveyor', speed: 140, vedge: 'top' },
            { rise: 0, gap: 74, w: 170, surface: 'conveyor', speed: -140, edge: 'right', when: { minW: 960 } },
            { rise: 0, gap: 74, w: 150, edge: 'right' },
        ],
        extras: [blade(330, 56), blade(600, 56, 2.2, 0.5), floorSpikes(220, 620)],
    },
    {
        id: 'eclair',
        tier: 'impossible',
        mechanics: ['blink', 'edge'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 32, gap: 54, w: 110, blink: { period: 1.6, duty: 0.45 }, vedge: 'top' },
            { rise: 32, gap: 54, w: 110, blink: { period: 1.6, duty: 0.45, phase: 0.5 }, edge: 'right', when: { minW: 960 } },
            { rise: 32, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'syncope',
        tier: 'impossible',
        mechanics: ['blink', 'conveyor'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 32, gap: 54, w: 150, surface: 'conveyor', speed: -130, vedge: 'top' },
            { rise: 32, gap: 54, w: 120, blink: { period: 2.4, duty: 0.55 }, edge: 'right', when: { minW: 960 } },
            { rise: 32, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'arythmie',
        tier: 'impossible',
        mechanics: ['blink'],
        reference: { w: 1050, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 54, w: 110, blink: { period: 1.9, duty: 0.5 } },
            { rise: 30, gap: 54, w: 110, blink: { period: 2.7, duty: 0.5, phase: 0.3 }, vedge: 'top' },
            { rise: 30, gap: 54, w: 110, blink: { period: 3.3, duty: 0.5, phase: 0.6 }, edge: 'right', when: { minW: 1010 } },
            { rise: 30, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'dislocation',
        tier: 'impossible',
        mechanics: ['crumble', 'blink', 'gravity', 'ice'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 30, gap: 54, w: 110, crumble: true },
                    { rise: 30, gap: 54, w: 110, blink: { period: 2.4, duty: 0.6 }, vedge: 'top' },
                    { rise: 30, gap: 54, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 46, gap: 56, w: 110, crumble: true },
                ],
            },
        ],
    },
    {
        id: 'erosion',
        tier: 'impossible',
        mechanics: ['crumble', 'ice'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 54, w: 130, surface: 'ice' },
            { rise: 30, gap: 54, w: 110, crumble: true, vedge: 'top' },
            { rise: 30, gap: 54, w: 130, surface: 'ice', edge: 'right', when: { minW: 960 } },
            { rise: 30, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'guet',
        tier: 'impossible',
        mechanics: ['chase', 'blink'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 54, w: 120, blink: { period: 2.6, duty: 0.6 }, vedge: 'top' },
            { rise: 30, gap: 54, w: 120, blink: { period: 2.6, duty: 0.6, phase: 0.5 }, edge: 'right', when: { minW: 960 } },
            { rise: 30, gap: 58, w: 150, edge: 'right' },
        ],
        extras: [stalker(60, 3.0)],
    },
    {
        id: 'embuscade',
        tier: 'impossible',
        mechanics: ['chase', 'appear'],
        reference: { w: 880, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 56, gap: 60, w: 130, vedge: 'top' },
            { rise: 40, gap: 64, w: 130, edge: 'right', when: { minH: 530 } },
            { rise: 40, gap: 60, w: 150, edge: 'right' },
        ],
        extras: [stalker(56, 2.4), floorSpikes(200, 560)],
    },
    {
        id: 'curee',
        tier: 'impossible',
        mechanics: ['chase', 'orbs'],
        reference: { w: 1000, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 56, gap: 62, w: 140, orb: true, vedge: 'top' },
            { rise: 40, gap: 66, w: 140, orb: true, edge: 'right', when: { minW: 960 } },
            { rise: 40, gap: 66, w: 150, edge: 'right' },
        ],
        extras: [stalker(56, 2.6), floorSpikes(220, 620)],
    },
    {
        id: 'verrou',
        tier: 'impossible',
        mechanics: ['crush', 'gravity', 'ice', 'conveyor'],
        reference: { w: 920, h: 560 },
        start: { x: 40, up: 0 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 56, gap: 60, w: 150, surface: 'ice', vedge: 'top' },
                    { rise: 40, gap: 62, w: 140, surface: 'conveyor', speed: 110 },
                    { rise: 40, gap: 60, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 50, gap: 58, w: 110, when: { minH: 530 } },
                ],
            },
        ],
        extras: [wall('left', 290, 80), wall('right', 300, 80), floorSpikes(360, 200)],
    },
    {
        id: 'garrot',
        tier: 'impossible',
        mechanics: ['crush', 'conveyor'],
        reference: { w: 940, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 56, gap: 60, w: 160, surface: 'conveyor', speed: -140, vedge: 'top' },
            { rise: 40, gap: 62, w: 140, edge: 'right', when: { minW: 900 } },
            { rise: 40, gap: 60, w: 150, edge: 'right' },
        ],
        extras: [wall('left', 280, 90), wall('right', 300, 90), floorSpikes(350, 220)],
    },
    {
        id: 'chausse-trappe',
        tier: 'impossible',
        mechanics: ['crumble', 'appear'],
        reference: { w: 880, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 30, gap: 54, w: 110, crumble: true, vedge: 'top' },
            { rise: 30, gap: 54, w: 110, crumble: true, edge: 'right', when: { minH: 530 } },
            { rise: 30, gap: 58, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'apnee',
        tier: 'impossible',
        mechanics: ['ice', 'crumble', 'blink', 'orbs', 'gravity'],
        reference: { w: 1120, h: 600 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        segments: [
            {
                designedFor: 0,
                steps: [
                    { rise: 30, gap: 54, w: 120, surface: 'ice', orb: true },
                    { rise: 30, gap: 54, w: 110, crumble: true, vedge: 'top' },
                    { rise: 30, gap: 54, pivot: true },
                ],
            },
            {
                designedFor: 1,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 46, gap: 56, pivot: true, blink: { period: 2.4, duty: 0.6 } },
                ],
            },
            {
                designedFor: 2,
                steps: [
                    { catch: true, w: 120, crumble: true, orb: true },
                    { rise: 44, gap: 58, w: 150 },
                ],
            },
        ],
    },
    {
        id: 'terminus',
        tier: 'impossible',
        mechanics: ['bounce', 'wind', 'chase', 'crumble', 'edge', 'gravity'],
        reference: { w: 1000, h: 640 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        segments: [
            {
                designedFor: 2,
                steps: [
                    { rise: 28, gap: 56, w: 120, surface: 'bouncy', vedge: 'top' },
                    { rise: 175, gap: 60, w: 110, assisted: true, crumble: true },
                    { rise: 30, gap: 60, pivot: true, assisted: true },
                ],
            },
            {
                designedFor: 3,
                steps: [
                    { catch: true, w: 120, surface: 'ice' },
                    { rise: 46, gap: 58, w: 110, surface: 'conveyor', speed: 130 },
                ],
            },
        ],
        extras: [windZone(420, 340, 260, 240, 700), stalker(60, 3.0)],
    },
];
