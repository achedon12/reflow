import type { MetadataRoute } from 'next';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE } from '@/i18n/config';

export const dynamic = 'force-static';

// Un seul manifeste, en français : la spécification n'en prévoit qu'un par
// origine, et rien ne permet d'en servir une variante par langue en export
// statique.
export default function manifest(): MetadataRoute.Manifest {
    const d = getDictionary(DEFAULT_LOCALE);
    return {
        name: d.meta.titleTag,
        short_name: d.meta.shortName,
        description: d.meta.description,
        lang: DEFAULT_LOCALE,
        start_url: '/',
        display: 'standalone',
        background_color: '#0b0d12',
        theme_color: '#5b21ff',
        categories: ['games'],
        icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    };
}
