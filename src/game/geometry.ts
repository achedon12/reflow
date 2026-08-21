import type { Anchor, Block, Condition, Rect, Theme, Viewport } from './types';

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

/** Une bande qui traverse toute la largeur de la fenêtre. */
export function band(ay: number, oy: number, h: number, insetLeft = 0, insetRight = 0): Anchor {
    return { ax: 0, ay, ox: insetLeft, oy, aw: 1, ah: 0, ow: -(insetLeft + insetRight), oh: h };
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

export function present(block: Block, view: Viewport, theme: Theme): boolean {
    if (block.theme && block.theme !== theme) return false;
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
};

export function solveBlocks(
    blocks: readonly Block[],
    view: Viewport,
    theme: Theme,
    time: number,
    previousTime: number,
): SolvedBlock[] {
    const out: SolvedBlock[] = [];
    for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index]!;
        if (!present(block, view, theme)) continue;
        const base = resolve(block.rect, view);
        const now = motionOffset(block, time);
        const before = motionOffset(block, previousTime);
        out.push({
            index,
            kind: block.kind,
            rect: { x: base.x + now.x, y: base.y + now.y, w: base.w, h: base.h },
            dx: now.x - before.x,
            dy: now.y - before.y,
        });
    }
    return out;
}

export function overlaps(a: Rect, b: Rect): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
