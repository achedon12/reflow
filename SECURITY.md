# Politique de sécurité

## Signaler une faille

**N'ouvre pas d'issue publique pour une faille de sécurité.** Une issue est
visible de tous, y compris de qui voudrait l'exploiter avant le correctif.

Deux canaux :

- l'onglet **Security → Report a vulnerability** de ce dépôt (avis de sécurité
  privé, canal préféré) ;
- à défaut, un courriel à **contact@leoderoin.fr** avec `[sécurité]` en objet.

Merci d'inclure de quoi reproduire : URL concernée, comportement observé,
comportement attendu, et l'impact que tu estimes.

Réponse sous 7 jours. Ce projet est maintenu sur du temps libre : la correction
peut prendre plus longtemps que l'accusé de réception.

## Périmètre

Reflow est **entièrement statique** : pas de base de données, pas d'API, pas de
session, pas de formulaire. Le moteur physique tourne dans le navigateur, les
niveaux engendrés naissent d'une graine, et la progression ne quitte jamais la
machine du joueur. La surface d'attaque se limite donc à :

- la **politique de sécurité du contenu** et les en-têtes servis par nginx
  (`nginx/security-headers.conf.template`) ;
- la **configuration du conteneur** (utilisateur non privilégié, système de
  fichiers en lecture seule, `no-new-privileges`) ;
- les **dépendances** de construction.

Connaître la solution d'une énigme à l'avance n'est pas une faille : la
géométrie des niveaux est publique et livrée au navigateur, et le vérificateur
qui prouve qu'elles sont finissables est dans le dépôt. Il n'y a ni classement
ni compte — rien ne dépend de la confidentialité d'une solution.

Éditer sa propre progression dans le stockage local n'en est pas une non plus :
ces données n'existent que chez le joueur et ne sont comparées à rien.

## Versions maintenues

Seule la version en ligne sur https://reflow.leoderoin.fr l'est.
