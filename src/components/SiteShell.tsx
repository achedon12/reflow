import type { ReactNode } from 'react';
import { display, mono } from '@/fonts';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { GameProvider } from './GameProvider';
import { Matomo } from './Matomo';
import { ThemeScript } from './ThemeScript';

// Enveloppe <html>/<body>, et le lanceur de parties : n'importe quelle page
// peut ouvrir l'aire de jeu, y compris une page d'énigme atteinte directement
// depuis un moteur de recherche.
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
    return (
        <html lang={locale} className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
            <body className="flex min-h-dvh flex-col antialiased">
                <ThemeScript />
                <GameProvider locale={locale} dictionary={getDictionary(locale)}>
                    {children}
                </GameProvider>
                <Matomo />
            </body>
        </html>
    );
}
