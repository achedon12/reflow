## Ce que fait cette PR

<!-- En deux ou trois phrases. Le « pourquoi » compte plus que le « quoi » :
     le diff dit déjà ce qui change. -->

## Comment le vérifier

<!-- Les étapes pour reproduire le comportement, ou la commande à lancer. -->

## Cases à cocher

- [ ] `npm run check` passe (typecheck, lint, build, vérification des énigmes)
- [ ] Si du texte est ajouté : présent dans **les quatre** dictionnaires
- [ ] Si une page est ajoutée : entrée dans `routes.ts`, dossier de route au nom
      du slug français, et entrée dans `sitemap.ts`
- [ ] Si l'affichage change : capture jointe, en clair **et** en sombre
- [ ] Si une énigme est ajoutée ou modifiée : `npm run levels` la déclare
      finissable, et sa fiche existe dans les quatre dictionnaires
- [ ] Si la physique change : `npm run levels` relancé EN ENTIER — une constante
      touchée peut rendre n'importe laquelle des 54 énigmes impossible
- [ ] Si la mise en page, les polices ou nginx changent : Lighthouse relancé,
      scores de `docs/seo.md` tenus
- [ ] Aucun secret, aucune URL locale, aucun `console.log` oublié
