import { PLAYER_H, PLAYER_W } from './constants';
import type {
    Anchor,
    Block,
    Condition,
    PlayerState,
    Quarter,
    Rect,
    Theme,
    Viewport,
} from './types';

/** Un ancrage en pixels purs, sans aucune part de fenêtre. */
export function fixed(x: number, y: number, w: number, h: number): Anchor {
    return { ax: 0, ay: 0, ox: x, oy: y, aw: 0, ah: 0, ow: w, oh: h };
}

/** Un ancrage dont le coin est repéré depuis un bord. `ax = 1` colle à droite,
 *  `ay = 1` colle en bas — les décalages sont alors négatifs. */
export function anchored(
    ax: number,
    ox: number,
    ay: number,
    oy: number,
    w: number,
    h: number,
): Anchor {
    return { ax, ay, ox, oy, aw: 0, ah: 0, ow: w, oh: h };
}

/**
 * L'aire de jeu vue depuis le repère où la gravité tombe.
 *
 * Un quart de tour impair échange largeur et hauteur : un écran de 1000×560
 * couché devient un puits de 560×1000.
 */
export function playViewport(view: Viewport, quarter: Quarter): Viewport {
    return quarter % 2 === 0 ? { w: view.w, h: view.h } : { w: view.h, h: view.w };
}

/**
 * Transporte un rectangle du monde vers le repère de la gravité.
 *
 * Les quatre cas sont écrits en toutes lettres plutôt que dérivés d'une
 * matrice : ils se relisent, et une erreur de signe dans une matrice de
 * rotation ne se voit qu'en jouant.
 */
export function rotateRect(rect: Rect, view: Viewport, quarter: Quarter): Rect {
    switch (quarter) {
        case 0:
            return rect;
        case 1:
            // Le sol devient le bord GAUCHE du monde.
            return { x: rect.y, y: view.w - rect.x - rect.w, w: rect.h, h: rect.w };
        case 2:
            // Le sol devient le bord HAUT : tout est retourné.
            return { x: view.w - rect.x - rect.w, y: view.h - rect.y - rect.h, w: rect.w, h: rect.h };
        case 3:
            // Le sol devient le bord DROIT.
            return { x: view.h - rect.y - rect.h, y: rect.x, w: rect.h, h: rect.w };
    }
}

/** Le chemin inverse : du repère de la gravité vers le monde. */
export function unrotateRect(rect: Rect, view: Viewport, quarter: Quarter): Rect {
    switch (quarter) {
        case 0:
            return rect;
        case 1:
            return { x: view.w - rect.y - rect.h, y: rect.x, w: rect.h, h: rect.w };
        case 2:
            return { x: view.w - rect.x - rect.w, y: view.h - rect.y - rect.h, w: rect.w, h: rect.h };
        case 3:
            return { x: rect.y, y: view.h - rect.x - rect.w, w: rect.h, h: rect.w };
    }
}

/** Une vitesse suit la même rotation que les positions, sans les décalages. */
export function rotateVelocity(vx: number, vy: number, quarter: Quarter): { vx: number; vy: number } {
    switch (quarter) {
        case 0:
            return { vx, vy };
        case 1:
            return { vx: vy, vy: -vx };
        case 2:
            return { vx: -vx, vy: -vy };
        case 3:
            return { vx: -vy, vy: vx };
    }
}

/**
 * Transporte le joueur d'un repère de gravité à un autre.
 *
 * Sa position dans LE MONDE ne bouge pas : c'est le sol qui change de côté.
 * Sans ce transport, faire pivoter l'écran en plein saut téléporterait le
 * personnage, et le rembobinage ne pourrait plus rien rattraper.
 */
export function reframePlayer(
    player: PlayerState,
    view: Viewport,
    from: Quarter,
    to: Quarter,
): PlayerState {
    if (from === to) return player;
    const world = unrotateRect({ x: player.x, y: player.y, w: PLAYER_W, h: PLAYER_H }, view, from);
    const placed = rotateRect(world, view, to);
    const inWorld = rotateVelocity(player.vx, player.vy, ((4 - from) % 4) as Quarter);
    const moved = rotateVelocity(inWorld.vx, inWorld.vy, to);
    return {
        ...player,
        x: placed.x,
        y: placed.y,
        vx: moved.vx,
        vy: moved.vy,
        // Le sol a changé de côté : ce sur quoi on reposait ne porte plus.
        grounded: false,
        ground: -2,
        coyote: 0,
        chaseX: placed.x,
    };
}

export function resolve(anchor: Anchor, view: Viewport): Rect {
    return {
        x: anchor.ax * view.w + anchor.ox,
        y: anchor.ay * view.h + anchor.oy,
        w: anchor.aw * view.w + anchor.ow,
        h: anchor.ah * view.h + anchor.oh,
    };
}

export function matches(condition: Condition | undefined, view: Viewport): boolean {
    if (!condition) return true;
    if (condition.minW !== undefined && view.w < condition.minW) return false;
    if (condition.maxW !== undefined && view.w > condition.maxW) return false;
    if (condition.minH !== undefined && view.h < condition.minH) return false;
    if (condition.maxH !== undefined && view.h > condition.maxH) return false;
    return true;
}

/**
 * La lame suiveuse est-elle en train de VISER ?
 *
 * Elle vise pendant la moitié haute de son cycle, et se fige pendant la
 * descente. C'est ce délai qui la rend esquivable : elle frappe là où l'on
 * était un instant plus tôt, pas là où l'on est.
 */
export function aiming(block: Block, time: number): boolean {
    if (!block.motion) return true;
    const angle = 2 * Math.PI * (time / block.motion.period + (block.motion.phase ?? 0));
    return Math.sin(angle) < 0;
}

/** Le bloc clignotant est-il là à cet instant ? Pure fonction du temps. */
export function blinking(block: Block, time: number): boolean {
    if (!block.blink) return true;
    const cycle = (time / block.blink.period + (block.blink.phase ?? 0)) % 1;
    return (cycle < 0 ? cycle + 1 : cycle) < block.blink.duty;
}

/**
 * Le rang d'un palier friable parmi les paliers friables — donc son bit.
 *
 * L'index du bloc ne convient pas : il compte aussi les plateformes ordinaires,
 * et le champ déborderait au-delà de trente-deux blocs.
 */
export function crumbleBit(blocks: readonly Block[], index: number): number {
    let bit = 0;
    for (let i = 0; i < index; i += 1) {
        if (blocks[i]!.crumble) bit += 1;
    }
    return bit;
}

/**
 * Le bloc existe-t-il ?
 *
 * `time` et `broken` sont facultatifs : l'aperçu d'un niveau et les indices
 * interrogent la géométrie hors de toute partie, et doivent alors voir un bloc
 * clignotant comme présent plutôt que de tirer à pile ou face.
 */
export function present(
    block: Block,
    view: Viewport,
    theme: Theme,
    time?: number,
    broken?: { blocks: readonly Block[]; index: number; bits: number },
): boolean {
    if (block.theme && block.theme !== theme) return false;
    if (time !== undefined && !blinking(block, time)) return false;
    if (broken && block.crumble) {
        if ((broken.bits & (1 << crumbleBit(broken.blocks, broken.index))) !== 0) return false;
    }
    return matches(block.when, view);
}

/** Le décalage d'un bloc mobile à l'instant `time`. */
export function motionOffset(block: Block, time: number): { x: number; y: number } {
    const motion = block.motion;
    if (!motion) return { x: 0, y: 0 };
    const angle = 2 * Math.PI * (time / motion.period + (motion.phase ?? 0));
    const wave = Math.sin(angle);
    return { x: motion.dx * wave, y: motion.dy * wave };
}

/**
 * Un bloc du niveau, résolu pour une image donnée.
 *
 * `previous` porte la position de l'image PRÉCÉDENTE : c'est elle qui donne le
 * déplacement d'une plateforme mobile, donc ce que le joueur posé dessus doit
 * suivre. Sans elle, on glisserait sur place.
 */
export type SolvedBlock = {
    index: number;
    kind: Block['kind'];
    rect: Rect;
    dx: number;
    dy: number;
    surface?: Block['surface'];
    speed?: number;
    crumble?: boolean;
    force?: number;
};

/**
 * Les blocs du niveau, résolus pour une image.
 *
 * `player` sert à deux choses et n'est pas facultatif en jeu : la lame qui suit
 * se cale sur sa position, et les paliers déjà tombés sortent de la liste. Le
 * bloc reste une PURE FONCTION de l'état du joueur et du temps — c'est ce qui
 * garde le rembobinage et le vérificateur valables.
 */
export function solveBlocks(
    blocks: readonly Block[],
    view: Viewport,
    theme: Theme,
    time: number,
    previousTime: number,
    player?: PlayerState,
    quarter: Quarter = 0,
): SolvedBlock[] {
    const out: SolvedBlock[] = [];
    for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index]!;
        const broken = player ? { blocks, index, bits: player.broken } : undefined;
        // ⚠️ Les conditions de taille (`when`) s'évaluent sur l'écran RÉEL, pas
        // sur sa vue tournée : un écran de 1000×560 reste large de 1000 même
        // couché. La rotation est une commande à part.
        if (!present(block, view, theme, time, broken)) continue;

        // On résout l'ancrage dans le monde, PUIS on bascule dans le repère de
        // la gravité. Le mouvement, lui, s'applique après la rotation : une
        // lame tombe toujours vers le sol courant, quel que soit le quart de
        // tour.
        const base = rotateRect(resolve(block.rect, view), view, quarter);
        const now = motionOffset(block, time);
        const before = motionOffset(block, previousTime);

        let x = base.x + now.x;
        if (block.chase && player) {
            // ⚠️ `chaseX`, pas `player.x` : la lame vise la position qu'elle a
            // RETENUE avant d'amorcer sa descente. Calée sur la position
            // vivante, elle tombait toujours sur la tête — il n'y avait rien à
            // esquiver, et les huit énigmes concernées devenaient insolubles.
            //
            // Bornée par la fenêtre : une lame qui sort du cadre ne menace plus
            // personne.
            const wanted = player.chaseX + PLAYER_W / 2 - base.w / 2;
            x = Math.max(0, Math.min(view.w - base.w, wanted));
        }

        out.push({
            index,
            kind: block.kind,
            rect: { x, y: base.y + now.y, w: base.w, h: base.h },
            dx: now.x - before.x,
            dy: now.y - before.y,
            surface: block.surface,
            speed: block.speed,
            crumble: block.crumble,
            force: block.force,
        });
    }
    return out;
}

export function overlaps(a: Rect, b: Rect): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
