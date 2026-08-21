import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PuzzleGrid, PuzzleProgress } from '@/components/PuzzleGrid';
import { LEVELS } from '@/data/levels';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path } from '@/i18n/routes';

export function PuzzlesView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-3">
                <h1 className="max-w-2xl text-3xl text-balance sm:text-4xl">{d.puzzlesPage.heading}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{d.puzzlesPage.lede}</p>
                <PuzzleProgress dictionary={d} total={LEVELS.length} />
            </header>

            <PuzzleGrid locale={locale} dictionary={d} />

            <section className="border border-border-subtle p-6">
                <h2 className="text-lg">{d.puzzlesPage.endlessTitle}</h2>
                <p className="mt-2 max-w-xl text-sm text-fg-muted text-pretty">{d.puzzlesPage.endlessBody}</p>
                <Link
                    href={path('endless', locale)}
                    className="mt-4 inline-flex items-center gap-1.5 border border-border-strong px-3 py-2 text-sm text-fg no-underline transition-colors hover:bg-bg-sunken"
                >
                    {d.puzzlesPage.endlessCta}
                    <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
            </section>
        </div>
    );
}
