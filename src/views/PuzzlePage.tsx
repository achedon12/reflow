import { PageChrome } from '@/components/PageChrome';
import type { Level } from '@/game/types';
import type { Locale } from '@/i18n/config';
import { buildPuzzleJsonLd } from '@/lib/seo';
import { PuzzleView } from './PuzzleView';

export function PuzzlePage({ locale, level }: { locale: Locale; level: Level }) {
    return (
        <PageChrome locale={locale} routeKey="puzzles" puzzleId={level.id}>
            <PuzzleView locale={locale} level={level} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildPuzzleJsonLd(locale, level) }}
            />
        </PageChrome>
    );
}
