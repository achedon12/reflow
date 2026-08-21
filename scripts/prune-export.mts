import { rm } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Retire de l'export les pages d'erreur qui deviendraient des URL réelles.
 *
 * `next build` écrit `out/404.html` — que nginx sert en `error_page`, avec le
 * bon code — mais aussi `out/404/index.html` et `out/_not-found/index.html`.
 * Ces deux-là sont atteignables en `/404/` et `/_not-found/` et répondent
 * 200 : ce sont des « soft 404 », que Google signale comme des erreurs
 * d'exploration. Le fichier `404.html` reste, lui.
 */
const OUT = 'out';
const DOOMED = ['404', '_not-found'];

for (const directory of DOOMED) {
    await rm(join(OUT, directory), { recursive: true, force: true });
    console.log(`prune-export: ${directory}/ retiré`);
}
