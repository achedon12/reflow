import type { Metadata, Viewport } from 'next';
import { SiteShell } from '@/components/SiteShell';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildMetadata } from '@/lib/seo';
import { THEME_COLORS } from '@/lib/theme';
import '../globals.css';

export const metadata: Metadata = buildMetadata(DEFAULT_LOCALE, 'home');

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
        { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark },
    ],
    colorScheme: 'light dark',
};

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return <SiteShell locale={DEFAULT_LOCALE}>{children}</SiteShell>;
}
