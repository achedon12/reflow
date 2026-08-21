import type { NextConfig } from 'next';
import { version } from './package.json';

const nextConfig: NextConfig = {
    env: { NEXT_PUBLIC_APP_VERSION: version },
    // Le jeu est entièrement client : le moteur physique tourne dans le
    // navigateur et la géométrie des niveaux dépend de la taille de la
    // fenêtre, que le serveur ne peut pas connaître. Next produit donc du HTML
    // complet par langue, servi tel quel par nginx.
    //
    // ⚠️ Ce mode DÉSACTIVE `headers()` : la CSP vit dans nginx, pas ici.
    output: 'export',
    trailingSlash: true,
    poweredByHeader: false,
    images: { unoptimized: true },
    experimental: { inlineCss: true, globalNotFound: true },
};

export default nextConfig;
