import { buildLevel } from '../src/game/build.ts';
import { SPECS } from '../src/data/level-specs.ts';
import { LEVELS } from '../src/data/levels.ts';
import { solve } from '../src/game/solver.ts';
import type { Theme, Viewport } from '../src/game/types.ts';

/**
 * L'AUDIT DES ÉNIGMES.
 *
 * Il ne demande pas « ce niveau est-il finissable ? » — `check-levels` s'en
 * charge — mais « ce niveau EXIGE-T-IL de régler l'écran ? ».
 *
 * Le critère est simple et vérifiable : une énigme qui se termine déjà à la
 * taille de départ, ROTATION INTERDITE, n'oblige à rien.
 *
 * ⚠️ Interdire la rotation est indispensable : sans ça, une énigme qui exige un
 * demi-tour est comptée comme « libre » parce que le solveur pivote tout seul.
 * On lui retire donc la mécanique `gravity` le temps de la mesure. Le joueur traverse sans jamais toucher aux
 * poignées, et la mécanique fondatrice du jeu reste décorative. C'est
 * exactement le défaut que la version précédente avait partout.
 */

const DEFAULT_SCREEN: Viewport = { w: 880, h: 520 };

let libres = 0;
let exigeantes = 0;

for (const level of LEVELS) {
    const spec = SPECS.find((candidate) => candidate.id === level.id)!;
    const frozen = buildLevel({
        ...spec,
        mechanics: spec.mechanics.filter((key) => key !== 'gravity'),
    });
    const themes: Theme[] = level.blocks.some((block) => block.theme) ? ['dark', 'light'] : ['dark'];
    let atDefault = false;
    for (const theme of themes) {
        if (solve(frozen, DEFAULT_SCREEN, theme).solved) {
            atDefault = true;
            break;
        }
    }
    if (atDefault) libres += 1;
    else exigeantes += 1;
    console.log(
        `${atDefault ? '·' : '✓'} ${level.id.padEnd(15)} ${level.tier.padEnd(11)} ${`${level.reference.w}×${level.reference.h}`.padEnd(9)} ${atDefault ? 'se termine sans rien régler' : 'exige un réglage'}`,
    );
}

console.log('');
console.log(`${exigeantes} énigmes exigent de régler l'écran, ${libres} s'en passent.`);
