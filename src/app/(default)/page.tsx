import { PageChrome } from '@/components/PageChrome';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildJsonLd } from '@/lib/seo';
import { HomeView } from '@/views/HomeView';

export default function Page() {
    return (
        <PageChrome locale={DEFAULT_LOCALE} routeKey="home">
            <HomeView locale={DEFAULT_LOCALE} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildJsonLd(DEFAULT_LOCALE) }} />
        </PageChrome>
    );
}
