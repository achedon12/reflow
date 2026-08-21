import type { MetadataRoute } from 'next';
import { PUZZLE_IDS } from '@/data/levels';
import { LOCALES } from '@/i18n/config';
import { puzzleUrl, url, type RouteKey } from '@/i18n/routes';
import { SITE_URL } from '@/lib/site';
import { PUZZLES_UPDATED, UPDATED } from '@/lib/updated';

// `output: 'export'` traite les gestionnaires de route comme dynamiques et
// refuse de construire sans cette ligne.
export const dynamic = 'force-static';

// Une entrée par langue ET par page — pages d'énigme comprises, ce qui porte
// le plan du site à deux cent quarante-huit URL.
//
// ⚠️ SANS `alternates` : ils ajoutent des `xhtml:link`, et Chrome désactive son
// visualiseur XML dès qu'un document contient l'espace de noms XHTML. Les
// `hreflang` sont déjà dans le `<head>` de chaque page.
const PAGES: { key: RouteKey; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
    { key: 'home', priority: 1, changeFrequency: 'weekly' },
    { key: 'puzzles', priority: 0.9, changeFrequency: 'weekly' },
    { key: 'endless', priority: 0.7, changeFrequency: 'monthly' },
    { key: 'mechanics', priority: 0.7, changeFrequency: 'monthly' },
    { key: 'rules', priority: 0.6, changeFrequency: 'monthly' },
    { key: 'about', priority: 0.4, changeFrequency: 'monthly' },
    { key: 'legal', priority: 0.2, changeFrequency: 'monthly' },
    { key: 'privacy', priority: 0.2, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = PAGES.flatMap(({ key, priority, changeFrequency }) => {
        const lastModified = new Date(`${UPDATED[key]}T00:00:00Z`);
        return LOCALES.map((locale) => ({
            url: url(key, locale, SITE_URL),
            lastModified,
            changeFrequency,
            priority,
        }));
    });

    // Une énigme change quand SON niveau change, pas quand le site est
    // déployé : d'où une date propre, et une fréquence basse assumée.
    const puzzleModified = new Date(`${PUZZLES_UPDATED}T00:00:00Z`);
    const puzzles = PUZZLE_IDS.flatMap((id) =>
        LOCALES.map((locale) => ({
            url: puzzleUrl(id, locale, SITE_URL),
            lastModified: puzzleModified,
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        })),
    );

    return [...pages, ...puzzles];
}
