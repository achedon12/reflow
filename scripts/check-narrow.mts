/**
 * À QUELLE RÉDUCTION UNE ÉNIGME SE JOUE-T-ELLE SUR UN TÉLÉPHONE ?
 *
 * L'écran de jeu n'est plus bridé par la fenêtre : plus grand qu'elle, il
 * s'affiche RÉDUIT. Un téléphone peut donc régler un écran de 1000 × 560 — il
 * le voit à 0,36. La question n'est plus « l'énigme tient-elle ? » mais « la
 * voit-on encore ? ».
 *
 * Le seuil est le personnage. Il fait 22 × 30 px de jeu ; en dessous de dix
 * pixels physiques de large, on ne le distingue plus de ce qu'il touche, et le
 * jeu devient un exercice de foi.
 *
 *   npm run narrow
 */
import { LEVELS } from '../src/data/levels.ts';
import { PLAYER_W } from '../src/game/constants.ts';
import type { Viewport } from '../src/game/types.ts';

/** L'écran de jeu que laisse un téléphone courant, marges déduites. */
const PHONE: Viewport = { w: 358, h: 690 };

/** En dessous, le personnage passe sous dix pixels physiques. */
const FLOOR = 10 / PLAYER_W;

/** Ce qu'un joueur voit s'il règle l'écran à la cote de conception. Coucher
 *  l'écran échange les axes : c'est souvent ce qui sauve la lisibilité, une
 *  énigme large tenant mieux dans la hauteur d'un téléphone. */
function zoomOn(reference: Viewport): number {
    const upright = Math.min(1, PHONE.w / reference.w, PHONE.h / reference.h);
    const laid = Math.min(1, PHONE.w / reference.h, PHONE.h / reference.w);
    return Math.max(upright, laid);
}

const rows = LEVELS.map((level) => ({ level, zoom: zoomOn(level.reference) })).sort(
    (a, b) => a.zoom - b.zoom,
);
const cramped = rows.filter((row) => row.zoom < FLOOR);

console.log(`Lisibilité sur téléphone (écran de jeu ${PHONE.w}×${PHONE.h})\n`);
for (const { level, zoom } of rows.slice(0, 8)) {
    console.log(
        `  ${zoom < FLOOR ? '✗' : '·'} ${level.id.padEnd(15)} ${`${level.reference.w}×${level.reference.h}`.padEnd(9)} réduite à ${zoom.toFixed(2)} — personnage de ${Math.round(PLAYER_W * zoom)} px`,
    );
}
console.log(`  … ${rows.length - 8} autres, toutes plus larges à l'écran`);

console.log('');
console.log(
    `La plus réduite tombe à ${rows[0]!.zoom.toFixed(2)} (personnage de ${Math.round(PLAYER_W * rows[0]!.zoom)} px).`,
);
if (cramped.length > 0) {
    console.error(
        `\n${cramped.length} énigme(s) passent sous ${Math.round(PLAYER_W * FLOOR)} px de personnage : ${cramped.map((row) => row.level.id).join(', ')}`,
    );
    process.exit(1);
}
console.log(`Les ${rows.length} restent lisibles.`);
