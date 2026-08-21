import { LEVELS, PUZZLE_IDS } from '../src/data/levels.ts';
import { generateLevel } from '../src/game/generator.ts';
import { PLAYER_H, PLAYER_W } from '../src/game/constants.ts';
import { overlaps, present, resolve } from '../src/game/geometry.ts';
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
