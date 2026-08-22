'use client';

import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { LEVELS_BY_TIER, TIER_ORDER } from '@/data/levels';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { puzzlePath } from '@/i18n/routes';
import { PlayButton } from './PlayButton';
import { useProgress } from './useProgress';

const TIER_LABEL = (d: Dictionary) => ({
    easy: d.tiers.easyPlural,
    medium: d.tiers.mediumPlural,
    hard: d.tiers.hardPlural,
    impossible: d.tiers.impossiblePlural,
});

export function PuzzleGrid({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
    const progress = useProgress();
    const labels = TIER_LABEL(dictionary);

    return (
        <div className="flex flex-col gap-10">
            {TIER_ORDER.map((tier) => (
                <section key={tier} aria-labelledby={`tier-${tier}`}>
                    <h2 id={`tier-${tier}`} className="label flex items-baseline gap-3 text-fg">
                        {labels[tier]}
                        <span className="numeric text-fg-muted">{LEVELS_BY_TIER[tier].length}</span>
                    </h2>

                    <ul className="mt-4 grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-3">
                        {LEVELS_BY_TIER[tier].map((level) => {
                            const puzzle = dictionary.puzzles[level.id as keyof Dictionary['puzzles']];
                            const record = progress.puzzles[level.id];
                            return (
                                <li key={level.id} className="flex flex-col gap-2 bg-bg p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <Link
                                            href={puzzlePath(level.id, locale)}
                                            className="group text-fg no-underline"
                                        >
                                            <span className="font-medium group-hover:text-accent">
                                                {puzzle.name}
                                            </span>
                                            <ArrowUpRight
                                                aria-hidden="true"
                                                className="ml-1 inline size-3.5 text-fg-muted transition-transform group-hover:translate-x-0.5"
                                            />
                                        </Link>
                                        {record && (
                                            <span
                                                className="numeric flex shrink-0 items-center gap-1 text-[0.7rem] text-goal-ink"
                                                title={dictionary.puzzlesPage.statusDone}
                                            >
                                                <Check aria-hidden="true" className="size-3.5" />
                                                {record.time.toFixed(2)} s
                                            </span>
                                        )}
                                    </div>

                                    <p className="flex-1 text-sm text-fg-muted">{puzzle.brief}</p>

                                    <p className="flex flex-wrap gap-1.5">
                                        {level.mechanics.map((key) => (
                                            <span
                                                key={key}
                                                className="label border border-border-subtle px-1.5 py-0.5 text-[0.6rem] text-fg-muted"
                                            >
                                                {dictionary.mechanics[key].name}
                                            </span>
                                        ))}
                                    </p>

                                    <div className="pt-1">
                                        <PlayButton puzzleId={level.id} variant="ghost">
                                            {dictionary.puzzlesPage.play}
                                        </PlayButton>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
        </div>
    );
}

/** Le compteur « x sur y », qui ne peut se calculer que dans le navigateur. */
export function PuzzleProgress({ dictionary, total }: { dictionary: Dictionary; total: number }) {
    const progress = useProgress();
    const done = Object.keys(progress.puzzles).length;
    return (
        <span className="numeric text-sm text-fg-muted">
            {format(dictionary.puzzlesPage.done, { done, total })}
        </span>
    );
}
