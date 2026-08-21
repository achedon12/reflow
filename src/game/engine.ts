import {
    ACCEL_AIR,
    ACCEL_GROUND,
    COYOTE_TIME,
    FRICTION_GROUND,
    GRAVITY,
    JUMP_BUFFER,
    JUMP_CUT,
    JUMP_VELOCITY,
    MAX_FALL,
    MOVE_SPEED,
    PLAYER_H,
    PLAYER_W,
} from './constants';
import { overlaps, resolve, solveBlocks, type SolvedBlock } from './geometry';
import type { Input, Level, Outcome, PlayerState, Rect, Theme, Viewport } from './types';

export function spawnState(level: Level, view: Viewport): PlayerState {
    const spawn = resolve(level.spawn, view);
    return {
        x: spawn.x,
        y: spawn.y,
        vx: 0,
        vy: 0,
        grounded: false,
        coyote: 0,
        buffer: 0,
        orbs: 0,
        ground: -2,
        time: 0,
    };
}

function playerRect(player: PlayerState): Rect {
    return { x: player.x, y: player.y, w: PLAYER_W, h: PLAYER_H };
}

/** Le nombre d'orbes du niveau. Zéro signifie « la sortie est ouverte ». */
export function orbCount(level: Level): number {
    return level.blocks.filter((block) => block.kind === 'orb').length;
}

function allOrbsTaken(level: Level, player: PlayerState): boolean {
    let index = 0;
    for (const block of level.blocks) {
        if (block.kind !== 'orb') continue;
        if ((player.orbs & (1 << index)) === 0) return false;
        index += 1;
    }
    return true;
}

/** Le rang d'une orbe parmi les orbes, qui est son bit. L'index du bloc ne
 *  convient pas : il compte aussi les plateformes, et le champ déborderait. */
function orbBit(level: Level, blockIndex: number): number {
    let bit = 0;
    for (let i = 0; i < blockIndex; i += 1) {
        if (level.blocks[i]!.kind === 'orb') bit += 1;
    }
    return bit;
}

/**
 * Sépare le joueur des blocs solides après un déplacement de la GÉOMÉTRIE.
 *
 * Ce cas n'existe pas dans un plateformer ordinaire : ici la fenêtre change de
 * taille pendant le jeu, et un mur peut apparaître à l'endroit exact où se
 * trouve le joueur. On le repousse le long de l'axe le moins coûteux, en
 * plusieurs passes parce qu'un dégagement peut en créer un autre.
 *
 * Rendre `false` signifie qu'il n'y a plus de place : c'est l'écrasement.
 */
function separate(player: PlayerState, solids: SolvedBlock[], view: Viewport, floorSolid: boolean): boolean {
    for (let pass = 0; pass < 4; pass += 1) {
        let moved = false;
        for (const solid of solids) {
            const me = playerRect(player);
            if (!overlaps(me, solid.rect)) continue;

            const left = solid.rect.x - (me.x + me.w);
            const right = solid.rect.x + solid.rect.w - me.x;
            const up = solid.rect.y - (me.y + me.h);
            const down = solid.rect.y + solid.rect.h - me.y;

            const dx = Math.abs(left) < Math.abs(right) ? left : right;
            const dy = Math.abs(up) < Math.abs(down) ? up : down;

            if (Math.abs(dx) <= Math.abs(dy)) {
                player.x += dx;
                player.vx = 0;
            } else {
                player.y += dy;
                player.vy = 0;
                if (dy < 0) {
                    player.grounded = true;
                    player.ground = solid.index;
                }
            }
            moved = true;
        }

        if (!moved) {
            // Repoussé hors de la fenêtre : il n'y avait pas d'issue non plus.
            if (player.x < -1 || player.x + PLAYER_W > view.w + 1) return false;
            if (player.y < -1) return false;
            if (floorSolid && player.y + PLAYER_H > view.h + 1) return false;
            return true;
        }
    }
    return false;
}

function collideAxis(
    player: PlayerState,
    solids: SolvedBlock[],
    axis: 'x' | 'y',
    delta: number,
): void {
    if (axis === 'x') player.x += delta;
    else player.y += delta;

    for (const solid of solids) {
        const me = playerRect(player);
        if (!overlaps(me, solid.rect)) continue;

        if (axis === 'x') {
            player.x = delta > 0 ? solid.rect.x - PLAYER_W : solid.rect.x + solid.rect.w;
            player.vx = 0;
        } else {
            if (delta > 0) {
                player.y = solid.rect.y - PLAYER_H;
                player.grounded = true;
                player.ground = solid.index;
            } else {
                player.y = solid.rect.y + solid.rect.h;
            }
            player.vy = 0;
        }
    }
}

export type StepResult = { player: PlayerState; outcome: Outcome };

/**
 * Une image de simulation, à pas FIXE.
 *
 * Pure : mêmes entrées, même sortie, sur toutes les machines. C'est ce qui
 * permet à `scripts/check-levels.mts` de rejouer le moteur dans Node et de
 * prouver qu'une énigme se termine.
 */
export function step(
    level: Level,
    view: Viewport,
    theme: Theme,
    previous: PlayerState,
    input: Input,
    dt: number,
): StepResult {
    const player: PlayerState = { ...previous };
    const previousTime = player.time;
    player.time += dt;

    const blocks = solveBlocks(level.blocks, view, theme, player.time, previousTime);
    const solids = blocks.filter((block) => block.kind === 'solid');

    // Une plateforme mobile emporte ce qui repose dessus. Appliqué AVANT tout
    // le reste : sinon le joueur passe l'image à côté de son support, retombe,
    // et le niveau devient injouable au rythme de l'oscillation.
    if (player.grounded && player.ground >= 0) {
        const carrier = solids.find((solid) => solid.index === player.ground);
        if (carrier) {
            player.x += carrier.dx;
            player.y += carrier.dy;
        }
    }

    if (!separate(player, solids, view, level.floor === 'solid')) {
        return { player, outcome: 'dead-crush' };
    }

    // ── Déplacement horizontal ───────────────────────────────────────────────
    const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const accel = player.grounded ? ACCEL_GROUND : ACCEL_AIR;
    if (direction !== 0) {
        player.vx += direction * accel * dt;
        player.vx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, player.vx));
    } else if (player.grounded) {
        const drop = FRICTION_GROUND * dt;
        player.vx = Math.abs(player.vx) <= drop ? 0 : player.vx - Math.sign(player.vx) * drop;
    }

    // ── Saut ─────────────────────────────────────────────────────────────────
    player.coyote = player.grounded ? COYOTE_TIME : Math.max(0, player.coyote - dt);
    player.buffer = input.jumpPressed ? JUMP_BUFFER : Math.max(0, player.buffer - dt);

    if (player.buffer > 0 && player.coyote > 0) {
        player.vy = -JUMP_VELOCITY;
        player.buffer = 0;
        player.coyote = 0;
        player.grounded = false;
        player.ground = -2;
    }

    // Relâcher en pleine montée écourte le saut. C'est ce qui donne au joueur
    // deux hauteurs avec une seule touche.
    if (!input.jump && player.vy < 0) player.vy *= 1 - (1 - JUMP_CUT) * Math.min(1, dt * 60);

    player.vy = Math.min(MAX_FALL, player.vy + GRAVITY * dt);

    // ── Intégration et collisions, un axe à la fois ──────────────────────────
    player.grounded = false;
    player.ground = -2;

    collideAxis(player, solids, 'x', player.vx * dt);
    player.x = Math.max(0, Math.min(view.w - PLAYER_W, player.x));

    collideAxis(player, solids, 'y', player.vy * dt);

    if (player.y < 0) {
        player.y = 0;
        player.vy = 0;
    }

    if (player.y + PLAYER_H >= view.h) {
        if (level.floor === 'deadly') return { player, outcome: 'dead-fall' };
        player.y = view.h - PLAYER_H;
        player.vy = 0;
        player.grounded = true;
        player.ground = -1;
    }

    // ── Contacts ─────────────────────────────────────────────────────────────
    const me = playerRect(player);

    for (const block of blocks) {
        if (block.kind === 'spike' && overlaps(me, block.rect)) {
            return { player, outcome: 'dead-spike' };
        }
    }

    for (const block of blocks) {
        if (block.kind !== 'orb') continue;
        if (!overlaps(me, block.rect)) continue;
        player.orbs |= 1 << orbBit(level, block.index);
    }

    if (allOrbsTaken(level, player)) {
        for (const block of blocks) {
            if (block.kind === 'goal' && overlaps(me, block.rect)) {
                return { player, outcome: 'won' };
            }
        }
    }

    return { player, outcome: 'playing' };
}
