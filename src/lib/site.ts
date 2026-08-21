export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://reflow.leoderoin.fr').replace(
    /\/$/,
    '',
);

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0';

export const AUTHOR = {
    name: 'Léo Deroin',
    site: 'https://leoderoin.fr',
    github: 'https://github.com/achedon12',
    email: 'contact@leoderoin.fr',
} as const;

export const REPOSITORY = 'https://github.com/achedon12/reflow';

/** Le panneau qui liste les jeux. Le lien retour que le hub attend. */
export const HUB_URL = 'https://jeux.leoderoin.fr';

/** Jeton de propriété Google Search Console. Vide, aucune balise n'est émise —
 *  une balise vide vaut un jeton faux et fait échouer la vérification. */
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '';

export const MATOMO = {
    url: process.env.NEXT_PUBLIC_MATOMO_URL ?? '',
    siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? '',
} as const;
