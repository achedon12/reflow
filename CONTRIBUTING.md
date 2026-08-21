# Contribuer

Merci d'être passé. Ce projet est petit et le restera : ça rend les
contributions plus faciles à relire, et les refus plus faciles à expliquer.

## Les quatre contraintes

Elles ne sont pas négociables, et la plupart des idées refusées le sont parce
qu'elles en cassent une :

1. **Le niveau est la fenêtre.** Aucun bloc n'a de position absolue : tout est
   ancré à un bord, et la géométrie est une fonction de `innerWidth` et
   `innerHeight`. Une énigme qui ignore le redimensionnement n'a rien à faire
   ici — elle serait jouable dans n'importe quel autre plateformer.
2. **Aucun serveur.** Pas de base, pas d'API, pas de compte, pas de classement.
   Les parties engendrées naissent d'une graine, la progression vit dans le
   stockage local.
3. **Aucune énigme non prouvée.** `npm run levels` rejoue le moteur physique sur
   chaque niveau et cherche une suite d'actions menant à la sortie. Un niveau
   qui n'a pas de solution trouvée ne se publie pas.
4. **Quatre langues, toujours.** Un texte ajouté dans un seul dictionnaire fait
   échouer `npm run typecheck` — c'est voulu.

## Avant d'ouvrir une PR

```bash
npm run check     # typecheck + lint + build + vérification des énigmes
```

Puis, selon ce que tu as touché :

- **une énigme** → une entrée dans `src/data/level-specs.ts` et sa fiche dans
  **les quatre** dictionnaires. Le constructeur refuse à l'écriture tout saut
  hors de portée : si `npm run build` échoue sur « la portée n'est que de… »,
  c'est le niveau qui est faux, pas le message ;
- **la physique** → relance `npm run levels` en entier. Les constantes de
  `src/game/constants.ts` sont ce qui rend les cinquante-quatre énigmes
  finissables ; les toucher peut en casser n'importe laquelle, silencieusement ;
- **du texte** → les quatre dictionnaires (`src/i18n/dictionaries/`). `fr.ts`
  est la référence : les autres sont typés d'après lui ;
- **une page** → entrée dans `src/i18n/routes.ts`, dossier de route nommé
  d'après le slug **français**, et entrée dans `src/app/sitemap.ts` ;
- **l'affichage** → une capture en clair **et** en sombre. Les deux thèmes sont
  conçus, pas inversés l'un de l'autre — et sur Reflow le thème est une
  mécanique de jeu, pas une préférence ;
- **les couleurs** → relance Lighthouse. Le contraste se casse discrètement :
  une opacité en moins sur un gris déjà sourd suffit à passer sous 4.5:1, et ça
  ne se voit pas à l'œil ;
- **nginx** → construis l'image et vérifie les en-têtes réellement servis. Un
  `add_header` dans un `location` **annule** ceux du serveur ; c'est pour ça que
  chaque bloc inclut `security-headers.conf`.

## Ce qui se refuse d'avance

- un classement, un profil, une connexion ;
- une police, un script ou une image chargés depuis un autre domaine — la CSP
  n'autorise que `'self'` ;
- le détournement du bouton Précédent en dehors des énigmes qui le déclarent :
  enfermer le joueur dans la page n'est pas une mécanique ;
- une dépendance de plus pour ce que dix lignes font déjà ;
- des commentaires qui redisent le code. On commente ce qui **casserait** si on
  l'ignorait, pas ce que la ligne dit déjà.

## Signaler une énigme impossible

Précise son **identifiant** (le dernier segment de l'URL, par exemple
`/enigmes/lucarne/`) et la **taille de fenêtre** où tu as buté — elle est
affichée en haut à droite pendant la partie. Sans elle, le cas ne se rejoue pas.

## Sécurité

Voir [SECURITY.md](SECURITY.md). Jamais dans une issue publique.
