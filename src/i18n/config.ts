export const LOCALES = ['fr', 'en', 'es', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

// Le français n'est PAS préfixé : il vit sur `/`, les autres sur `/en/`,
// `/es/`, `/de/`.
export const DEFAULT_LOCALE: Locale = 'fr';

// Les seules langues à générer sous le segment `[locale]`. Y laisser le
// français créerait `/fr/`, un doublon exact de `/` que Google pénalise.
export const PREFIXED_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

export function isLocale(value: string): value is Locale {
    return (LOCALES as readonly string[]).includes(value);
}

// Barre finale comprise : `trailingSlash: true` impose cette forme, et une
// canonique qui s'en écarte déclare une URL que le serveur redirige.
export function localePath(locale: Locale): string {
    return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;
}

export function localeUrl(locale: Locale, siteUrl: string): string {
    return `${siteUrl.replace(/\/$/, '')}${localePath(locale)}`;
}

// Endonymes : sinon le sélecteur n'est lisible que par ceux qui n'en ont pas
// besoin.
export const LOCALE_NAMES: Record<Locale, string> = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
};

// Étiquette courte du sélecteur, où le nom complet déborde.
export const LOCALE_SHORT: Record<Locale, string> = {
    fr: 'FR',
    en: 'EN',
    es: 'ES',
    de: 'DE',
};
