import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { allPaths } from '../src/i18n/routes.ts';

// `trailingSlash: true` ne génère que `/en/rules/`. Sans redirection, nginx
// sert la même page sur `/en/rules` via `try_files $uri/`, sans rien signaler :
// chaque page existerait à deux adresses.
//
// Dérivé de la table des routes plutôt qu'écrit à la main : avec une page par
// énigme et par langue, un oubli y serait invisible. Ne pas modifier
// `nginx/redirects.conf`, il est régénéré.
const lines = allPaths()
    .filter((p) => p !== '/')
    .sort()
    .map((p) => `location = ${p.replace(/\/$/, '')} { return 301 ${p}; }`);

await writeFile(
    join(import.meta.dirname, '..', 'nginx/redirects.conf'),
    `# FICHIER GÉNÉRÉ — ne pas modifier à la main.\n# Produit par \`npm run nginx\` depuis \`src/i18n/routes.ts\`.\n${lines.join('\n')}\n`,
);
console.log(`nginx/redirects.conf — ${lines.length} redirections`);
