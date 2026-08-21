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
