import type { ReactNode } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path, type RouteKey } from '@/i18n/routes';
import { Credits } from './Credits';
import { SiteHeader } from './SiteHeader';

const FOOTER_NAV: Exclude<RouteKey, 'home'>[] = ['puzzles', 'endless', 'mechanics', 'rules', 'about'];

export function PageChrome({
    locale,
    routeKey,
    puzzleId,
    children,
}: {
    locale: Locale;
    routeKey: RouteKey;
    puzzleId?: string;
    children: ReactNode;
}) {
    const d = getDictionary(locale);
    const labels: Record<Exclude<RouteKey, 'home'>, string> = {
        puzzles: d.header.navPuzzles,
        endless: d.header.navEndless,
        mechanics: d.header.navMechanics,
        rules: d.header.navRules,
        about: d.header.navAbout,
    };

    return (
        <>
            <a
                href="#contenu"
                className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-contrast"
            >
                {d.header.skipToContent}
            </a>

            <SiteHeader locale={locale} routeKey={routeKey} puzzleId={puzzleId} dictionary={d} />

            <main id="contenu" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
                {children}
            </main>

            <footer className="border-t border-border-subtle">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-5 sm:px-6">
                    <nav aria-label={d.header.navLabel} className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {FOOTER_NAV.map((key) => (
                            <Link
                                key={key}
                                href={path(key, locale)}
                                aria-current={routeKey === key ? 'page' : undefined}
                                className="label text-fg-muted no-underline transition-colors hover:text-fg aria-[current=page]:text-fg"
                            >
                                {labels[key]}
                            </Link>
                        ))}
                    </nav>
                    <div className="h-px bg-border-subtle" />
                    <Credits dictionary={d} />
                </div>
            </footer>
        </>
    );
}
