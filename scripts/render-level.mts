/**
 * UNE ÉNIGME EN IMAGE, dans l'orientation qu'on lui demande.
 *
 * Écrire un niveau en sauts a un défaut : on ne le voit jamais. Ce script en
 * tire un PNG à la cote de conception — indispensable pour les énigmes à
 * tronçons, dont la moitié du chemin n'a de sens que tournée.
 *
 *   npm run draw charniere:0 charniere:1
 */
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { LEVELS } from '../src/data/levels.ts';
import { playViewport, resolve, rotateRect } from '../src/game/geometry.ts';
import type { Quarter } from '../src/game/types.ts';

const COLOR: Record<string, string> = {
    solid: '#e2e8f0',
    spike: '#f43f5e',
    goal: '#a3e635',
    orb: '#38bdf8',
    wind: '#38bdf822',
};

for (const arg of process.argv.slice(2)) {
    const [id, turn] = arg.split(':');
    const quarter = Number(turn ?? 0) as Quarter;
    const level = LEVELS.find((candidate) => candidate.id === id);
    if (!level) throw new Error(`énigme inconnue : ${id}`);

    const view = level.reference;
    const frame = playViewport(view, quarter);
    const parts = level.blocks.map((block) => {
        const rect = rotateRect(resolve(block.rect, view), view, quarter);
        return `<rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" fill="${COLOR[block.kind] ?? '#94a3b8'}"/>`;
    });
    const spawn = rotateRect(resolve(level.spawn, view), view, quarter);
    parts.push(`<rect x="${spawn.x}" y="${spawn.y}" width="22" height="30" fill="#ffffff"/>`);

    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${frame.w}" height="${frame.h}" viewBox="0 0 ${frame.w} ${frame.h}">` +
        `<rect width="100%" height="100%" fill="#0b1020"/>${parts.join('')}` +
        `<text x="10" y="22" fill="#94a3b8" font-family="monospace" font-size="14">${id} — quart ${quarter}</text></svg>`;

    const file = join(tmpdir(), `reflow-${id}-${quarter}.png`);
    await sharp(Buffer.from(svg)).png().toFile(file);
    console.log(file);
}
