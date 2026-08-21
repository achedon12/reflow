import { PLAYER_W } from './constants';
import type { Anchor, Block, Condition, PlayerState, Rect, Theme, Viewport } from './types';

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
): SolvedBlock[] {
    const out: SolvedBlock[] = [];
    for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index]!;
        const broken = player ? { blocks, index, bits: player.broken } : undefined;
        if (!present(block, view, theme, time, broken)) continue;

        const base = resolve(block.rect, view);
        const now = motionOffset(block, time);
        const before = motionOffset(block, previousTime);

        let x = base.x + now.x;
        if (block.chase && player) {
            // Centrée sur le joueur, mais bornée par la fenêtre : une lame qui
            // sort du cadre ne menace plus personne.
            const wanted = player.x + PLAYER_W / 2 - base.w / 2;
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
