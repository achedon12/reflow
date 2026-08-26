/**
 * L'AUDIT DES ÉNIGMES.
 *
 * Il ne demande pas « ce niveau est-il finissable ? » — `check-levels` s'en
 * charge — mais « ce niveau EXIGE-T-IL quelque chose du joueur ? ».
 *
 * Le critère est simple et vérifiable : une énigme qui se termine déjà à la
 * taille de DÉPART, rotation interdite, n'oblige à rien. Le joueur la traverse
 * sans jamais toucher aux poignées, et la mécanique fondatrice du jeu reste
 * décorative.
 *
 * ⚠️ Interdire la rotation est indispensable : sans ça, une énigme qui exige un
 * quart de tour serait comptée comme « libre », parce que le vérificateur
 * pivote tout seul.
 *
 * Ce n'est pas un contrôle qui échoue : c'est une MESURE. Neuf énigmes faciles
 * sans exigence, ce sont neuf énigmes qui apprennent à jouer.
 */
import { fileURLToPath } from 'node:url';
import { SPECS } from '../src/data/level-specs.ts';
import type { Viewport } from '../src/game/types.ts';
import { fanOut } from './parallel.mts';
import type { Job, Verdict } from './solve-worker.mts';

const WORKER = fileURLToPath(new URL('solve-worker.mts', import.meta.url));

/** La taille que l'écran de jeu prend au lancement. */
const DEFAULT_SCREEN: Viewport = { w: 880, h: 520 };

const jobs: Job[] = SPECS.map((spec) => ({ kind: 'free', id: spec.id, view: DEFAULT_SCREEN }));
const tierOf = new Map(SPECS.map((spec) => [spec.id, spec.tier]));

const free: string[] = [];
let demanding = 0;

console.log(`Que demandent les ${jobs.length} énigmes ? (taille de départ ${DEFAULT_SCREEN.w}×${DEFAULT_SCREEN.h})\n`);

await fanOut<Job, Verdict>(WORKER, jobs, (verdict) => {
    const tier = tierOf.get(verdict.label) ?? '?';
    if ('failed' in verdict) {
        demanding += 1;
        console.log(`  ✓ ${verdict.label.padEnd(15)} ${tier.padEnd(11)} exige un réglage`);
    } else {
        free.push(`${verdict.label} (${tier})`);
        console.log(`  · ${verdict.label.padEnd(15)} ${tier.padEnd(11)} se termine sans rien régler`);
    }
});

console.log('');
console.log(`${demanding} énigmes exigent un réglage, ${free.length} s'en passent.`);
if (free.length > 0) console.log(`  ${free.join(', ')}`);
