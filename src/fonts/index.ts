import localFont from 'next/font/local';

// Space Grotesk pour le texte, JetBrains Mono pour les nombres et les cotes.
// Deux grotesques techniques, volontairement éloignées de l'Archivo d'Azimut
// et des rondeurs du panneau : Reflow doit ressembler à un outil, pas à une
// page de jeu.
//
// Auto-hébergées : la CSP n'autorise `font-src` que sur `'self'`.
export const display = localFont({
    src: './space-grotesk-latin-wght-normal.woff2',
    // ⚠️ Suffixe `-local` obligatoire : `--font-sans` est déjà un jeton
    // Tailwind, et lui réaffecter sa valeur ferait une référence circulaire.
    variable: '--font-sans-local',
    weight: '300 700',
    display: 'swap',
    fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

export const mono = localFont({
    src: './jetbrains-mono-latin-wght-normal.woff2',
    variable: '--font-mono-local',
    weight: '100 800',
    display: 'swap',
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});
