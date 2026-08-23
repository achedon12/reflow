# Référencement de Reflow

L'inventaire de ce qui est en place, et **pourquoi**. À relire avant de toucher
au balisage : la plupart des lignes ci-dessous existent à cause d'un piège, pas
d'une bonne pratique recopiée.

## Le principe : le jeu est une surcouche, jamais une page

Cliquer « Jouer » n'ouvre aucune URL. L'aire de jeu se superpose à la page
courante, et la refermer rend la page telle qu'elle était.

C'est la décision qui commande tout le reste. Un jeu qui occupe sa propre route
ne laisse à un moteur qu'un `<div>` vide et un script ; ici, les **432 pages**
du site restent du texte lisible, et chacune peut lancer une partie.

## Ce qui est produit

| | |
|---|---|
| Pages | 432 — 8 pages × 4 langues, plus 100 énigmes × 4 langues |
| Canoniques | une par page et par langue, barre finale comprise |
| `hreflang` | réciproques entre les 4 langues, plus `x-default`, sur les 432 |
| Plan du site | 432 URL, avec `lastmod`, `changefreq` et `priority` |
| Images de partage | 1200×630, **une par langue**, montrant un vrai niveau |

## Données structurées

Un `@graph` par page, jamais des entités isolées : sans les liens `@id`, un
moteur voit un site, un jeu et un auteur sans rapport entre eux.

| Page | Entités |
|---|---|
| Accueil | `WebSite` + `VideoGame` + `Person`, liés par `@id`, prix zéro déclaré |
| Catalogue | `CollectionPage` + `ItemList` de 100 entrées + `BreadcrumbList` |
| Énigme | `Game` rattaché au `VideoGame` par `isPartOf`, + `BreadcrumbList` |
| Règles | `FAQPage` — six questions qu'un joueur pose réellement |
| Mécaniques | `FAQPage` — huit mécaniques, huit réponses |

La difficulté et les mécaniques d'une énigme passent par
`additionalProperty` : le vocabulaire de schema.org ne les nomme pas, et
`PropertyValue` est la façon prévue de porter un attribut qu'il ignore.

## Les pages d'énigme

Ce sont elles qui font la surface du site. Chacune porte :

- un nom et un résumé **propres**, traduits dans les quatre langues ;
- un **aperçu du niveau en SVG**, dessiné par le moteur du jeu à la taille de
  référence de l'énigme — donc unique, et toujours à jour ;
- sa difficulté, sa taille de conception, et les mécaniques qu'elle met en jeu,
  chacune décrite ;
- un lien vers la précédente et la suivante, qui relie les 100 en chaîne.

⚠️ Le segment d'URL d'une énigme n'est **pas traduit**, contrairement au
catalogue qui le porte : `/enigmes/lucarne/` et `/en/puzzles/lucarne/`. Un
niveau a un nom propre ; le traduire multiplierait par quatre les URL à tenir,
pour un gain de mot-clé nul sur un nom inventé.

## Les pièges déjà rencontrés

- **`xhtml:link` dans le plan du site.** Chrome désactive son visualiseur XML
  dès qu'un document déclare l'espace de noms XHTML : le fichier se télécharge
  au lieu de s'afficher. Les `hreflang` sont déjà dans le `<head>` des 432
  pages — les répéter là ne servait à rien et coûtait la lisibilité.
- **`/404/` et `/_not-found/`.** `next build` les écrit en plus de `404.html`.
  Ils répondent 200 et Google les signale comme « soft 404 ».
  `scripts/prune-export.mts` les retire, et l'intégration continue vérifie
  qu'ils ne reviennent pas.
- **`/fr/`.** Le français vit sur `/`. Sans la redirection 301 posée dans
  nginx, la même page existerait à deux adresses.
- **Les URL sans barre finale.** `trailingSlash: true` ne génère que
  `/enigmes/`, mais `try_files $uri/` sert la même page sur `/enigmes` sans
  rien signaler. Les 432 redirections sont **dérivées** de la table des routes
  par `npm run nginx` : écrites à la main, un oubli y serait invisible.
- **Le jeton Search Console vide.** Une balise de vérification au contenu vide
  fait échouer la vérification au lieu de ne rien faire. Elle n'est donc émise
  que si la variable est renseignée.
- **La queue de phrase de marque collée sans regarder.** La description d'une
  énigme valait « résumé + une phrase sur le jeu » : jusqu'à 234 caractères,
  quand Google en rend 158. **292 pages** étaient coupées en plein milieu. La
  queue ne s'ajoute plus que si l'ensemble tient ; sinon le résumé se suffit.
- **« Règles — Reflow ».** Quinze caractères sur une ligne de résultat qui en
  accepte soixante, sur **17 pages**. Une signature courte les comble — sauf
  quand le titre de la page se suffit déjà, auquel cas l'allonger le ferait
  couper. Un titre trop court ne casse rien : il gâche simplement la seule
  ligne qu'on ait pour convaincre.

## Vérifier

```bash
npm run build && npm run seo
```

`npm run seo` **ouvre les 432 pages produites** au lieu de relire `lib/seo.ts`.
C'est la distinction qui compte : une métadonnée juste dans le code mais absente
du HTML — parce qu'une route l'oublie, parce qu'un `generateMetadata` ne
s'exécute pas — ne se voit que là.

Il refuse la construction sur : une canonique absente, sans barre finale ou qui
pointe ailleurs ; un `hreflang` manquant ou visant une page inexistante ; un
titre ou une description en double ; un `h1` absent ou dédoublé ; une image sans
`alt` ; un JSON-LD illisible ; une page absente du plan du site ou annoncée par
lui sans exister. Il avertit sur ce qu'un résultat de recherche tronquerait.

```
Référencement — 432 pages produites

432 URL au plan du site, 432 titres distincts.

Rien à redire. 0 avertissement(s).
```

Il tourne à chaque poussée (`.github/workflows/ci.yml`). Le reste se contrôle à
la main :

```bash
grep -o '<link rel="alternate"[^>]*>' out/index.html      # 5 lignes
grep -c '<url>' out/sitemap.xml                            # 432
test ! -d out/404 && test -f out/404.html && echo "élagage ok"
```

## Ce qui n'est pas fait

- Aucune page d'archive ni d'historique : rien n'est daté dans ce jeu, donc
  rien à archiver.
- Aucun `hreflang` régional (`fr-CA`, `es-MX`…) : le contenu est identique
  d'une région à l'autre, et les déclarer diluerait le signal.
- Aucune page par mécanique. Elles vivent en `FAQPage` sur une seule page —
  huit pages de trois paragraphes seraient du contenu mince, exactement ce que
  les 100 pages d'énigme évitent en portant chacune un aperçu unique.
