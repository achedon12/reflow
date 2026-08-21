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

/** Une lame qui tombe du plafond et remonte. */
const blade = (x: number, drop: number, extra: Partial<Block> = {}): Block => ({
    kind: 'spike',
    rect: anchored(0, x, 0, -10, 22, 120),
    motion: { dx: 0, dy: drop, period: 2.2 },
    ...extra,
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
        mechanics: ['resize'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 72, w: 130 },
            { rise: 62, gap: 72, w: 130 },
            { rise: 62, gap: 72, w: 130 },
        ],
    },
    {
        id: 'descente',
        tier: 'easy',
        mechanics: ['resize'],
        reference: REF,
        start: { x: 60, up: 300, w: 170 },
        steps: [
            { rise: -70, gap: 96, w: 140 },
            { rise: -70, gap: 96, w: 140 },
            { rise: -70, gap: 96, w: 150 },
        ],
        extras: [floorSpikes(300, 220)],
    },
    {
        // Le palier d'arrivée est accroché à DROITE, celui de départ à gauche :
        // l'écart entre les deux vaut la largeur de la fenêtre moins une
        // constante. Il n'existe qu'une façon de le réduire.
        id: 'bordure',
        tier: 'easy',
        mechanics: ['edge'],
        reference: { w: 820, h: 560 },
        start: { x: 90, up: 0 },
        steps: [
            { rise: 56, gap: 88, w: 170 },
            { rise: 40, gap: 96, w: 190, edge: 'right' },
        ],
        extras: [floorSpikes(320, 260)],
    },
    {
        // Tout le chemin pend du HAUT de la fenêtre. Plus elle est haute, plus
        // il s'éloigne du sol.
        id: 'suspendu',
        tier: 'easy',
        mechanics: ['edge'],
        reference: { w: 1000, h: 470 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 70, gap: 62, w: 170, vedge: 'top' },
            { rise: 66, gap: 62, w: 170, vedge: 'top' },
            { rise: 66, gap: 62, w: 170, vedge: 'top' },
        ],
        extras: [floorSpikes(250, 600)],
    },
    {
        // Le pont du milieu n'existe qu'en dessous de 880 px de large. Rien ne
        // l'annonce : on le découvre en tirant sur le bord.
        id: 'lucarne',
        tier: 'easy',
        mechanics: ['appear'],
        reference: { w: 820, h: 560 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 70, gap: 76, w: 140 },
            { rise: 0, gap: 76, w: 130, when: { maxW: 880 } },
            { rise: 0, gap: 76, w: 130 },
        ],
        extras: [floorSpikes(300, 320)],
    },
    {
        id: 'balancier',
        tier: 'easy',
        mechanics: ['motion'],
        reference: REF,
        start: { x: 70, up: 0 },
        steps: [
            { rise: 62, gap: 74, w: 140 },
            { rise: 30, gap: 62, w: 120, motion: { dx: 0, dy: 30, period: 3.4 } },
            { rise: 30, gap: 70, w: 150 },
        ],
        extras: [floorSpikes(280, 300)],
    },
    {
        id: 'navette',
        tier: 'easy',
        mechanics: ['motion'],
        reference: REF,
        start: { x: 70, up: 0 },
        steps: [
            { rise: 58, gap: 76, w: 140 },
            { rise: 20, gap: 58, w: 110, motion: { dx: 34, dy: 0, period: 3.6 } },
            { rise: 20, gap: 64, w: 150 },
        ],
        extras: [floorSpikes(300, 320)],
    },
    {
        // Le chemin n'existe qu'en thème CLAIR. Le bouton du pied de page vient
        // de changer de métier.
        id: 'clairiere',
        tier: 'easy',
        mechanics: ['theme'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 64, gap: 78, w: 140, theme: 'light' },
            { rise: 58, gap: 82, w: 140, theme: 'light' },
            { rise: 58, gap: 82, w: 150, theme: 'light' },
        ],
        extras: [floorSpikes(230, 620)],
    },
    {
        id: 'nocturne',
        tier: 'easy',
        mechanics: ['theme'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 64, gap: 78, w: 150, theme: 'dark' },
            { rise: 58, gap: 82, w: 150, theme: 'dark' },
            { rise: 58, gap: 82, w: 150, theme: 'dark' },
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
        mechanics: ['orbs'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 74, w: 150, orb: true },
            { rise: 44, gap: 84, w: 150, orb: true },
            { rise: -44, gap: 88, w: 160 },
        ],
        extras: [floorSpikes(260, 180)],
    },
    {
        // Les orbes sont sur le chemin de l'aller ; la sortie, elle, est
        // revenue au point de départ. Le niveau se traverse deux fois.
        id: 'detour',
        tier: 'easy',
        mechanics: ['orbs'],
        reference: REF,
        start: { x: 70, up: 0, w: 160 },
        steps: [
            { rise: 60, gap: 78, w: 140, orb: true },
            { rise: 46, gap: 84, w: 140, orb: true },
        ],
        goalOn: 0,
        extras: [floorSpikes(560, 200)],
    },
    {
        // Les paliers alternent entre le bord gauche et le bord droit : la
        // fenêtre les écarte ou les rapproche deux par deux.
        id: 'ecart',
        tier: 'easy',
        mechanics: ['edge'],
        reference: { w: 900, h: 560 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 60, gap: 72, w: 140 },
            { rise: 44, gap: 80, w: 130, edge: 'right' },
            { rise: 44, gap: 78, w: 140, edge: 'right' },
        ],
        extras: [floorSpikes(280, 340)],
    },
    {
        id: 'rebord',
        tier: 'easy',
        mechanics: ['resize'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 58, gap: 70, w: 84 },
            { rise: 44, gap: 66, w: 76 },
            { rise: 44, gap: 66, w: 76 },
            { rise: 44, gap: 70, w: 140 },
        ],
        extras: [floorSpikes(250, 420)],
    },
    {
        id: 'couloir',
        tier: 'easy',
        mechanics: ['resize'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 66, gap: 82, w: 140 },
            { rise: 0, gap: 96, w: 140 },
            { rise: 0, gap: 96, w: 150 },
        ],
        extras: [wall('left', 300, 60), wall('left', 560, 60), floorSpikes(700, 200)],
    },
    {
        // Première énigme sans sol : tomber ne coûte plus une bande de pointes,
        // mais la tentative.
        id: 'vide',
        tier: 'easy',
        mechanics: ['resize'],
        reference: REF,
        floor: 'deadly',
        start: { x: 40, up: 60, w: 170 },
        steps: [
            { rise: 50, gap: 86, w: 140 },
            { rise: 50, gap: 86, w: 140 },
            { rise: 50, gap: 86, w: 160 },
        ],
    },

    // ══ MOYENNES ════════════════════════════════════════════════════════════
    {
        id: 'pendule',
        tier: 'medium',
        mechanics: ['motion', 'edge'],
        reference: REF,
        floor: 'deadly',
        start: { x: 40, up: 60, w: 180 },
        steps: [
            { rise: 40, gap: 62, w: 110, motion: { dx: 26, dy: 0, period: 3.2 } },
            { rise: 40, gap: 56, w: 110, motion: { dx: 0, dy: 26, period: 3.8, phase: 0.5 } },
            { rise: 40, gap: 76, w: 170, edge: 'right' },
        ],
    },
    {
        // Deux routes s'excluent : l'une au-dessus de 860 px de large, l'autre
        // en dessous. Le chemin vérifié est celui du bas.
        id: 'entonnoir',
        tier: 'medium',
        mechanics: ['appear', 'edge'],
        reference: { w: 780, h: 560 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 74, w: 130 },
            { rise: 34, gap: 76, w: 120, when: { maxW: 860 } },
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
        mechanics: ['crush', 'edge'],
        reference: { w: 900, h: 560 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 84, w: 130 },
            { rise: 48, gap: 80, w: 130, edge: 'right' },
            { rise: 48, gap: 76, w: 150, edge: 'right' },
        ],
        extras: [wall('left', 300, 70), wall('right', 326, 70), floorSpikes(420, 120)],
    },
    {
        id: 'escalier',
        tier: 'medium',
        mechanics: ['resize', 'motion'],
        reference: REF,
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 66, w: 110 },
            { rise: 60, gap: 66, w: 110 },
            { rise: 60, gap: 66, w: 110 },
            { rise: 60, gap: 66, w: 140 },
        ],
        extras: [blade(300, 130), blade(560, 130, { motion: { dx: 0, dy: 130, period: 2.2, phase: 0.5 } }), floorSpikes(180, 640)],
    },
    {
        id: 'traverse',
        tier: 'medium',
        mechanics: ['edge', 'motion'],
        reference: { w: 860, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 66, w: 160 },
        steps: [
            { rise: 46, gap: 70, w: 120, edge: 'right' },
            { rise: 40, gap: 60, w: 110, edge: 'right', motion: { dx: 0, dy: 24, period: 3.6 } },
            { rise: 40, gap: 68, w: 150, edge: 'right' },
        ],
    },
    {
        // Une plateforme claire, une sombre, en alternance : il faut basculer
        // le thème en pleine traversée.
        id: 'alternance',
        tier: 'medium',
        mechanics: ['theme'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 130, theme: 'light' },
            { rise: 48, gap: 70, w: 130, theme: 'dark' },
            { rise: 48, gap: 70, w: 130, theme: 'light' },
            { rise: 48, gap: 70, w: 130, theme: 'dark' },
        ],
        extras: [floorSpikes(200, 700)],
    },
    {
        id: 'guillotine',
        tier: 'medium',
        mechanics: ['motion'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 66, gap: 80, w: 150 },
            { rise: 0, gap: 96, w: 150 },
            { rise: 0, gap: 96, w: 150 },
        ],
        extras: [
            blade(268, 150),
            blade(520, 150, { motion: { dx: 0, dy: 150, period: 2.2, phase: 0.5 } }),
            blade(770, 150, { motion: { dx: 0, dy: 150, period: 2.2, phase: 0.25 } }),
            floorSpikes(180, 660),
        ],
    },
    {
        id: 'serpentin',
        tier: 'medium',
        mechanics: ['resize'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 58, gap: 74, w: 130 },
            { rise: 58, gap: 74, w: 130 },
            { rise: 62, gap: 60, w: 130, turn: true },
            { rise: 58, gap: 74, w: 130 },
            { rise: 62, gap: 60, w: 140, turn: true },
        ],
        extras: [floorSpikes(240, 520)],
    },
    {
        id: 'bascule',
        tier: 'medium',
        mechanics: ['motion', 'edge'],
        reference: REF,
        floor: 'deadly',
        start: { x: 36, up: 60, w: 160 },
        steps: [
            { rise: 42, gap: 60, w: 110, motion: { dx: 0, dy: 28, period: 3.0 } },
            { rise: 42, gap: 60, w: 110, motion: { dx: 0, dy: 28, period: 3.0, phase: 0.5 } },
            { rise: 42, gap: 74, w: 160, edge: 'right' },
        ],
    },
    {
        id: 'jachere',
        tier: 'medium',
        mechanics: ['theme', 'motion'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 76, w: 140, theme: 'light' },
            { rise: 40, gap: 62, w: 110, theme: 'light', motion: { dx: 0, dy: 26, period: 3.2 } },
            { rise: 40, gap: 78, w: 150, theme: 'light' },
        ],
        extras: [floorSpikes(220, 620), blade(430, 120, { theme: 'light' })],
    },
    {
        id: 'cordee',
        tier: 'medium',
        mechanics: ['orbs', 'resize'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 120, orb: true },
            { rise: 58, gap: 74, w: 120, orb: true },
            { rise: 58, gap: 74, w: 120, orb: true },
            { rise: 58, gap: 74, w: 140 },
        ],
        extras: [floorSpikes(220, 620)],
    },
    {
        // Tout pend du haut ET le dernier palier est à droite : la fenêtre doit
        // être basse ET étroite.
        id: 'grenier',
        tier: 'medium',
        mechanics: ['edge'],
        reference: { w: 880, h: 490 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 70, gap: 64, w: 160, vedge: 'top' },
            { rise: 62, gap: 66, w: 150, vedge: 'top' },
            { rise: 62, gap: 66, w: 150, vedge: 'top', edge: 'right' },
        ],
        extras: [floorSpikes(240, 520)],
    },
    {
        id: 'passerelle',
        tier: 'medium',
        mechanics: ['appear', 'edge'],
        reference: { w: 760, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 64, gap: 66, w: 130 },
            { rise: 0, gap: 72, w: 120, when: { maxW: 800 } },
            { rise: 34, gap: 66, w: 130, edge: 'right' },
        ],
        extras: [floorSpikes(240, 340)],
    },
    {
        id: 'tourniquet',
        tier: 'medium',
        mechanics: ['edge'],
        reference: { w: 940, h: 540 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 60, gap: 60, w: 130 },
            { rise: 44, gap: 60, w: 120, edge: 'right', vedge: 'top' },
            { rise: 44, gap: 60, w: 120, vedge: 'top' },
            { rise: 44, gap: 60, w: 130, edge: 'right' },
        ],
        extras: [floorSpikes(240, 480)],
    },
    {
        id: 'cascade',
        tier: 'medium',
        mechanics: ['resize', 'motion'],
        reference: REF,
        start: { x: 60, up: 330, w: 170 },
        steps: [
            { rise: -60, gap: 66, w: 110 },
            { rise: -60, gap: 66, w: 110, motion: { dx: 30, dy: 0, period: 3.4 } },
            { rise: -60, gap: 66, w: 110 },
            { rise: -60, gap: 66, w: 140 },
        ],
        extras: [floorSpikes(300, 200), floorSpikesR(120, 160)],
    },
    {
        // Le passage du milieu ne s'ouvre qu'en dessous de 780 px : la fenêtre
        // doit être franchement étroite.
        id: 'sablier',
        tier: 'medium',
        mechanics: ['appear', 'crush'],
        reference: { w: 720, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 60, gap: 60, w: 120 },
            { rise: 40, gap: 66, w: 110, when: { maxW: 780 } },
            { rise: 40, gap: 60, w: 130, edge: 'right' },
        ],
        extras: [wall('left', 250, 130, { when: { minW: 780 } }), floorSpikes(300, 260)],
    },
    {
        id: 'relais',
        tier: 'medium',
        mechanics: ['orbs', 'motion'],
        reference: REF,
        floor: 'deadly',
        start: { x: 36, up: 60, w: 170 },
        steps: [
            { rise: 42, gap: 60, w: 110, orb: true, motion: { dx: 0, dy: 24, period: 3.2 } },
            { rise: 42, gap: 62, w: 110, orb: true },
            { rise: 42, gap: 60, w: 110, motion: { dx: 24, dy: 0, period: 3.6, phase: 0.4 } },
            { rise: 42, gap: 70, w: 150 },
        ],
    },
    {
        id: 'faille',
        tier: 'medium',
        mechanics: ['resize', 'edge'],
        reference: { w: 940, h: 560 },
        floor: 'deadly',
        start: { x: 36, up: 66, w: 190 },
        steps: [
            { rise: 0, gap: 110, w: 120 },
            { rise: 0, gap: 110, w: 120, edge: 'right' },
            { rise: 0, gap: 100, w: 140, edge: 'right' },
        ],
    },

    // ══ DIFFICILES ══════════════════════════════════════════════════════════
    {
        id: 'vertige',
        tier: 'hard',
        mechanics: ['motion', 'edge'],
        reference: REF,
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 44, gap: 56, w: 96, motion: { dx: 0, dy: 26, period: 3.0 } },
            { rise: 44, gap: 52, w: 96, motion: { dx: 24, dy: 0, period: 3.4, phase: 0.25 } },
            { rise: 44, gap: 52, w: 96, edge: 'right', motion: { dx: 0, dy: 26, period: 2.9, phase: 0.5 } },
            { rise: 44, gap: 66, w: 150, edge: 'right' },
        ],
    },
    {
        // Le niveau a deux visages selon la largeur, et la sortie n'est pas au
        // même endroit dans les deux.
        id: 'dedale',
        tier: 'hard',
        mechanics: ['appear', 'edge'],
        reference: { w: 740, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 62, gap: 60, w: 120 },
            { rise: 40, gap: 66, w: 120, when: { maxW: 800 } },
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
        mechanics: ['orbs', 'motion'],
        reference: REF,
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 44, gap: 58, w: 70, orb: true },
            { rise: 44, gap: 54, w: 70, motion: { dx: 0, dy: 24, period: 3.2 } },
            { rise: 44, gap: 58, w: 70, orb: true },
            { rise: 44, gap: 62, w: 150 },
        ],
    },
    {
        // Un palier accroché en haut entre deux accrochés en bas : l'écart
        // dépend de la hauteur de la fenêtre, et une seule plage laisse passer.
        id: 'contrepoids',
        tier: 'hard',
        mechanics: ['edge'],
        reference: { w: 1000, h: 500 },
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 74, w: 150 },
            { rise: 44, gap: 78, w: 150, vedge: 'top' },
            { rise: 44, gap: 78, w: 160 },
        ],
        extras: [floorSpikes(220, 600)],
    },
    {
        id: 'retour',
        tier: 'hard',
        mechanics: ['rewind', 'motion'],
        reference: REF,
        floor: 'deadly',
        start: { x: 24, up: 56, w: 140 },
        steps: [
            { rise: 40, gap: 52, w: 84, motion: { dx: 0, dy: 24, period: 2.4 } },
            { rise: 40, gap: 50, w: 84, motion: { dx: 22, dy: 0, period: 2.8, phase: 0.33 } },
            { rise: 40, gap: 52, w: 84, motion: { dx: 0, dy: 26, period: 2.6, phase: 0.66 } },
            { rise: 40, gap: 56, w: 96 },
            { rise: 40, gap: 62, w: 140 },
        ],
    },
    {
        id: 'metronome',
        tier: 'hard',
        mechanics: ['motion'],
        reference: REF,
        start: { x: 60, up: 0 },
        steps: [
            { rise: 62, gap: 66, w: 130 },
            { rise: 0, gap: 70, w: 130 },
            { rise: 0, gap: 70, w: 130 },
            { rise: 0, gap: 70, w: 140 },
        ],
        extras: [
            blade(398, 160),
            blade(598, 160, { motion: { dx: 0, dy: 160, period: 2.0, phase: 0.33 } }),
            blade(798, 160, { motion: { dx: 0, dy: 160, period: 2.0, phase: 0.66 } }),
            floorSpikes(180, 700),
        ],
    },
    {
        id: 'eclipse',
        tier: 'hard',
        mechanics: ['theme', 'motion'],
        reference: REF,
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 44, gap: 60, w: 110, theme: 'dark' },
            { rise: 44, gap: 60, w: 110, theme: 'light' },
            { rise: 44, gap: 56, w: 110, theme: 'dark', motion: { dx: 0, dy: 24, period: 3.0 } },
            { rise: 44, gap: 66, w: 150, theme: 'light' },
        ],
    },
    {
        id: 'tenaille',
        tier: 'hard',
        mechanics: ['crush', 'edge', 'appear'],
        reference: { w: 860, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 130 },
            { rise: 44, gap: 72, w: 120, when: { maxW: 900 } },
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
        mechanics: ['resize'],
        reference: { w: 620, h: 640 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 62, gap: 60, w: 110 },
            { rise: 62, gap: 60, w: 110, turn: true },
            { rise: 62, gap: 60, w: 110, turn: true },
            { rise: 62, gap: 60, w: 110, turn: true },
            { rise: 62, gap: 60, w: 130, turn: true },
        ],
        extras: [floorSpikes(180, 300)],
    },
    {
        id: 'gouffre',
        tier: 'hard',
        mechanics: ['motion', 'edge'],
        reference: { w: 1000, h: 560 },
        floor: 'deadly',
        start: { x: 30, up: 60, w: 160 },
        steps: [
            { rise: 0, gap: 92, w: 90, motion: { dx: 0, dy: 22, period: 3.0 } },
            { rise: 0, gap: 92, w: 90, motion: { dx: 0, dy: 22, period: 3.0, phase: 0.5 } },
            { rise: 0, gap: 92, w: 90, edge: 'right', motion: { dx: 0, dy: 22, period: 3.0, phase: 0.25 } },
            { rise: 0, gap: 92, w: 150, edge: 'right' },
        ],
    },
    {
        id: 'spirale',
        tier: 'hard',
        mechanics: ['edge'],
        reference: { w: 900, h: 600 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 74, w: 130 },
            { rise: 46, gap: 74, w: 120, edge: 'right' },
            { rise: 46, gap: 66, w: 120, edge: 'right', turn: true, vedge: 'top' },
            { rise: 46, gap: 70, w: 120, vedge: 'top' },
            { rise: 46, gap: 70, w: 140, turn: true, edge: 'right' },
        ],
        extras: [floorSpikes(220, 460)],
    },
    {
        id: 'veilleuse',
        tier: 'hard',
        mechanics: ['theme', 'appear'],
        reference: { w: 820, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 130, theme: 'dark' },
            { rise: 44, gap: 74, w: 120, theme: 'dark', when: { maxW: 880 } },
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
        mechanics: ['motion'],
        reference: REF,
        floor: 'deadly',
        start: { x: 30, up: 60, w: 150 },
        steps: [
            { rise: 40, gap: 54, w: 100, motion: { dx: 0, dy: 26, period: 2.4 } },
            { rise: 40, gap: 54, w: 100, motion: { dx: 0, dy: 26, period: 2.4, phase: 0.33 } },
            { rise: 40, gap: 54, w: 100, motion: { dx: 0, dy: 26, period: 2.4, phase: 0.66 } },
            { rise: 40, gap: 66, w: 150 },
        ],
    },
    {
        id: 'cordon',
        tier: 'hard',
        mechanics: ['orbs', 'edge'],
        reference: { w: 940, h: 560 },
        start: { x: 50, up: 0 },
        steps: [
            { rise: 60, gap: 70, w: 120, orb: true },
            { rise: 44, gap: 74, w: 120, edge: 'right', orb: true },
            { rise: 44, gap: 70, w: 120, vedge: 'top', orb: true },
            { rise: 44, gap: 70, w: 110, edge: 'right' },
        ],
        goalOn: 0,
        extras: [floorSpikes(240, 460)],
    },
    {
        id: 'abime',
        tier: 'hard',
        mechanics: ['appear', 'motion'],
        reference: { w: 800, h: 560 },
        floor: 'deadly',
        start: { x: 24, up: 60, w: 150 },
        steps: [
            { rise: 40, gap: 50, w: 100, when: { maxW: 860 } },
            { rise: 40, gap: 50, w: 90, motion: { dx: 0, dy: 24, period: 3.0 } },
            { rise: 40, gap: 50, w: 100, when: { maxW: 860 } },
            { rise: 40, gap: 50, w: 120, edge: 'right' },
        ],
    },
    {
        id: 'charniere',
        tier: 'hard',
        mechanics: ['appear', 'edge', 'crush'],
        reference: { w: 720, h: 560 },
        start: { x: 40, up: 0 },
        steps: [
            { rise: 60, gap: 58, w: 110 },
            { rise: 44, gap: 60, w: 110, when: { maxW: 760 } },
            { rise: 44, gap: 56, w: 120, edge: 'right', when: { maxW: 760 } },
        ],
        extras: [
            wall('left', 240, 150, { when: { minW: 760 } }),
            wall('right', 260, 150, { when: { minW: 760 } }),
            floorSpikes(280, 260),
        ],
    },
    {
        id: 'souffle',
        tier: 'hard',
        mechanics: ['motion', 'edge', 'orbs'],
        reference: REF,
        floor: 'deadly',
        start: { x: 24, up: 56, w: 140 },
        steps: [
            { rise: 40, gap: 52, w: 84, orb: true, motion: { dx: 0, dy: 24, period: 2.6 } },
            { rise: 40, gap: 50, w: 84, motion: { dx: 20, dy: 0, period: 3.0, phase: 0.4 } },
            { rise: 40, gap: 52, w: 84, orb: true, motion: { dx: 0, dy: 24, period: 2.6, phase: 0.5 } },
            { rise: 40, gap: 54, w: 90, edge: 'right' },
            { rise: 40, gap: 62, w: 140, edge: 'right' },
        ],
    },
    {
        // Tout à la fois : les bords, le thème, le mouvement, les orbes et le
        // vide. La dernière énigme du catalogue.
        id: 'epilogue',
        tier: 'hard',
        mechanics: ['edge', 'appear', 'theme', 'motion', 'orbs'],
        reference: { w: 880, h: 560 },
        floor: 'deadly',
        start: { x: 24, up: 60, w: 150 },
        steps: [
            { rise: 42, gap: 58, w: 110, theme: 'dark', orb: true },
            { rise: 42, gap: 54, w: 100, motion: { dx: 0, dy: 24, period: 3.0 } },
            { rise: 42, gap: 58, w: 110, when: { maxW: 940 }, orb: true },
            { rise: 42, gap: 64, w: 130, edge: 'right' },
        ],
        extras: [
            slab(anchored(0, 260, 1, -102, 110, 14), { theme: 'light' }),
        ],
    },
];
