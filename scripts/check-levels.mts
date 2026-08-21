import { LEVELS, PUZZLE_IDS } from '../src/data/levels.ts';
import { generateLevel } from '../src/game/generator.ts';
import { MAX_CRUMBLE, PLAYER_H, PLAYER_W } from '../src/game/constants.ts';
import { overlaps, present, resolve } from '../src/game/geometry.ts';
import { REDUCED_MOTION_FACTOR, slowMotion } from '../src/game/reduced-motion.ts';
import { CANDIDATE_VIEWS, solve } from '../src/game/solver.ts';
import type { Level, Theme, Viewport } from '../src/game/types.ts';
import { fr } from '../src/i18n/dictionaries/fr.ts';

/**
 * Le garde-fou du contenu.
 *
 * Un niveau injouable ne se voit pas à la lecture : rien ne plante, il est
 * simplement impossible. Ce script rejoue le moteur physique sur chacun et
 * refuse la construction tant qu'aucune partie ne le termine.
 *
 * Il vérifie aussi ce que le typage ne peut pas : qu'un identifiant est bien
 * une adresse valable, et qu'il existe dans le dictionnaire de référence — une
 * énigme sans texte donnerait une page publiée et vide.
 */

let failures = 0;

function fail(message: string): void {
    console.error(`  ✗ ${message}`);
    failures += 1;
}

// ── Contrôles de forme ──────────────────────────────────────────────────────
console.log('Forme des énigmes');

const seen = new Set<string>();
for (const level of LEVELS) {
    if (!/^[a-z][a-z0-9-]*$/.test(level.id)) {
        fail(`${level.id} : identifiant invalide, il sert de segment d'URL`);
    }
    if (seen.has(level.id)) fail(`${level.id} : identifiant en double`);
    seen.add(level.id);

    if (!level.blocks.some((block) => block.kind === 'goal')) {
        fail(`${level.id} : aucune sortie`);
    }
    if (level.blocks.filter((block) => block.kind === 'orb').length > 8) {
        fail(`${level.id} : plus de 8 orbes, le champ de bits déborde`);
    }
    // ⚠️ Les lames suiveuses partagent `chaseX` dans l'état du joueur : deux
    // dans le même niveau viseraient le même point, ce qui n'a aucun sens.
    if (level.blocks.filter((block) => block.chase).length > 1) {
        fail(`${level.id} : plus d'une lame suiveuse, elles partageraient la même visée`);
    }
    if (level.blocks.filter((block) => block.crumble).length > MAX_CRUMBLE) {
        fail(`${level.id} : plus de ${MAX_CRUMBLE} paliers friables, le champ de bits déborde`);
    }
    if (!(level.id in fr.puzzles)) {
        fail(`${level.id} : absent de \`puzzles\` dans le dictionnaire français`);
    }

    // Le point d'apparition doit être libre à la taille de référence, sinon la
    // partie commence par un écrasement.
    const spawn = resolve(level.spawn, level.reference);
    const box = { x: spawn.x, y: spawn.y, w: PLAYER_W, h: PLAYER_H };
    for (const theme of ['light', 'dark'] as const) {
        for (const block of level.blocks) {
            if (block.kind !== 'solid' && block.kind !== 'spike') continue;
            if (!present(block, level.reference, theme)) continue;
            if (overlaps(box, resolve(block.rect, level.reference))) {
                fail(`${level.id} : le joueur apparaît dans un bloc (thème ${theme})`);
            }
        }
    }
}

// ── Les pièges mobiles menacent-ils quelqu'un ? ─────────────────────────────
//
// ⚠️ CE CONTRÔLE EXISTE À CAUSE D'UN VRAI DÉFAUT. Les lames étaient accrochées
// au HAUT de la fenêtre, tous les paliers pendent du BAS : elles s'arrêtaient
// deux cents pixels au-dessus de la tête du joueur, et s'en éloignaient encore
// dès qu'on agrandissait la fenêtre. Cinq énigmes ont vécu avec des lames
// purement décoratives.
//
// Le reste du vérificateur ne pouvait pas le voir : il prouve qu'un niveau se
// TERMINE, jamais qu'il résiste. Un piège inoffensif rend le niveau plus
// facile, donc il passe en silence — c'est exactement le genre de régression
// qu'aucun test de bout en bout ne rattrape.
for (const level of LEVELS) {
    const bands = level.blocks
        .filter((block) => block.kind === 'solid')
        .map((block) => {
            const rect = resolve(block.rect, level.reference);
            // La bande occupée par un joueur debout dessus.
            return { x: rect.x, w: rect.w, top: rect.y - PLAYER_H, bottom: rect.y };
        });

    for (const block of level.blocks) {
        if (block.kind !== 'spike' || !block.motion) continue;
        const rect = resolve(block.rect, level.reference);
        const lowest = rect.y + rect.h + Math.abs(block.motion.dy);
        const highest = rect.y - Math.abs(block.motion.dy);

        // Une lame qui suit le joueur se place elle-même en X : seule sa course
        // verticale se vérifie.
        const reaches = bands.some(
            (band) =>
                lowest >= band.top &&
                highest <= band.bottom &&
                (block.chase || (rect.x < band.x + band.w + 40 && rect.x + rect.w > band.x - 40)),
        );
        if (!reaches) {
            fail(
                `${level.id} : une lame ne menace personne — sa course s'arrête à y=${Math.round(lowest)}, hors de toute bande de jeu`,
            );
        }
    }
}

for (const key of Object.keys(fr.puzzles)) {
    if (!PUZZLE_IDS.includes(key)) {
        fail(`${key} : décrit dans le dictionnaire mais absent de LEVELS`);
    }
}
console.log(`  ${LEVELS.length} énigmes, ${failures === 0 ? 'forme conforme' : 'erreurs ci-dessus'}`);

// ── Preuve de jouabilité ────────────────────────────────────────────────────
console.log('\nJouabilité (le moteur rejoue chaque énigme)');

function views(level: Level): Viewport[] {
    // La taille de conception d'abord : c'est celle qui doit marcher en
    // général, et l'essayer en premier évite dix recherches inutiles.
    return [level.reference, ...CANDIDATE_VIEWS.filter((view) => view.w !== level.reference.w || view.h !== level.reference.h)];
}

for (const level of LEVELS) {
    const themes: Theme[] = level.blocks.some((block) => block.theme) ? ['dark', 'light'] : ['dark'];
    let solved: { view: Viewport; seconds: number } | null = null;

    for (const view of views(level)) {
        for (const theme of themes) {
            const attempt = solve(level, view, theme);
            if (attempt.solved) {
                solved = { view, seconds: attempt.seconds };
                break;
            }
        }
        if (solved) break;
    }

    if (solved) {
        const size = `${solved.view.w}×${solved.view.h}`;
        console.log(`  ✓ ${level.id.padEnd(13)} ${level.tier.padEnd(7)} ${size.padEnd(9)} ${solved.seconds.toFixed(1)} s`);
    } else {
        fail(`${level.id} : aucune solution trouvée, à aucune des ${views(level).length} tailles essayées`);
    }
}

// ── Le mouvement réduit ─────────────────────────────────────────────────────
// `prefers-reduced-motion` allonge la période des blocs mobiles. Rien ne dit
// a priori qu'un niveau reste finissable une fois ralenti : un saut calé sur
// une phase peut ne plus tomber au même endroit. On le rejoue donc.
console.log('\nMouvement réduit (périodes ×' + REDUCED_MOTION_FACTOR + ')');

const MOVING = LEVELS.filter((level) => level.blocks.some((block) => block.motion));
for (const level of MOVING) {
    const slowed = slowMotion(level);
    const themes: Theme[] = level.blocks.some((block) => block.theme) ? ['dark', 'light'] : ['dark'];
    let solved: Viewport | null = null;
    for (const view of views(level)) {
        for (const theme of themes) {
            if (solve(slowed, view, theme).solved) {
                solved = view;
                break;
            }
        }
        if (solved) break;
    }
    if (solved) {
        console.log(`  ✓ ${level.id.padEnd(13)} ${`${solved.w}×${solved.h}`.padEnd(9)}`);
    } else {
        fail(`${level.id} : plus finissable une fois le mouvement ralenti`);
    }
}
console.log(`  ${MOVING.length} énigmes à mouvement vérifiées`);

// ── Les niveaux générés ─────────────────────────────────────────────────────
// La génération construit le chemin plateforme par plateforme, donc elle est
// finissable par construction. Ce contrôle en apporte la preuve sur un
// échantillon : une erreur de portée passerait sinon inaperçue jusqu'à ce
// qu'un joueur tombe sur la mauvaise graine.
console.log('\nParties générées (échantillon)');

const REFERENCE: Viewport = { w: 1000, h: 560 };
const SAMPLES = [
    { seed: 1, depth: 1 },
    { seed: 7, depth: 2 },
    { seed: 12345, depth: 4 },
    { seed: 999, depth: 6 },
    { seed: 4242, depth: 9 },
    { seed: 31337, depth: 12 },
    { seed: 8, depth: 15 },
];

for (const sample of SAMPLES) {
    const level = generateLevel({ seed: sample.seed, depth: sample.depth, reference: REFERENCE });
    const attempt = solve(level, REFERENCE);
    if (attempt.solved) {
        console.log(
            `  ✓ graine ${String(sample.seed).padEnd(6)} palier ${String(sample.depth).padEnd(3)} ${level.tier.padEnd(7)} ${attempt.seconds.toFixed(1)} s`,
        );
    } else {
        fail(`graine ${sample.seed} palier ${sample.depth} : partie générée insoluble`);
    }
}

console.log('');
if (failures > 0) {
    console.error(`${failures} problème(s). La construction ne doit pas partir en l'état.`);
    process.exit(1);
}
console.log('Toutes les énigmes sont finissables.');
