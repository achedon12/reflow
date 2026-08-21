import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { levelById } from '@/data/levels';
import { isLocale } from '@/i18n/config';
import { puzzleParams } from '@/i18n/routes';
import { buildPuzzleMetadata } from '@/lib/seo';
import { PuzzlePage } from '@/views/PuzzlePage';

// `puzzleParams()` ne produit que les combinaisons sous le slug du CATALOGUE :
// les autres pages annexes n'ont pas de sous-page, et `dynamicParams = false`
// garantit qu'aucune ne sera inventée.
export function generateStaticParams() {
    return puzzleParams();
}

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; puzzle: string }>;
}): Promise<Metadata> {
    const { locale, puzzle } = await params;
    if (!isLocale(locale)) notFound();
    const level = levelById(puzzle);
    if (!level) notFound();
    return buildPuzzleMetadata(locale, level);
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; puzzle: string }>;
}) {
    const { locale, puzzle } = await params;
    if (!isLocale(locale)) notFound();
    const level = levelById(puzzle);
    if (!level) notFound();
    return <PuzzlePage locale={locale} level={level} />;
}
