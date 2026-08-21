import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { PREFIXED_LOCALES, isLocale } from '@/i18n/config';
import { buildMetadata } from '@/lib/seo';
import { THEME_COLORS } from '@/lib/theme';
import '../../globals.css';

export function generateStaticParams() {
    return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

// Le français est servi par le groupe (default) sur `/`. Sans ce garde-fou,
// `/fr/` serait un doublon exact de l'accueil.
export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    return buildMetadata(locale, 'home');
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
        { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark },
    ],
    colorScheme: 'light dark',
};

export default async function PrefixedLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    return <SiteShell locale={locale}>{children}</SiteShell>;
}
