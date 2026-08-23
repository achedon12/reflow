import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LevelPreview } from '@/components/LevelPreview';
import { PlayButton } from '@/components/PlayButton';
import { PuzzleRecordLine } from '@/components/PuzzleRecordLine';
import { LEVELS } from '@/data/levels';
import type { Level } from '@/game/types';
import { getDictionary, type Dictionary } from '@/i18n';
import { format } from '@/i18n/format';
import type { Locale } from '@/i18n/config';
import { path, puzzlePath } from '@/i18n/routes';

/**
 * La page d'une énigme.
 *
 * Elle existe pour DEUX raisons, et la seconde n'est pas moins importante :
 * donner une adresse à chaque niveau pour qu'on puisse le partager, et donner
 * au site cinquante-quatre pages de contenu réel plutôt qu'une seule page
 * portant un bouton.
 */
export function PuzzleView({ locale, level }: { locale: Locale; level: Level }) {
    const d = getDictionary(locale);
    const puzzle = d.puzzles[level.id as keyof Dictionary['puzzles']];
    const index = LEVELS.findIndex((candidate) => candidate.id === level.id);
    const previous = LEVELS[index - 1];
    const following = LEVELS[index + 1];

    return (
        <article className="flex flex-col gap-10">
            <nav aria-label={d.puzzlePage.breadcrumb} className="label text-fg-muted">
                <Link href={path('puzzles', locale)} className="tap text-fg-muted no-underline hover:text-fg">
                    {d.puzzlePage.breadcrumb}
                </Link>
                <span aria-hidden="true" className="mx-2 text-border-strong">
                    /
                </span>
                <span className="text-fg">{puzzle.name}</span>
            </nav>

            <header className="flex flex-col gap-4">
                <p className="label text-accent">{d.tiers[level.tier]}</p>
                <h1 className="text-3xl text-balance sm:text-4xl">{puzzle.name}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{puzzle.brief}</p>
                <div className="flex flex-wrap items-center gap-3">
                    <PlayButton puzzleId={level.id}>{d.puzzlePage.play}</PlayButton>
                    <PuzzleRecordLine dictionary={d.puzzlePage} puzzleId={level.id} />
                </div>
            </header>

            <section className="flex flex-col gap-2">
                <h2 className="label text-fg-muted">{d.puzzlePage.previewHeading}</h2>
                <LevelPreview level={level} label={format(d.puzzlePage.previewAlt, { name: puzzle.name })} />
                <p className="text-xs text-fg-muted">{d.puzzlePage.previewNote}</p>
            </section>

            <dl className="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
                <div className="bg-bg p-5">
                    <dt className="label text-fg-muted">{d.puzzlePage.tierHeading}</dt>
                    <dd className="mt-1 text-fg">{d.tiers[level.tier]}</dd>
                </div>
                <div className="bg-bg p-5">
                    <dt className="label text-fg-muted">{d.game.size}</dt>
                    <dd className="numeric mt-1 text-fg">
                        {level.reference.w}×{level.reference.h}
                    </dd>
                </div>
            </dl>

            <section>
                <h2 className="label text-fg-muted">{d.puzzlePage.mechanicsHeading}</h2>
                <ul className="mt-3 grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
                    {level.mechanics.map((key) => (
                        <li key={key} className="bg-bg p-5">
                            <h3 className="font-medium text-fg">{d.mechanics[key].name}</h3>
                            <p className="mt-1 text-sm text-fg-muted text-pretty">{d.mechanics[key].body}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <nav className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
                {previous ? (
                    <Link
                        href={puzzlePath(previous.id, locale)}
                        className="tap inline-flex items-center gap-1.5 text-sm text-fg-muted no-underline hover:text-fg"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        {d.puzzlePage.previous}
                    </Link>
                ) : (
                    <span />
                )}
                {following && (
                    <Link
                        href={puzzlePath(following.id, locale)}
                        className="tap inline-flex items-center gap-1.5 text-sm text-fg-muted no-underline hover:text-fg"
                    >
                        {d.puzzlePage.next}
                        <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                )}
            </nav>
        </article>
    );
}
