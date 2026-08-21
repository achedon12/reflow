import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { contentKeyForSlug, contentParams } from '@/i18n/routes';
import { buildMetadata } from '@/lib/seo';
import { ContentPage } from '@/views/ContentPage';

// Segment dynamique plutôt qu'un dossier par langue : les slugs sont TRADUITS
// et `routes.ts` en est la seule source.
export function generateStaticParams() {
    return contentParams();
}

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();
    const key = contentKeyForSlug(locale, slug);
    if (!key) notFound();
    return buildMetadata(locale, key);
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();
    const key = contentKeyForSlug(locale, slug);
    if (!key) notFound();
    return <ContentPage locale={locale} contentKey={key} />;
}
