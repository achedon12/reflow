import type { Metadata } from 'next';
import { LEVELS } from '@/data/levels';
import type { Level } from '@/game/types';
import { getDictionary, type Dictionary } from '@/i18n';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { path, puzzlePath, type ContentKey, type RouteKey } from '@/i18n/routes';
import { AUTHOR, GOOGLE_SITE_VERIFICATION, SITE_URL } from './site';

const OG_LOCALES: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US', es: 'es_ES', de: 'de_DE' };

function alternates(key: RouteKey): Record<string, string> {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) languages[locale] = path(key, locale);
    // `x-default` doit viser une page RÉELLE, pas une redirection.
    languages['x-default'] = path(key, DEFAULT_LOCALE);
    return languages;
}

function puzzleAlternates(id: string): Record<string, string> {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) languages[locale] = puzzlePath(id, locale);
    languages['x-default'] = puzzlePath(id, DEFAULT_LOCALE);
    return languages;
}

/** Le socle commun à toutes les pages. Le reste n'en est qu'une variation. */
function base(locale: Locale, d: Dictionary): Metadata {
    return {
        metadataBase: new URL(SITE_URL),
        keywords: d.meta.keywords,
        applicationName: d.meta.title,
        authors: [{ name: AUTHOR.name, url: AUTHOR.site }],
        creator: AUTHOR.name,
        publisher: AUTHOR.name,
        // Vide, Next n'émet aucune balise — et c'est le comportement voulu :
        // une balise au jeton vide fait ÉCHOUER la vérification au lieu de
        // simplement ne rien faire.
        ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
        formatDetection: { telephone: false, address: false, email: false },
        openGraph: {
            type: 'website',
            siteName: d.meta.title,
            locale: OG_LOCALES[locale],
            alternateLocale: LOCALES.filter((other) => other !== locale).map((other) => OG_LOCALES[other]),
        },
        twitter: { card: 'summary_large_image' },
    };
}

/** La copie propre à chaque page. Une table plutôt qu'une cascade de ternaires :
 *  à six routes, la cascade cachait plus qu'elle ne montrait. */
function copyFor(d: Dictionary, key: RouteKey): { titleTag: string; description: string } {
    switch (key) {
        case 'home':
            return { titleTag: d.meta.titleTag, description: d.meta.description };
        case 'rules':
            return { titleTag: `${d.rules.title} — ${d.meta.title}`, description: d.rules.metaDescription };
        case 'mechanics':
            return {
                titleTag: `${d.mechanicsPage.heading} — ${d.meta.title}`,
                description: d.mechanicsPage.metaDescription,
            };
        case 'puzzles':
            return {
                titleTag: `${d.puzzlesPage.heading} — ${d.meta.title}`,
                description: d.puzzlesPage.metaDescription,
            };
        case 'endless':
            return { titleTag: `${d.endless.title} — ${d.meta.title}`, description: d.endless.metaDescription };
        case 'about':
            return { titleTag: `${d.about.title} — ${d.meta.title}`, description: d.about.metaDescription };
    }
}

export function buildMetadata(locale: Locale, key: RouteKey = 'home'): Metadata {
    const d = getDictionary(locale);
    const copy = copyFor(d, key);
    const common = base(locale, d);

    return {
        ...common,
        title: copy.titleTag,
        description: copy.description,
        alternates: { canonical: path(key, locale), languages: alternates(key) },
        openGraph: {
            ...common.openGraph,
            url: path(key, locale),
            title: copy.titleTag,
            description: copy.description,
            images: [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: d.meta.ogAlt }],
        },
        twitter: {
            ...common.twitter,
            title: copy.titleTag,
            description: copy.description,
            images: [{ url: `/og-${locale}.png`, alt: d.meta.ogAlt }],
        },
    };
}

/**
 * Les métadonnées d'une page d'énigme.
 *
 * Le titre et la description sont COMPOSÉS à partir du nom et du résumé du
 * niveau : c'est ce qui donne cinquante-quatre pages réellement distinctes
 * plutôt que cinquante-quatre variantes d'un même gabarit.
 */
export function buildPuzzleMetadata(locale: Locale, level: Level): Metadata {
    const d = getDictionary(locale);
    const puzzle = d.puzzles[level.id as keyof Dictionary['puzzles']];
    const tier = d.tiers[level.tier];
    const common = base(locale, d);

    const titleTag = format(d.puzzlePage.metaTitle, { name: puzzle.name, tier: tier.toLowerCase() });
    const description = format(d.puzzlePage.metaDescription, {
        brief: puzzle.brief,
        tier: tier.toLowerCase(),
    });

    return {
        ...common,
        title: titleTag,
        description,
        alternates: { canonical: puzzlePath(level.id, locale), languages: puzzleAlternates(level.id) },
        openGraph: {
            ...common.openGraph,
            url: puzzlePath(level.id, locale),
            title: titleTag,
            description,
            images: [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: d.meta.ogAlt }],
        },
        twitter: {
            ...common.twitter,
            title: titleTag,
            description,
            images: [{ url: `/og-${locale}.png`, alt: d.meta.ogAlt }],
        },
    };
}

const authorNode = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#author`,
    name: AUTHOR.name,
    url: AUTHOR.site,
    sameAs: [AUTHOR.site, AUTHOR.github],
} as const;

function gameNode(locale: Locale, d: Dictionary, home: string) {
    return {
        '@type': 'VideoGame',
        '@id': `${SITE_URL}/#game`,
        isPartOf: { '@id': `${home}#website` },
        name: d.meta.title,
        url: home,
        description: d.meta.description,
        inLanguage: locale,
        gamePlatform: 'Web browser',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        playMode: 'SinglePlayer',
        genre: ['Platform game', 'Puzzle'],
        numberOfLevels: LEVELS.length,
        author: { '@id': `${SITE_URL}/#author` },
        // Le prix zéro doit être DÉCLARÉ : sans `offers`, un jeu gratuit n'est
        // pas signalé comme tel dans les résultats.
        offers: {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
        },
    };
}

/**
 * Les données structurées de l'accueil : le site, le jeu, l'auteur.
 *
 * Les trois entités sont liées par `@id` plutôt que dupliquées : sans ce lien,
 * un moteur voit un jeu et un site sans rapport l'un avec l'autre, et
 * n'attache l'auteur ni à l'un ni à l'autre.
 */
export function buildJsonLd(locale: Locale): string {
    const d = getDictionary(locale);
    const home = `${SITE_URL}${path('home', locale)}`;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${home}#website`,
                url: home,
                name: d.meta.title,
                description: d.meta.description,
                inLanguage: locale,
                author: { '@id': `${SITE_URL}/#author` },
                publisher: { '@id': `${SITE_URL}/#author` },
            },
            authorNode,
            gameNode(locale, d, home),
        ],
    });
}

/**
 * Le fil d'Ariane d'une page annexe.
 *
 * C'est ce qui remplace l'URL brute sous le titre dans les résultats de
 * recherche : `Reflow › Les énigmes` plutôt que `reflow.leoderoin.fr/enigmes`.
 */
export function buildBreadcrumbJsonLd(locale: Locale, key: ContentKey): string {
    const d = getDictionary(locale);
    const name = {
        rules: d.rules.title,
        mechanics: d.mechanicsPage.title,
        puzzles: d.puzzlesPage.title,
        endless: d.endless.title,
        about: d.about.title,
    }[key];

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: d.meta.title, item: `${SITE_URL}${path('home', locale)}` },
            { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path(key, locale)}` },
        ],
    });
}

/**
 * Le catalogue, en `ItemList`.
 *
 * Cinquante-quatre entrées nommées et liées : c'est ce qui permet à un moteur
 * de comprendre que la page est un index, et de faire remonter une énigme
 * précise plutôt que la seule page d'accueil.
 */
export function buildPuzzleListJsonLd(locale: Locale): string {
    const d = getDictionary(locale);
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${SITE_URL}${path('puzzles', locale)}#page`,
                url: `${SITE_URL}${path('puzzles', locale)}`,
                name: d.puzzlesPage.heading,
                description: d.puzzlesPage.metaDescription,
                inLanguage: locale,
                isPartOf: { '@id': `${SITE_URL}${path('home', locale)}#website` },
            },
            {
                '@type': 'ItemList',
                '@id': `${SITE_URL}${path('puzzles', locale)}#list`,
                name: d.puzzlesPage.heading,
                numberOfItems: LEVELS.length,
                itemListOrder: 'https://schema.org/ItemListOrderAscending',
                itemListElement: LEVELS.map((level, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: d.puzzles[level.id as keyof Dictionary['puzzles']].name,
                    url: `${SITE_URL}${puzzlePath(level.id, locale)}`,
                })),
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: d.meta.title, item: `${SITE_URL}${path('home', locale)}` },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: d.puzzlesPage.title,
                        item: `${SITE_URL}${path('puzzles', locale)}`,
                    },
                ],
            },
        ],
    });
}

/** Une énigme décrite comme un niveau du jeu, rattachée à lui par `@id`. */
export function buildPuzzleJsonLd(locale: Locale, level: Level): string {
    const d = getDictionary(locale);
    const puzzle = d.puzzles[level.id as keyof Dictionary['puzzles']];
    const url = `${SITE_URL}${puzzlePath(level.id, locale)}`;

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Game',
                '@id': `${url}#level`,
                name: puzzle.name,
                url,
                description: puzzle.brief,
                inLanguage: locale,
                genre: ['Platform game', 'Puzzle'],
                gamePlatform: 'Web browser',
                isPartOf: { '@id': `${SITE_URL}/#game` },
                author: { '@id': `${SITE_URL}/#author` },
                // Le niveau de difficulté n'a pas de propriété dédiée dans le
                // vocabulaire : `additionalProperty` est la façon prévue de
                // porter un attribut que schema.org ne nomme pas.
                additionalProperty: [
                    {
                        '@type': 'PropertyValue',
                        name: d.puzzlePage.tierHeading,
                        value: d.tiers[level.tier],
                    },
                    {
                        '@type': 'PropertyValue',
                        name: d.puzzlePage.mechanicsHeading,
                        value: level.mechanics.map((key) => d.mechanics[key].name).join(', '),
                    },
                ],
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: d.meta.title, item: `${SITE_URL}${path('home', locale)}` },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: d.puzzlePage.breadcrumb,
                        item: `${SITE_URL}${path('puzzles', locale)}`,
                    },
                    { '@type': 'ListItem', position: 3, name: puzzle.name, item: url },
                ],
            },
        ],
    });
}

/**
 * Les règles, en `FAQPage`.
 *
 * Chaque étape du mode d'emploi est une question qu'un joueur pose réellement
 * à un moteur — « comment on joue à … », « à quoi sert … ». C'est la seule
 * page du site dont le contenu a naturellement cette forme.
 */
export function buildRulesJsonLd(locale: Locale): string {
    const d = getDictionary(locale);
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}${path('rules', locale)}#faq`,
        inLanguage: locale,
        mainEntity: d.rules.steps.map((step) => ({
            '@type': 'Question',
            name: step.title,
            acceptedAnswer: { '@type': 'Answer', text: step.body },
        })),
    });
}

/** Les mécaniques, en `FAQPage` elles aussi : six questions, six réponses. */
export function buildMechanicsJsonLd(locale: Locale): string {
    const d = getDictionary(locale);
    const keys = ['resize', 'edge', 'appear', 'motion', 'theme', 'rewind', 'orbs', 'crush'] as const;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}${path('mechanics', locale)}#faq`,
        inLanguage: locale,
        mainEntity: keys.map((key) => ({
            '@type': 'Question',
            name: d.mechanics[key].name,
            acceptedAnswer: { '@type': 'Answer', text: d.mechanics[key].body },
        })),
    });
}
