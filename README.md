# Reflow

Un jeu de plateforme 2D dont le niveau est **la fenêtre du navigateur**.

Aucune plateforme n'a de position absolue : chacune est accrochée à un bord de
la fenêtre, et sa place se recalcule à chaque image à partir de `innerWidth` et
`innerHeight`. Tirer sur un coin ne redimensionne pas une vue du jeu — ça
déplace le décor, ouvre des passages, en referme d'autres, et peut vous écraser
contre un mur.

**→ [reflow.leoderoin.fr](https://reflow.leoderoin.fr)**

100 énigmes écrites à la main, puis des parties engendrées à l'infini. Sans
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
| Énigmes | 100 — 18 faciles, 18 moyennes, 18 difficiles, 46 impossibles |
| Langues | `fr` sur `/`, puis `/en/`, `/es/`, `/de/` — **slugs traduits** |
| Pages produites | 432, dont 400 pages d'énigme (100 × 4 langues) |
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
npm run check              # tout : typecheck, lint, build, et les cinq contrôles
npm run audit              # ce que chaque énigme EXIGE du joueur
npm run narrow             # à quelle réduction chacune se joue sur un téléphone
npm run pivot charniere    # une énigme à tronçons à la fois, pendant qu’on l’écrit
npm run draw charniere:1   # et la même, en image, dans l’orientation demandée
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

## Douze énigmes changent de sol en cours de route

Une énigme ordinaire se parcourt dans une seule orientation ; pivoter l'écran
n'y sert qu'à la relire. Douze d'entre elles s'écrivent en **tronçons**, chacun
dans son quart de tour :

```ts
segments: [
    { designedFor: 0, steps: [ …, { rise: 44, gap: 60, pivot: true } ] },
    { designedFor: 1, steps: [ { catch: true, w: 130 }, … ] },
]
```

Ce qui suit le pivot est fait de **piliers** : couché, un palier de 150 × 14
devient 14 × 150, et l'on n'y tient plus. Ces piliers ne redeviennent un sol
qu'une fois l'écran tourné — le chemin n'existe donc dans aucune orientation
prise seule.

Deux règles, tenues par le constructeur :

- le raccord se fait sur un **pivot carré** (`pivot: true`), sinon le joueur
  bascule dans le vide à l'instant même où il tourne ;
- le tronçon suivant s'ouvre sur un **rattrapage** (`catch: true`), qu'on ne
  positionne pas : la gravité vient de changer de côté, le joueur longe la
  paroi du pivot et tombe. Le constructeur place la plateforme sous lui.

Et surtout, `npm run pivot` prouve que le quart de tour est **obligatoire** :
il reconstruit chaque énigme sans la mécanique `gravity`, ce qui interdit au
vérificateur de tourner, et exige qu'il échoue — à la taille de conception
comme aux tailles qu'un joueur essaierait pour s'en dispenser. Le contrôle
couvre les **quinze** énigmes qui déclarent la gravité : les douze à tronçons,
et les trois qui se contentent d'un quart de tour au départ. Une preuve
d'impossibilité ne s'arrête pas sur un succès, elle épuise le faisceau — le
contrôle lance donc une énigme par cœur disponible.

```
Le quart de tour est-il obligatoire ? (15 énigmes)
  ✓ charniere     hard        0.9 s, insoluble sans quart de tour
  ✓ spirale       hard        0.7 s, insoluble sans quart de tour
  …
```

C'est le contrôle qui avait manqué aux cinq premières énigmes tournées : elles
se pivotaient une fois au départ, puis se jouaient comme les autres.

## Et elles sont **prouvées** finissables

Le constructeur garantit chaque saut isolément ; il ne dit rien du niveau dans
son ensemble — un mur peut boucher un passage, une lame arriver au mauvais
moment, une orbe demander un détour infaisable.

D'où `npm run levels`, qui ne relit pas la géométrie mais **joue** :

```
142 preuves à mener sur 100 énigmes — le moteur rejoue, il ne relit pas
  « lent » : périodes ×2, comme sous `prefers-reduced-motion`

  ✓ [jeu]    marche       easy    1000×560  1.1 s
  ✓ [lent]   vertige      hard    640×420   3.7 s
  ✓ [graine] graine 8     hard    1000×560  2.9 s
  …
Toutes les énigmes sont finissables.
```

Une recherche en faisceau explore les suites d'actions possibles en appelant le
moteur réel, image par image, jusqu'à toucher la sortie. Ce qu'elle prouve
n'est donc pas « le niveau a l'air faisable » mais « voici une partie qui le
termine ». Le contrôle tourne aussi en intégration continue : aucune énigme
n'est publiée sans cette preuve.

Ces cent quarante-deux preuves sont indépendantes : elles partent sur **un fils
par cœur**, avec une file où chaque fils redemande du travail dès qu'il a fini.
Le contrôle passe de trente-cinq minutes à trois — et un contrôle qu'on ne lance
plus ne protège de rien. La répartition est dynamique et non fixe pour une
raison mesurable : une énigme « impossible » coûte dix fois une facile, et un
découpage en parts égales laissait la moitié des cœurs à attendre le dernier
lot.

C'est une recherche en faisceau, pas exhaustive : un échec signifie « aucune
solution trouvée », jamais « aucune solution n'existe ». Le compromis est le
bon sens — un faux échec se corrige en élargissant le faisceau, un faux succès
passerait inaperçu jusqu'au premier joueur bloqué.

## Ce que chaque énigme EXIGE

`npm run levels` prouve qu'une énigme se termine. Il ne dit pas si elle demande
quoi que ce soit au joueur — et une énigme qu'on traverse sans jamais toucher
aux poignées laisse la mécanique fondatrice du jeu à l'état de décor.

`npm run audit` le mesure, avec un critère vérifiable : **l'énigme se
termine-t-elle déjà à la taille de départ, rotation interdite ?**

```
91 énigmes exigent un réglage, 9 s'en passent.
  seuil (easy), marche (easy), enjambee (easy), navette (easy), lucarne (easy),
  descente (easy), collecte (easy), detour (easy), couloir (easy)
```

Les neuf sont exactement les neuf premières : c'est le palier qui apprend à
jouer, il n'a rien à exiger. Ailleurs, chaque exigence a été posée à la main
puis re-mesurée — une condition de taille sur un palier ne suffit pas si le
chemin se referme quand la fenêtre rétrécit, ce qui était le cas de neuf
énigmes qu'on croyait exigeantes.

## Le palier « impossible »

Quarante-six des cent énigmes appartiennent à un quatrième palier, qui ajoute
sept matières au moteur. Aucune n'est une variation des précédentes : chacune
change une règle de la physique.

| | Ce que ça change |
|---|---|
| **Glace** | Le frottement tombe à presque rien. On garde son élan, et freiner demande autant de place que démarrer. |
| **Rebond** | Le palier renvoie plus haut qu'un saut. C'est la seule façon d'atteindre certains étages. |
| **Tapis** | Le palier vous déplace tant que vous êtes dessus. Y rester immobile demande de marcher. |
| **Clignotement** | Le bloc n'existe qu'une fraction du cycle. Le sol disparaît à intervalle fixe. |
| **Lame qui suit** | Une lame du plafond se cale sur votre position horizontale et retombe périodiquement. |
| **Vent** | Une zone impose une accélération horizontale. Elle change la portée de chaque saut qui la traverse. |
| **Paliers friables** | Ils cèdent moins d'une demi-seconde après l'atterrissage. |

⚠️ **Toutes sont de PURES FONCTIONS** de l'état du joueur et du temps — y
compris la lame qui suit, qui se cale sur `player.x` plutôt que de poursuivre
une cible avec sa propre inertie. C'est la condition non négociable pour que le
rembobinage et le vérificateur continuent de fonctionner : un piège qui
retiendrait quoi que ce soit hors de `PlayerState` casserait les deux.

Le seul état ajouté est celui des paliers friables — un champ de bits, plus
l'instant où le palier courant a commencé à céder. Trois nombres, rembobinables
comme le reste.

Le constructeur ne sait pas calculer la portée d'un rebond ni d'une rafale : les
paliers qu'on atteint ainsi se déclarent `assisted`, et c'est alors le
vérificateur — qui rejoue la partie — qui en répond. Il tourne pour eux avec un
faisceau plus large : glace, rebond et paliers friables multiplient les états
atteignables, et un faisceau trop étroit rapporterait « aucune solution
trouvée » sur un niveau parfaitement jouable.

## L'aide, sans jamais la réponse

Certaines énigmes se ratent **sans mourir une seule fois** : sur « Le suspendu »
ou « La clairière », on reste devant un chemin hors d'atteinte, ou devant rien
du tout. Compter les morts seules ne verrait pas ce blocage-là ; compter le
temps seul allumerait une aide sur un joueur qui explore tranquillement. Le
déclencheur est donc un **OU** entre les deux, avec des seuils qui montent avec
la difficulté :

| | 1ᵉʳ indice | 2ᵉ | 3ᵉ |
|---|---|---|---|
| Facile | 45 s ou 5 morts | 100 s ou 12 | 180 s ou 22 |
| Moyenne | 75 s ou 8 | 160 s ou 18 | 280 s ou 30 |
| Difficile | 120 s ou 12 | 250 s ou 26 | 420 s ou 45 |

Trois échelons, et aucun ne donne la solution :

1. les **mécaniques** mises en jeu, par leur nom seul ;
2. ce que chacune **fait**, dans le texte qui les décrit déjà ailleurs ;
3. le **geste** à essayer — « change de thème », « rétrécis franchement » —
   jamais une position ni une valeur.

Deux décisions comptent plus que les seuils :

- **Le bouton s'allume, il ne s'ouvre pas.** Un panneau qui surgit sans qu'on
  l'ait demandé prend le joueur pour un incapable.
- **Aucun indice n'est écrit énigme par énigme.** Cent indices en
  quatre langues seraient une dette de contenu qui vieillirait mal, et le
  premier niveau retouché rendrait le sien faux sans que rien ne le signale.
  Tout est dérivé des mécaniques déclarées par le niveau — et le troisième
  échelon regarde ce qui **manque réellement à l'écran** au moment où on le
  lit, parce qu'une simple liste de priorité se trompait : sur « L'épilogue »
  elle conseillait le thème, alors qu'en fenêtre large c'est une travée absente
  qui bloque.

Le temps ne court ni pendant la lecture, ni après la victoire, et il s'arrête
tout seul quand l'onglet passe en arrière-plan. Les échelons gagnés sont
conservés d'une visite à l'autre : celui qui a abandonné hier est précisément
celui à qui il ne faut pas réimposer l'attente.

## L'écran de jeu peut être plus grand que la fenêtre

Il s'affiche alors **réduit**, comme le plan de travail d'un logiciel de
dessin : le jeu tourne à sa cote, on le regarde de plus loin. La physique, les
ancrages et les cent énigmes ignorent tout de ce facteur — c'est un `scale` sur
l'enveloppe, rien d'autre.

Sans lui, **vingt-quatre énigmes sur cent étaient injouables au téléphone**, et
pas par difficulté : l'écran y plafonne à 358 px de large, or « La marche » pose
sa plateforme entre x = 290 et x = 470 sur une cote de 1000. La plateforme, et
la sortie qu'elle porte, n'existaient tout simplement pas.

⚠️ Pivoter ne réglait rien, contrairement à ce que l'intuition souffle. Les
ancrages se résolvent contre **l'écran**, pas contre l'aire de jeu tournée :
coucher un écran de 358 px de large donne un écran de 358 px de large, couché.
Ce que la rotation fait maintenant, c'est de la LISIBILITÉ — un écran de
1000 × 560 passe de 0,36 à 0,64 sur un téléphone, parce qu'il tient mieux dans
la hauteur que dans la largeur.

Les poignées et les touches tactiles restent **hors** de la réduction : réduites
avec le reste, elles tomberaient à huit pixels sur un téléphone, soit exactement
là où l'on ne joue qu'au doigt.

## Les parties infinies

Le générateur ne tire pas des plateformes au hasard en espérant que ça passe :
il **construit** le chemin, en serpentin, du bas vers le haut. Chaque plateforme
est posée à portée de saut de la précédente. La partie est donc terminable par
construction, à la cote de référence affichée en jeu.

La difficulté monte avec le palier, et la graine tient dans un lien :
`?p=graine-palier`.

**Et elles jouent le même jeu que les cent.** Les parties engendrées n'avaient
longtemps que des plateformes nues et quelques mobiles : elles étaient le jeu en
plus pauvre que les énigmes écrites à la main, ce qui est l'inverse de ce qu'on
promet en disant « des parties à l'infini ». Elles portent maintenant les
matières — glace, tapis, paliers friables, clignotants, rebond — et une partie
profonde sur trois se termine par un **coude** : le serpentin s'arrête sur un
palier carré, et la fin du chemin ne s'écrit plus dans le repère du monde mais
dans celui du premier quart de tour. Vus d'aplomb, ces derniers paliers sont des
piliers de quatorze pixels : on n'y tient pas.

Rien de tout cela n'est garanti par construction, contrairement au serpentin :
chaque matière est posée sous condition, chaque coude est essayé puis abandonné
s'il ne tombe pas juste. C'est `npm run endless` qui prouve — une grille de
graines par palier, rejouée par le moteur physique :

```
Parties engendrées — 240 graines sur 12 paliers

60 easy, 60 medium, 120 hard — la plus longue : graine 7923658 palier 16 en 9,7 s

Les 240 graines se terminent.
```

Ça ne prouve pas que les quatre milliards de graines se terminent. Mais une
matière mal posée casse une graine sur trois, pas une sur mille : l'échantillon
la trouve.

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
    level-specs.ts      LES 100 ÉNIGMES, en sauts
    levels.ts           leur construction
  app/(default)/        les pages françaises : /, /enigmes/, /infini/…
  app/(prefixed)/       les autres langues, sur /xx/ et /xx/<slug traduit>/
  app/sitemap.ts        432 entrées : une par page ET par langue
  i18n/routes.ts        LA table des chemins — toute URL interne passe par path()
  i18n/dictionaries/    fr.ts fait référence, les autres en sont typées
  components/Playfield  l'aire de jeu : la boucle, le rendu, le rembobinage
  lib/seo.ts            métadonnées et JSON-LD
scripts/check-levels    la preuve que les 100 énigmes se terminent
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
2. Un dictionnaire dans `src/i18n/dictionaries/`, typé `Dictionary` — 100 fiches
   d'énigme comprises.
3. Son `og:locale` dans `OG_LOCALES` (`src/lib/seo.ts`).
4. Son slug pour **chaque** page dans `SLUGS` (`src/i18n/routes.ts`).

---

## Référencement

Ce qui est en place, et qu'il ne faut pas casser :

- une balise `canonical` par langue, barre finale comprise ;
- `hreflang` réciproques entre les quatre langues, plus `x-default`, sur les
  432 pages ;
- `sitemap.xml` avec `lastmod`, `changefreq` et `priority` — et **sans**
  `xhtml:link` : ces éléments désactivent le visualiseur XML du navigateur, et
  les `hreflang` sont déjà dans le `<head>` de chaque page ;
- JSON-LD : `WebSite` + `VideoGame` + `Person` sur l'accueil, `CollectionPage` +
  `ItemList` de 100 entrées sur le catalogue, `Game` + `BreadcrumbList` sur
  chaque énigme, `FAQPage` sur les règles et sur les mécaniques ;
- Open Graph et Twitter Card avec une image 1200×630 **par langue** ;
- `/fr/` redirigé en 301 vers `/`, pour ne jamais avoir deux fois la même page.

**Le jeu est une surcouche, jamais une page.** Cliquer « Jouer » ouvre l'aire
de jeu par-dessus la page courante sans changer d'URL : les 432 pages restent
du HTML lisible par un moteur, au lieu d'un canevas vide.

Et surtout, `npm run seo` **ouvre les 432 pages produites** au lieu de relire
`lib/seo.ts`. Une métadonnée juste dans le code mais absente du HTML — parce
qu'une route l'oublie, parce qu'un `generateMetadata` ne s'exécute pas — ne se
voit que là. Il refuse la construction sur une canonique manquante ou de
travers, un `hreflang` qui pointe dans le vide, un titre ou une description en
double, un `h1` absent ou en double, une image sans `alt`, un JSON-LD illisible,
une page absente du plan du site — et il avertit sur ce qu'un résultat de
recherche tronquerait.

```
Référencement — 432 pages produites

432 URL au plan du site, 432 titres distincts.

Rien à redire. 0 avertissement(s).
```

C'est ce contrôle qui a relevé 292 descriptions coupées par Google et 17 titres
qui laissaient les deux tiers de leur ligne vides.

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
- **La lisibilité au doigt.** Les cent énigmes se règlent et se terminent sur
  un téléphone, mais la plus large s'y voit à 0,56 : un personnage de douze
  pixels. `npm run narrow` surveille ce plancher. Descendre plus bas
  demanderait des énigmes pensées pour l'étroit, pas des énigmes réduites.
- **L'éditeur de niveaux**, avec le niveau encodé dans l'URL. C'est ce qui
  ferait passer le contenu de la main de l'auteur à celle des joueurs.
