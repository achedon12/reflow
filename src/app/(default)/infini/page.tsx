import type { Metadata } from 'next';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildMetadata } from '@/lib/seo';
import { ContentPage } from '@/views/ContentPage';

// ⚠️ Le nom du dossier EST le slug français : il doit rester identique à
// `SLUGS.endless.fr` dans `src/i18n/routes.ts`. Une divergence donne des liens
// internes vers une page inexistante, sans erreur de construction.
export const metadata: Metadata = buildMetadata(DEFAULT_LOCALE, 'endless');

export default function Page() {
    return <ContentPage locale={DEFAULT_LOCALE} contentKey="endless" />;
}
