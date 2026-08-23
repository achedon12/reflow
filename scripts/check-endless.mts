/**
 * LA PREUVE DES PARTIES ENGENDRÉES.
 *
 * Les cent énigmes écrites à la main sont rejouées une par une. Les parties
 * infinies, elles, n'existent pas encore quand on construit le site : il faut
 * donc prouver le GÉNÉRATEUR, pas ses sorties.
 *
 * On échantillonne : une grille de graines par palier, rejouée par le moteur.
 * Ça ne prouve pas que toutes les graines se terminent — il y en a quatre
 * milliards — mais une matière mal posée casse une graine sur trois, pas une
 * sur mille. L'échantillon la trouve.
 *
 * ⚠️ C'est ce contrôle qui autorise à enrichir le générateur. Sans lui, ajouter
 * la glace ou les paliers friables aux parties infinies revient à publier des
 * niveaux que personne n'a jamais joués.
 *
 *   npm run endless          la grille complète
 *   npm run endless 240      une grille plus large, avant de pousser
 */
import { fileURLToPath } from 'node:url';
import { fanOut } from './parallel.mts';
import type { Job, Verdict } from './solve-worker.mts';
import type { Viewport } from '../src/game/types.ts';

const WORKER = fileURLToPath(new URL('solve-worker.mts', import.meta.url));

/**
 * Les cotes pour lesquelles une partie est dessinée.
 *
 * Ce n'est plus la fenêtre mais l'ÉCRAN DE JEU au lancement : 880 × 520 sur un
 * ordinateur, la largeur du téléphone moins ses marges sur un mobile. Les deux
 * doivent tenir — un générateur qui ne sait construire que sur un grand écran
 * rend le mode infini injouable sur la moitié des visites.
 */
const VIEWS: Viewport[] = [
    { w: 880, h: 520 },
    { w: 358, h: 690 },
];

/** Jusqu'où monter dans la série. Au-delà du quinzième palier le générateur ne
 *  change plus de régime : il pose seulement plus de paliers. */
const DEPTHS = [1, 2, 3, 4, 6, 8, 9, 10, 12, 14, 16, 18];

const wanted = Number(process.argv[2]) || 192;
const perDepth = Math.max(1, Math.round(wanted / DEPTHS.length));

// Des graines ÉTALÉES plutôt que 1, 2, 3… : les graines voisines partagent
// leurs premiers tirages, et un échantillon de graines voisines mesure une
// seule partie vue douze fois.
const jobs: Job[] = [];
for (const depth of DEPTHS) {
    for (let i = 0; i < perDepth; i += 1) {
        const seed = (i * 2654435761 + depth * 40503) >>> 8;
        jobs.push({ kind: 'seed', seed, depth, view: VIEWS[i % VIEWS.length]! });
    }
}

console.log(
    `Parties engendrées — ${jobs.length} graines sur ${DEPTHS.length} paliers, ` +
        `moitié en ${VIEWS[0]!.w}×${VIEWS[0]!.h}, moitié en ${VIEWS[1]!.w}×${VIEWS[1]!.h}`,
);

let failed = 0;
let slowest = { label: '', seconds: 0 };
const perTier = new Map<string, number>();

await fanOut<Job, Verdict>(WORKER, jobs, (verdict) => {
    if ('failed' in verdict) {
        failed += 1;
        console.error(`  ✗ ${verdict.label} : ${verdict.failed}`);
        return;
    }
    perTier.set(verdict.tier, (perTier.get(verdict.tier) ?? 0) + 1);
    if (verdict.seconds > slowest.seconds) slowest = { label: verdict.label, seconds: verdict.seconds };
});

console.log('');
console.log(
    [...perTier].map(([tier, count]) => `${count} ${tier}`).join(', ') +
        ` — la plus longue : ${slowest.label.trim()} en ${slowest.seconds.toFixed(1)} s`,
);
if (failed > 0) {
    console.error(`\n${failed} graine(s) sur ${jobs.length} ne se terminent pas. Le générateur ment.`);
    process.exit(1);
}
console.log(`\nLes ${jobs.length} graines se terminent.`);
