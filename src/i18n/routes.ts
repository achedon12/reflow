// Import RELATIF : `scripts/gen-nginx-redirects.mts` lit ce module dans Node,
// où l'alias `@/` de Next n'existe pas.
import { PUZZLE_IDS } from '../data/levels';
import { DEFAULT_LOCALE, type Locale } from './config';

export type RouteKey = 'home' | 'rules' | 'mechanics' | 'puzzles' | 'endless' | 'about';

/** Les pages annexes, servies par `[slug]` dans les langues préfixées. */
export const CONTENT_KEYS = ['rules', 'mechanics', 'puzzles', 'endless', 'about'] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

// Slugs TRADUITS : un mot-clé dans l'URL, dans la langue du visiteur.
//
// ⚠️ Toute URL interne passe par `path()`. Écrire `/en/rules/` en dur casse
// silencieusement les hreflang, le sitemap, les redirections nginx et le
// sélecteur de langue, tous construits depuis cette table.
//
// ⚠️ Le nom du dossier de route français DOIT être identique au slug `fr`.
const SLUGS: Record<RouteKey, Record<Locale, string>> = {
    home: { fr: '', en: '', es: '', de: '' },
    rules: { fr: 'regles', en: 'rules', es: 'reglas', de: 'regeln' },
    // La page qui explique ce que le jeu détourne du navigateur. C'est le
    // contenu le plus recherché du site : « jeu qui utilise la fenêtre du
    // navigateur » n'a pas de réponse ailleurs.
    mechanics: { fr: 'mecaniques', en: 'mechanics', es: 'mecanicas', de: 'mechaniken' },
    puzzles: { fr: 'enigmes', en: 'puzzles', es: 'enigmas', de: 'raetsel' },
    endless: { fr: 'infini', en: 'endless', es: 'infinito', de: 'endlos' },
    // `about` dans les QUATRE langues : le mot est compris partout et
    // l'adresse reste la même quel que soit le drapeau choisi. C'est le même
    // choix que sur Azimut — une exception pour cette page-là, pas un
    // renoncement aux slugs traduits.
    about: { fr: 'about', en: 'about', es: 'about', de: 'about' },
};

export function path(key: RouteKey, locale: Locale): string {
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
    const slug = SLUGS[key][locale];
    return slug ? `${prefix}/${slug}/` : `${prefix}/`;
}

export function url(key: RouteKey, locale: Locale, siteUrl: string): string {
    return `${siteUrl.replace(/\/$/, '')}${path(key, locale)}`;
}

/**
 * Le chemin d'une énigme, sous le catalogue de sa langue.
 *
 * ⚠️ Le segment de l'énigme n'est PAS traduit, contrairement à celui du
 * catalogue qui le porte : `/enigmes/lucarne/` et `/en/puzzles/lucarne/`. Un
 * niveau a un nom propre, comme un personnage — le traduire multiplierait par
 * quatre les URL à tenir, pour un gain de mot-clé nul sur un nom inventé.
 */
export function puzzlePath(id: string, locale: Locale): string {
    return `${path('puzzles', locale)}${id}/`;
}

export function puzzleUrl(id: string, locale: Locale, siteUrl: string): string {
    return `${siteUrl.replace(/\/$/, '')}${puzzlePath(id, locale)}`;
}

export function contentParams(): { locale: Locale; slug: string }[] {
    return CONTENT_KEYS.flatMap((key) =>
        (Object.keys(SLUGS[key]) as Locale[])
            .filter((locale) => locale !== DEFAULT_LOCALE)
            .map((locale) => ({ locale, slug: SLUGS[key][locale] })),
    );
}

/** Les paramètres des pages d'énigme dans les langues préfixées. */
export function puzzleParams(): { locale: Locale; slug: string; puzzle: string }[] {
    return (Object.keys(SLUGS.puzzles) as Locale[])
        .filter((locale) => locale !== DEFAULT_LOCALE)
        .flatMap((locale) =>
            PUZZLE_IDS.map((puzzle) => ({ locale, slug: SLUGS.puzzles[locale], puzzle })),
        );
}

export function contentKeyForSlug(locale: Locale, slug: string): ContentKey | null {
    return CONTENT_KEYS.find((key) => SLUGS[key][locale] === slug) ?? null;
}

/** Tous les chemins du site, pour dériver les redirections nginx. */
export function allPaths(): string[] {
    const pages = (Object.keys(SLUGS) as RouteKey[]).flatMap((key) =>
        (Object.keys(SLUGS[key]) as Locale[]).map((locale) => path(key, locale)),
    );
    const puzzles = (Object.keys(SLUGS.puzzles) as Locale[]).flatMap((locale) =>
        PUZZLE_IDS.map((id) => puzzlePath(id, locale)),
    );
    return [...pages, ...puzzles];
}
