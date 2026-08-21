import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { levelById, PUZZLE_IDS } from '@/data/levels';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildPuzzleMetadata } from '@/lib/seo';
import { PuzzlePage } from '@/views/PuzzlePage';

// Une page par énigme : cinquante-quatre adresses partageables, et autant de
// pages de contenu réel pour les moteurs.
export function generateStaticParams() {
    return PUZZLE_IDS.map((puzzle) => ({ puzzle }));
}

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ puzzle: string }>;
}): Promise<Metadata> {
    const { puzzle } = await params;
    const level = levelById(puzzle);
    if (!level) notFound();
    return buildPuzzleMetadata(DEFAULT_LOCALE, level);
}

export default async function Page({ params }: { params: Promise<{ puzzle: string }> }) {
    const { puzzle } = await params;
    const level = levelById(puzzle);
    if (!level) notFound();
    return <PuzzlePage locale={DEFAULT_LOCALE} level={level} />;
}
