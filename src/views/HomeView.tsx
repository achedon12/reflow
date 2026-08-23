import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PlayButton } from '@/components/PlayButton';
import { PuzzleProgress } from '@/components/PuzzleGrid';
import { LEVELS } from '@/data/levels';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path } from '@/i18n/routes';

export function HomeView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);
    const first = LEVELS[0]!;

    return (
        <div className="flex flex-col gap-14">
            <section className="flex flex-col gap-5">
                <p className="label text-accent">{d.home.kicker}</p>
                <h1 className="max-w-2xl text-4xl leading-[1.1] text-balance sm:text-5xl">{d.home.title}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{d.home.lede}</p>

                <div className="flex flex-wrap items-center gap-3">
                    <PlayButton puzzleId={first.id}>{d.home.play}</PlayButton>
                    <Link
                        href={path('puzzles', locale)}
                        className="btn"
                    >
                        {d.home.browse}
                        <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                    <Link
                        href={path('endless', locale)}
                        className="inline-flex items-center gap-1.5 px-1 py-2 text-sm text-fg-muted no-underline underline-offset-4 transition-colors hover:text-fg hover:underline"
                    >
                        {d.home.endless}
                    </Link>
                </div>

                <PuzzleProgress dictionary={d.puzzlesPage} total={LEVELS.length} />
            </section>

            {/* Le corps de texte : c'est lui qui décrit le jeu à un moteur de
                recherche, sur une page dont le reste est un bouton. */}
            <div className="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
                {d.home.sections.map((section) => (
                    <section key={section.title} className="flex flex-col gap-2 bg-bg p-6">
                        <h2 className="text-lg">{section.title}</h2>
                        <p className="text-sm leading-relaxed text-fg-muted text-pretty">{section.body}</p>
                    </section>
                ))}
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label={d.header.navLabel}>
                <Link
                    href={path('rules', locale)}
                    className="tap text-sm text-fg no-underline underline-offset-4 hover:text-accent hover:underline"
                >
                    {d.home.rulesLink}
                </Link>
                <Link
                    href={path('mechanics', locale)}
                    className="tap text-sm text-fg no-underline underline-offset-4 hover:text-accent hover:underline"
                >
                    {d.home.mechanicsLink}
                </Link>
            </nav>
        </div>
    );
}
