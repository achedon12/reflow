# Reflow

Un jeu de plateforme 2D dont le niveau est **la fenêtre du navigateur**.

Aucune plateforme n'a de position absolue : chacune est accrochée à un bord de
la fenêtre, et sa place se recalcule à chaque image à partir de `innerWidth` et
`innerHeight`. Tirer sur un coin ne redimensionne pas une vue du jeu — ça
déplace le décor, ouvre des passages, en referme d'autres, et peut vous écraser
contre un mur.

**→ [reflow.leoderoin.fr](https://reflow.leoderoin.fr)**

54 énigmes écrites à la main, puis des parties engendrées à l'infini. Sans
compte, sans publicité, sans serveur de jeu.

---

## Ce que c'est techniquement

Un site **entièrement statique**. Pas de base de données, pas d'API, pas de
session. Le moteur physique tourne dans le navigateur à pas fixe, et les
niveaux engendrés naissent d'une graine plutôt que d'un serveur : deux joueurs
qui entrent la même graine reçoivent le même niveau, au pixel près, sans que
rien ne leur soit envoyé.

La progression vit dans le `localStorage` et n'en sort jamais.

| | |
|---|---|
| Cadre | Next.js 16, App Router, `output: 'export'` |
| Styles | Tailwind CSS v4, thème clair / sombre / système |
| Rendu du jeu | des **éléments du document**, pas un canevas |
| Langues | `fr` sur `/`, puis `/en/`, `/es/`, `/de/` — **slugs traduits** |
| Pages produites | 240, dont 216 pages d'énigme (54 × 4 langues) |
| Typographie | Space Grotesk et JetBrains Mono, variables et auto-hébergées |
| Production | une image nginx sans privilèges, en lecture seule |

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3008
```

Ou dans Docker, pour retrouver la version de Node de la production :

```bash
docker compose -p reflow -f docker-compose.dev.yml up -d --build
```

Avant de pousser :

```bash
npm run check        # typecheck + lint + build + vérification des énigmes
```

---

## Le format des niveaux

Tout tient dans un **ancrage** : huit nombres qui expriment un rectangle
relativement à la fenêtre.

```
x = ax × W + ox        w = aw × W + ow
y = ay × H + oy        h = ah × H + oh
```

Une plateforme avec `ax = 1, ox = -160` reste collée au bord **droit** :
rétrécir la fenêtre la fait venir vers le joueur. Une plateforme avec `aw = 1`
traverse toujours l'écran, quelle que soit sa largeur.

C'est là que vit la mécanique du jeu — dans le **format**, pas dans un cas
particulier du moteur. Un niveau qui ignorerait le redimensionnement serait
donc impossible à écrire.

Deux leviers s'y ajoutent : `theme`, qui fait qu'un bloc n'existe que dans le
thème clair ou que dans le sombre, et `when`, qui le fait exister seulement
au-dessus ou en dessous d'une taille de fenêtre donnée.

## Les énigmes ne s'écrivent pas en coordonnées

Elles s'écrivent en **sauts**. Chaque palier déclare la hauteur qu'il gagne et
l'écart qu'il ouvre ; `src/game/build.ts` en déduit la géométrie :

```ts
{
    id: 'corniche',
    tier: 'easy',
    mechanics: ['resize'],
    reference: { w: 1000, h: 560 },
    start: { x: 60, up: 0 },
    steps: [
        { rise: 62, gap: 72, w: 130 },
        { rise: 62, gap: 72, w: 130 },
        { rise: 62, gap: 72, w: 130 },
    ],
}
```

Le constructeur **refuse à l'écriture** tout saut hors de portée, la portée
horizontale étant dérivée de la hauteur à franchir — monter et avancer se
disputent le même temps de vol, et les deux maximums ne s'additionnent pas :

```
reflow/src/game/build.ts
Error: gouffre, palier 3 : écart de 132 px pour une montée de 60 px,
la portée n'est que de 102
```

Une énigme impossible ne compile pas.

## Et elles sont **prouvées** finissables

Le constructeur garantit chaque saut isolément ; il ne dit rien du niveau dans
son ensemble — un mur peut boucher un passage, une lame arriver au mauvais
moment, une orbe demander un détour infaisable.

D'où `npm run levels`, qui ne relit pas la géométrie mais **joue** :

```
Jouabilité (le moteur rejoue chaque énigme)
  ✓ seuil         easy    1000×560  3.1 s
  ✓ lucarne       easy    820×560   2.6 s
  ✓ etau          medium  900×560   2.6 s
  …
Toutes les énigmes sont finissables.
```

Une recherche en faisceau explore les suites d'actions possibles en appelant le
moteur réel, image par image, jusqu'à toucher la sortie. Ce qu'elle prouve
n'est donc pas « le niveau a l'air faisable » mais « voici une partie qui le
termine ». Le contrôle tourne aussi en intégration continue : aucune énigme
n'est publiée sans cette preuve.

C'est une recherche en faisceau, pas exhaustive : un échec signifie « aucune
solution trouvée », jamais « aucune solution n'existe ». Le compromis est le
bon sens — un faux échec se corrige en élargissant le faisceau, un faux succès
passerait inaperçu jusqu'au premier joueur bloqué.

## Les parties infinies

Le générateur ne tire pas des plateformes au hasard en espérant que ça passe :
il **construit** le chemin, en serpentin, du bas vers le haut. Chaque plateforme
est posée à portée de saut de la précédente. La partie est donc terminable par
construction, à la cote de référence affichée en jeu.

La difficulté monte avec le palier, et la graine tient dans un lien :
`?p=graine-palier`.

---

## Structure

```
src/
  game/                 LE MOTEUR — aucune dépendance à React
    constants.ts        la physique, et la portée d'un saut en fonction de sa hauteur
    types.ts            l'ancrage : huit nombres qui font tout le jeu
    geometry.ts         résolution des ancrages pour une taille de fenêtre
    engine.ts           un pas de simulation, PUR : mêmes entrées, même sortie
    build.ts            le constructeur d'énigmes, qui refuse l'infaisable
    generator.ts        les parties engendrées, finissables par construction
    solver.ts           le vérificateur : il joue les niveaux au lieu de les lire
    rng.ts              mulberry32, pour que deux joueurs aient le même niveau
  data/
    level-specs.ts      LES 54 ÉNIGMES, en sauts
    levels.ts           leur construction
  app/(default)/        les pages françaises : /, /enigmes/, /infini/…
  app/(prefixed)/       les autres langues, sur /xx/ et /xx/<slug traduit>/
  app/sitemap.ts        240 entrées : une par page ET par langue
  i18n/routes.ts        LA table des chemins — toute URL interne passe par path()
  i18n/dictionaries/    fr.ts fait référence, les autres en sont typées
  components/Playfield  l'aire de jeu : la boucle, le rendu, le rembobinage
  lib/seo.ts            métadonnées et JSON-LD
scripts/check-levels    la preuve que les 54 énigmes se terminent
nginx/                  configuration de production, figée à la construction
                        (redirects.conf est GÉNÉRÉ, ne pas l'éditer)
```

---

## Ajouter une énigme

1. Une entrée dans `src/data/level-specs.ts` — en **sauts**, pas en
   coordonnées. Son `id` est un segment d'URL public et définitif : ASCII, sans
   accent.
2. Sa fiche (`name`, `brief`) dans **les quatre** dictionnaires —
   `npm run typecheck` refuse de compiler tant qu'il en manque une.
3. `npm run levels`. Tant que le vérificateur ne trouve pas de solution,
   l'énigme n'existe pas.

Le catalogue, les pages d'énigme, le sitemap, les redirections nginx et le
JSON-LD suivent tout seuls.

## Ajouter une page

1. Sa clé et ses quatre slugs dans `SLUGS` (`src/i18n/routes.ts`).
2. Sa copie dans les quatre dictionnaires.
3. Sa clé dans `CONTENT_KEYS`, et son rendu dans `views/ContentPage.tsx`.
4. Un dossier de route français, **dont le nom EST le slug** : il doit rester
   identique à `SLUGS.<clé>.fr`, rien ne le vérifie. Les autres langues sont
   servies par `[locale]/[slug]`, qui se génère depuis la table.
5. Son entrée dans `PAGES` (`src/app/sitemap.ts`) et dans `UPDATED`.

Les redirections nginx, elles, se régénèrent seules : `npm run nginx` dérive
`nginx/redirects.conf` de la table des routes, et `npm run build` l'appelle.

## Ajouter une langue

1. Le code dans `LOCALES` (`src/i18n/config.ts`), plus son endonyme et son
   abréviation.
2. Un dictionnaire dans `src/i18n/dictionaries/`, typé `Dictionary` — 54 fiches
   d'énigme comprises.
3. Son `og:locale` dans `OG_LOCALES` (`src/lib/seo.ts`).
4. Son slug pour **chaque** page dans `SLUGS` (`src/i18n/routes.ts`).

---

## Référencement

Ce qui est en place, et qu'il ne faut pas casser :

- une balise `canonical` par langue, barre finale comprise ;
- `hreflang` réciproques entre les quatre langues, plus `x-default`, sur les
  240 pages ;
- `sitemap.xml` avec `lastmod`, `changefreq` et `priority` — et **sans**
  `xhtml:link` : ces éléments désactivent le visualiseur XML du navigateur, et
  les `hreflang` sont déjà dans le `<head>` de chaque page ;
- JSON-LD : `WebSite` + `VideoGame` + `Person` sur l'accueil, `CollectionPage` +
  `ItemList` de 54 entrées sur le catalogue, `Game` + `BreadcrumbList` sur
  chaque énigme, `FAQPage` sur les règles et sur les mécaniques ;
- Open Graph et Twitter Card avec une image 1200×630 **par langue** ;
- `/fr/` redirigé en 301 vers `/`, pour ne jamais avoir deux fois la même page.

**Le jeu est une surcouche, jamais une page.** Cliquer « Jouer » ouvre l'aire
de jeu par-dessus la page courante sans changer d'URL : les 240 pages restent
du HTML lisible par un moteur, au lieu d'un canevas vide.

Vérifier après un changement :

```bash
npm run build
grep -o '<link rel="alternate"[^>]*>' out/index.html
grep -c '<url>' out/sitemap.xml    # 240
```

## Images et polices

Les **SVG de `public/` sont la source** des icônes. Les PNG en sont des
rasterisations, versionnées, régénérées par :

```bash
npm run og      # 4 images de partage (une par langue) + les icônes
npm run fonts   # recopie les .woff2 depuis @fontsource-variable
```

L'image de partage n'a pas de fichier source : elle est **décrite dans le
script**, parce qu'elle est paramétrée par langue — et parce qu'elle montre un
vrai niveau, résolu par le moteur lui-même. Un décor inventé pour l'occasion
finirait par ne plus ressembler au jeu.

La construction Docker ne fait que copier les PNG : elle n'a ni `sharp` ni
polices système, et un rendu de texte y donnerait un résultat différent de
celui vérifié à l'œil.

## Déploiement

```bash
docker compose -p reflow up -d --build
```

Le conteneur écoute sur `127.0.0.1:${REFLOW_HOST_PORT:-3009}` — jamais sur une
interface publique : le proxy inverse de la machine porte le TLS, la limitation
de débit et les journaux.

⚠️ `NEXT_PUBLIC_SITE_URL` doit être posée dans le `.env` du serveur **avant**
la construction : elle est inlinée dans les fichiers produits, et c'est elle
qui écrit les canoniques, les `hreflang` et le sitemap. La passer au démarrage
n'a aucun effet.

Voir `.env.example` pour la liste complète.

---

## Ce qui reste à faire

- **La septième mécanique** : un même personnage traversant deux fenêtres côte
  à côte, synchronisées par `BroadcastChannel` et repérées par `screenX` /
  `screenY`. Elle dépend d'un bloqueur de fenêtres surgissantes, et une
  mécanique qui ne marche que chez la moitié des joueurs n'en est pas une.
- **Un vrai mode tactile.** Les commandes à l'écran existent, mais un téléphone
  ne se redimensionne pas : il faudrait rebâtir les énigmes sur l'orientation
  et sur la barre d'URL qui se rétracte au défilement. C'est un second jeu.
- **L'éditeur de niveaux**, avec le niveau encodé dans l'URL. C'est ce qui
  ferait passer le contenu de la main de l'auteur à celle des joueurs.
