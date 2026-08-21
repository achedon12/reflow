import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ThemeScript } from '@/components/ThemeScript';
import { display, mono } from '@/fonts';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE, LOCALES, LOCALE_NAMES } from '@/i18n/config';
import { path } from '@/i18n/routes';
import './globals.css';

// ⚠️ `global-not-found` et pas un `not-found.tsx` de groupe : avec deux layouts
// racine, Next ne sait pas lequel composer et met SA page d'erreur intégrée
// dans `out/404.html`. Cette page-ci contourne les layouts, elle importe donc
// elle-même les styles, les polices et le script de thème.
const dictionary = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
    title: dictionary.notFound.title,
    description: dictionary.notFound.body,
    robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
    // L'export ne produit qu'UNE page 404, servie pour toutes les langues :
    // les quatre retours sont la seule façon de la rendre utile sans détection
    // JavaScript, qui exclurait les visiteurs sans script.
    const returns = LOCALES.map((locale) => ({
        locale,
        name: LOCALE_NAMES[locale],
        label: getDictionary(locale).notFound.back,
        href: path('home', locale),
    }));

    return (
        <html lang={DEFAULT_LOCALE} className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
            <body className="flex min-h-dvh flex-col antialiased">
                <ThemeScript />
                <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 sm:px-6">
                    <p aria-hidden="true" className="numeric text-5xl text-fg-muted">
                        404
                    </p>
                    <h1 className="mt-3 text-3xl text-balance">{dictionary.notFound.title}</h1>
                    <p className="mt-3 text-lg text-fg-muted text-pretty">{dictionary.notFound.body}</p>

                    <ul className="mt-8 flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
                        {returns.map((item) => (
                            <li key={item.locale}>
                                <Link
                                    href={item.href}
                                    hrefLang={item.locale}
                                    lang={item.locale}
                                    className="group flex items-center justify-between gap-4 py-3.5 no-underline"
                                >
                                    <span className="flex flex-col">
                                        <span className="label text-fg-muted">{item.name}</span>
                                        <span className="text-fg">{item.label}</span>
                                    </span>
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4 shrink-0 text-fg-muted transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </main>
            </body>
        </html>
    );
}
