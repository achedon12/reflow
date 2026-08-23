import type { Locale } from './config';
import { fr, type Dictionary } from './dictionaries/fr';
import { en } from './dictionaries/en';
import { es } from './dictionaries/es';
import { de } from './dictionaries/de';

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, es, de };

export function getDictionary(locale: Locale): Dictionary {
    return DICTIONARIES[locale];
}

export type { Dictionary };

/**
 * LE STRICT NÉCESSAIRE À L'AIRE DE JEU.
 *
 * L'aire de jeu est un composant client, monté sur les 432 pages : tout ce
 * qu'on lui passe est SÉRIALISÉ dans le HTML de chacune. Lui donner le
 * dictionnaire entier y recopiait les cent résumés d'énigmes — treize kilo-
 * octets par page, pour afficher un seul titre.
 *
 * Elle a besoin des textes du jeu, des indices, des mécaniques, du mode infini,
 * et du NOM des énigmes — jamais de leur résumé, qui appartient à la page.
 */
export type GameStrings = Pick<Dictionary, 'endless' | 'game' | 'hints' | 'mechanics'> & {
    titles: Record<string, string>;
};

export function getGameStrings(locale: Locale): GameStrings {
    const d = getDictionary(locale);
    const titles: Record<string, string> = {};
    for (const [id, puzzle] of Object.entries(d.puzzles)) titles[id] = puzzle.name;
    return { endless: d.endless, game: d.game, hints: d.hints, mechanics: d.mechanics, titles };
}
