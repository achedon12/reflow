import Link from 'next/link';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path, type RouteKey } from '@/i18n/routes';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';

const NAV: { key: Exclude<RouteKey, 'home'>; label: (d: Dictionary) => string }[] = [
    { key: 'puzzles', label: (d) => d.header.navPuzzles },
    { key: 'endless', label: (d) => d.header.navEndless },
    { key: 'mechanics', label: (d) => d.header.navMechanics },
    { key: 'rules', label: (d) => d.header.navRules },
];

export function SiteHeader({
    locale,
    routeKey,
    puzzleId,
    dictionary,
}: {
    locale: Locale;
    routeKey: RouteKey;
    puzzleId?: string;
    dictionary: Dictionary;
}) {
    return (
        // Un filet d'un pixel et un fond plein : une barre d'outils se signale
        // par une ligne, pas par une ombre.
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg/95 backdrop-blur-[2px]">
            <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-2.5 sm:px-6">
                <Link
                    href={path('home', locale)}
                    aria-current={routeKey === 'home' ? 'page' : undefined}
                    className="tap flex shrink-0 items-center gap-2 text-fg no-underline"
                >
                    {/* La marque : une fenêtre qui contient un niveau, et
                        derrière elle le cadre de sa taille précédente. Le même
                        signe que le favicon, allégé de son quadrillage — à
                        vingt pixels, il ne ferait qu'une bouillie grise. */}
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0">
                        <rect
                            x="5.5"
                            y="2"
                            width="14"
                            height="10.5"
                            fill="none"
                            className="stroke-accent"
                            strokeWidth="1.6"
                        />
                        <rect
                            x="2"
                            y="6.5"
                            width="15.5"
                            height="12.5"
                            className="fill-bg-elevated stroke-border-strong"
                            strokeWidth="1.6"
                        />
                        <rect x="4.6" y="15.4" width="6" height="1.5" className="fill-accent" />
                        <rect x="5.6" y="12.2" width="2.8" height="3.2" className="fill-fg" />
                        <rect
                            x="12.4"
                            y="12.2"
                            width="2.8"
                            height="3.2"
                            fill="none"
                            className="stroke-goal"
                            strokeWidth="1.3"
                        />
                    </svg>
                    <span className="label text-[0.8rem] text-fg">{dictionary.header.brand}</span>
                </Link>

                <div className="ml-auto flex items-center gap-3">
                    <nav aria-label={dictionary.header.navLabel} className="hidden items-center gap-4 sm:flex">
                        {NAV.map((item) => (
                            <Link
                                key={item.key}
                                href={path(item.key, locale)}
                                aria-current={routeKey === item.key ? 'page' : undefined}
                                className="tap label text-fg-muted no-underline transition-colors hover:text-fg aria-[current=page]:text-fg"
                            >
                                {item.label(dictionary)}
                            </Link>
                        ))}
                    </nav>
                    <span aria-hidden="true" className="hidden h-3.5 w-px bg-border-strong sm:block" />
                    <LocaleSwitcher
                        locale={locale}
                        routeKey={routeKey}
                        puzzleId={puzzleId}
                        dictionary={dictionary}
                    />
                    <ThemeToggle dictionary={dictionary} />
                </div>
            </div>
        </header>
    );
}
