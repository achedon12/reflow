/**
 * LA PREUVE QUE LE QUART DE TOUR EST OBLIGATOIRE.
 *
 * `check-levels` prouve qu'une énigme se TERMINE. Celui-ci prouve qu'elle
 * RÉSISTE : on reconstruit chaque énigme sans la mécanique `gravity`, ce qui
 * interdit au vérificateur de pivoter, et on exige qu'il échoue — à la cote de
 * conception comme aux tailles qu'un joueur essaierait pour s'en dispenser.
 *
 * C'est le contrôle qui avait manqué aux cinq premières énigmes tournées :
 * elles se pivotaient une fois au départ, puis se jouaient comme les autres.
 *
 *   npm run pivot              toutes celles qui déclarent la gravité
 *   npm run pivot charniere    une seule, pendant qu'on l'écrit
 */
import { fileURLToPath } from 'node:url';
import { fanOut, serveWorker } from './parallel.mts';
import { buildLevel } from '../src/game/build.ts';
import { SPECS } from '../src/data/level-specs.ts';
import { solve } from '../src/game/solver.ts';
import type { Viewport } from '../src/game/types.ts';

// Deux tailles suffisent, et ce sont les deux qui ont servi : celle où le jeu
// démarre, et la plus grande fenêtre plausible. Une preuve d'impossibilité
// épuise le faisceau à chaque taille — en ajouter quatre triplait le contrôle
// sans avoir jamais rien attrapé.
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

if (process.argv.includes('--worker')) {
    serveWorker<string, Verdict>(prove);
} else {
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

    let bad = 0;
    await fanOut<string, Verdict>(
        fileURLToPath(import.meta.url),
        targets.map((spec) => spec.id),
        (verdict) => {
            const ok = verdict.solved && !verdict.escape;
            if (!ok) bad += 1;
            const say = !verdict.solved
                ? 'INFINISSABLE même en pivotant'
                : verdict.escape
                  ? `se termine SANS pivoter, en ${verdict.escape.w}×${verdict.escape.h}`
                  : `${verdict.seconds.toFixed(1)} s, insoluble sans quart de tour`;
            console.log(`  ${ok ? '✓' : '✗'} ${verdict.id.padEnd(13)} ${verdict.tier.padEnd(11)} ${say}`);
        },
    );

    console.log('');
    if (bad > 0) {
        console.error(`${bad} énigme(s) se terminent sans pivoter. La rotation n'y est qu'un décor.`);
        process.exit(1);
    }
    console.log(`${targets.length} énigme${plural} : la rotation est indispensable à chacune.`);
}
