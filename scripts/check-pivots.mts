/**
 * LA PREUVE QUE LE QUART DE TOUR EST OBLIGATOIRE.
 *
 * `check-levels` prouve qu'une énigme se TERMINE. Celui-ci prouve qu'elle
 * RÉSISTE : on reconstruit chaque énigme à tronçons sans la mécanique
 * `gravity`, ce qui interdit au vérificateur de pivoter, et on exige qu'il
 * échoue — à la cote de conception comme aux tailles qu'un joueur essaierait
 * pour s'en dispenser.
 *
 * C'est le contrôle qui avait manqué aux cinq premières énigmes tournées :
 * elles se pivotaient une fois au départ, puis se jouaient comme les autres.
 *
 * ⚠️ Une preuve d'impossibilité coûte cher — la recherche ne s'arrête pas sur
 * un succès, elle épuise le faisceau. D'où les processus fils : une énigme par
 * cœur disponible. En série, le contrôle dépasserait l'heure.
 *
 *   npm run pivot              toutes celles qui déclarent la gravité
 *   npm run pivot charniere    une seule, pendant qu'on l'écrit
 */
import { availableParallelism } from 'node:os';
import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';
import { buildLevel } from '../src/game/build.ts';
import { SPECS } from '../src/data/level-specs.ts';
import { solve } from '../src/game/solver.ts';
import type { Viewport } from '../src/game/types.ts';

/** Les tailles qu'un joueur essaierait pour s'épargner le quart de tour. */
// Deux suffisent, et ce sont les deux qui ont servi : la taille de départ du
// jeu, et la plus grande fenêtre plausible. Une preuve d'impossibilité épuise
// le faisceau à chaque taille — en ajouter quatre triplait le contrôle sans
// avoir jamais rien attrapé.
const ESCAPES: Viewport[] = [
    { w: 880, h: 520 },
    { w: 1600, h: 900 },
];

type Verdict = { id: string; tier: string; solved: boolean; escape: Viewport | null; seconds: number };

function prove(id: string): Verdict {
    const spec = SPECS.find((candidate) => candidate.id === id);
    if (!spec) throw new Error(`énigme inconnue : ${id}`);
    const withTurn = solve(buildLevel(spec), spec.reference);
    const flat = buildLevel({ ...spec, mechanics: spec.mechanics.filter((key) => key !== 'gravity') });
    let escape: Viewport | null = null;
    for (const view of [spec.reference, ...ESCAPES]) {
        if (solve(flat, view).solved) {
            escape = view;
            break;
        }
    }
    return { id, tier: spec.tier, solved: withTurn.solved, escape, seconds: withTurn.seconds };
}

function report(verdict: Verdict): boolean {
    const ok = verdict.solved && !verdict.escape;
    const say = !verdict.solved
        ? 'INFINISSABLE même en pivotant'
        : verdict.escape
          ? `se termine SANS pivoter, en ${verdict.escape.w}×${verdict.escape.h}`
          : `${verdict.seconds.toFixed(1)} s, insoluble sans quart de tour`;
    console.log(`  ${ok ? '✓' : '✗'} ${verdict.id.padEnd(13)} ${verdict.tier.padEnd(11)} ${say}`);
    return ok;
}

// ── Le fils : une énigme, un verdict sur stdout ─────────────────────────────
const child = process.argv.indexOf('--one');
if (child !== -1) {
    process.send?.(prove(process.argv[child + 1]!));
    process.exit(0);
}

// ── Le père ────────────────────────────────────────────────────────────────
const asked = process.argv.slice(2);
// Toutes celles qui DÉCLARENT la gravité, pas seulement celles à tronçons :
// trois énigmes se contentent d'un quart de tour au départ, et elles doivent
// prouver la même chose — sans quoi leur mécanique annoncée est un mensonge.
const targets = SPECS.filter(
    (spec) => spec.mechanics.includes('gravity') && (asked.length === 0 || asked.includes(spec.id)),
);
if (targets.length === 0) throw new Error(`aucune énigme à gravité parmi : ${asked.join(', ')}`);

const plural = targets.length > 1 ? 's' : '';
console.log(`Le quart de tour est-il obligatoire ? (${targets.length} énigme${plural})`);

const here = fileURLToPath(import.meta.url);
const lanes = Math.max(1, Math.min(targets.length, availableParallelism() - 2));
const queue = [...targets];
let bad = 0;

await Promise.all(
    Array.from({ length: lanes }, async () => {
        for (let spec = queue.shift(); spec; spec = queue.shift()) {
            const verdict = await new Promise<Verdict>((accept, reject) => {
                const worker = fork(here, ['--one', spec.id], { execPath: process.execPath, execArgv: process.execArgv });
                let answer: Verdict | null = null;
                worker.on('message', (message) => {
                    answer = message as Verdict;
                });
                worker.on('exit', (code) =>
                    answer ? accept(answer) : reject(new Error(`${spec.id} : le fils est mort (code ${code})`)),
                );
            });
            if (!report(verdict)) bad += 1;
        }
    }),
);

console.log('');
if (bad > 0) {
    console.error(`${bad} énigme(s) se terminent sans pivoter. La rotation n'y est qu'un décor.`);
    process.exit(1);
}
console.log(`${targets.length} énigme${plural} : la rotation est indispensable à chacune.`);
