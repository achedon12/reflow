import { HINT_STEPS } from './constants';
import { matches } from './geometry';
import type { Level, Mechanic, Theme, Viewport } from './types';

/**
 * LES INDICES.
 *
 * Trois échelons, et aucun ne donne la solution :
 *
 *   1. les mécaniques mises en jeu, par leur NOM seul ;
 *   2. ce que chacune fait, dans le texte qui les décrit déjà ailleurs ;
 *   3. le GESTE à essayer, pour la mécanique la plus décisive du niveau.
 *
 * Le troisième reste une invitation — « change de thème », « rétrécis
 * franchement » — jamais une valeur ni une position. Le joueur a toujours
 * l'énigme à faire.
 *
 * ⚠️ Aucun indice n'est écrit ÉNIGME PAR ÉNIGME, et c'est délibéré : cinquante-
 * quatre indices en quatre langues seraient une dette de contenu qui vieillirait
 * mal, et le premier niveau retouché rendrait son indice faux sans que rien ne
 * le signale. Ici tout est dérivé des mécaniques déclarées par le niveau.
 */

/**
 * L'ordre de repli, quand rien ne manque à l'écran.
 *
 * Le redimensionnement ferme la marche : c'est le fond commun à toutes les
 * énigmes, donc le conseil le moins utile quand une autre mécanique est en jeu.
 */
const DECISIVE: readonly Mechanic[] = [
    'theme',
    'appear',
    'crumble',
    'blink',
    'chase',
    'bounce',
    'wind',
    'ice',
    'conveyor',
    'orbs',
    'rewind',
    'crush',
    'edge',
    'motion',
    'resize',
];

/**
 * La mécanique à conseiller, d'après ce qui manque RÉELLEMENT à l'écran.
 *
 * Une simple liste de priorité se trompe : « L'épilogue » déclare le thème ET
 * les apparitions, et la liste choisissait le thème — alors que sur une fenêtre
 * large, ce qui bloque est une travée absente. On regarde donc d'abord si un
 * bloc du niveau est actuellement escamoté, et par quoi.
 *
 * L'ordre du test compte : une taille de fenêtre se corrige d'un geste, un
 * thème d'une touche. On nomme d'abord ce qui demande le geste le plus large.
 */
export function decisiveMechanic(level: Level, view?: Viewport, theme?: Theme): Mechanic {
    if (view) {
        if (level.blocks.some((block) => block.when && !matches(block.when, view))) return 'appear';
    }
    if (theme) {
        if (level.blocks.some((block) => block.theme && block.theme !== theme)) return 'theme';
    }
    return DECISIVE.find((key) => level.mechanics.includes(key)) ?? 'resize';
}

export function hintCount(): number {
    return HINT_STEPS.easy.length;
}

/**
 * Combien d'indices sont proposés, au vu du temps passé et des morts.
 *
 * Les deux signaux sont en OU : le premier atteint débloque l'échelon.
 */
export function unlockedHints(level: Level, seconds: number, deaths: number): number {
    const steps = HINT_STEPS[level.tier];
    let unlocked = 0;
    for (const stepThreshold of steps) {
        if (seconds >= stepThreshold.seconds || deaths >= stepThreshold.deaths) unlocked += 1;
        else break;
    }
    return unlocked;
}
