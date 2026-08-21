import { PageChrome } from '@/components/PageChrome';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import type { ContentKey } from '@/i18n/routes';
import {
    buildBreadcrumbJsonLd,
    buildMechanicsJsonLd,
    buildPuzzleListJsonLd,
    buildRulesJsonLd,
} from '@/lib/seo';
import { AboutView } from './AboutView';
import { EndlessView } from './EndlessView';
import { MechanicsView } from './MechanicsView';
import { PuzzlesView } from './PuzzlesView';
import { RulesView } from './RulesView';
import { TextPageView } from './TextPageView';

/**
 * Le corps des pages annexes, partagé par les DEUX racines : le groupe
 * français, qui a un dossier par page, et le segment `[locale]/[slug]` qui
 * sert les trois autres langues. Sans ce partage, chaque page existerait en
 * deux exemplaires qui finiraient par diverger.
 */
export function ContentPage({ locale, contentKey }: { locale: Locale; contentKey: ContentKey }) {
    // Le catalogue porte déjà son propre fil d'Ariane dans son `@graph` : en
    // ajouter un second déclarerait deux fois la même chose.
    const scripts =
        contentKey === 'puzzles'
            ? [buildPuzzleListJsonLd(locale)]
            : [
                  buildBreadcrumbJsonLd(locale, contentKey),
                  ...(contentKey === 'rules' ? [buildRulesJsonLd(locale)] : []),
                  ...(contentKey === 'mechanics' ? [buildMechanicsJsonLd(locale)] : []),
              ];

    return (
        <PageChrome locale={locale} routeKey={contentKey}>
            {contentKey === 'rules' && <RulesView locale={locale} />}
            {contentKey === 'mechanics' && <MechanicsView locale={locale} />}
            {contentKey === 'puzzles' && <PuzzlesView locale={locale} />}
            {contentKey === 'endless' && <EndlessView dictionary={getDictionary(locale)} />}
            {contentKey === 'about' && <AboutView locale={locale} />}
            {(contentKey === 'legal' || contentKey === 'privacy') && (
                <TextPageView locale={locale} page={contentKey} />
            )}

            {scripts.map((json, index) => (
                <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
            ))}
        </PageChrome>
    );
}
