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

/**
 * L'hébergeur, tel qu'il doit figurer dans les mentions légales.
 *
 * Surchargeable par variables d'environnement : ces coordonnées peuvent changer
 * sans que le code ait à bouger, et un site en ligne avec une adresse
 * d'hébergeur fausse est en infraction.
 *
 * ⚠️ Relevé sur les mentions légales de LordHosting et recoupé avec le registre
 * officiel. Un PDF « LORDHOSTING ASSOCIATION » de 2022 circule encore avec une
 * adresse à Vitry-sur-Seine : c'est l'ancienne structure, ne pas la reprendre.
 */
export const HOST = {
    name: process.env.NEXT_PUBLIC_HOST_NAME || 'LordHosting, SASU au capital de 1 000 €',
    address:
        process.env.NEXT_PUBLIC_HOST_ADDRESS || '5 square Frédéric Vallois, 75015 Paris, France',
    phone: process.env.NEXT_PUBLIC_HOST_PHONE || '06 01 21 24 27',
    registration: process.env.NEXT_PUBLIC_HOST_SIREN || '105 383 988 (RCS Paris)',
} as const;

export const MATOMO = {
    url: process.env.NEXT_PUBLIC_MATOMO_URL ?? '',
    siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? '',
} as const;
