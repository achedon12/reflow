# syntax=docker/dockerfile:1

# ── Dépendances ──────────────────────────────────────────────────────────────
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `--ignore-scripts` retire sharp de l'équation : ses binaires ne servent qu'à
# `npm run og`, qui se lance sur le poste de développement et dont le résultat
# est versionné dans public/.
RUN npm ci --ignore-scripts

# ── Construction ─────────────────────────────────────────────────────────────
FROM node:26-alpine AS builder
WORKDIR /app

# Les variables `NEXT_PUBLIC_*` sont INLINÉES dans les fichiers produits : les
# passer au démarrage du conteneur n'a aucun effet, il faut les fournir ici.
# NEXT_PUBLIC_SITE_URL n'est pas cosmétique — c'est elle qui écrit les URL
# canoniques, les hreflang et le sitemap.
ARG NEXT_PUBLIC_SITE_URL=https://reflow.leoderoin.fr
ARG NEXT_PUBLIC_APP_VERSION=0.1.0
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""
ARG NEXT_PUBLIC_MATOMO_URL=""
ARG NEXT_PUBLIC_MATOMO_SITE_ID=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION \
    NEXT_PUBLIC_MATOMO_URL=$NEXT_PUBLIC_MATOMO_URL \
    NEXT_PUBLIC_MATOMO_SITE_ID=$NEXT_PUBLIC_MATOMO_SITE_ID

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# La configuration nginx est figée ICI, pas au démarrage du conteneur : le
# stage d'exécution est en lecture seule et tourne sans privilèges, il ne peut
# rien écrire dans /etc/nginx. `npm run build` a régénéré `nginx/redirects.conf`
# via son script `prebuild`.
RUN sed "s|__MATOMO_HOST__|${NEXT_PUBLIC_MATOMO_URL}|g" nginx/default.conf.template > /app/default.conf \
    && sed "s|__MATOMO_HOST__|${NEXT_PUBLIC_MATOMO_URL}|g" nginx/security-headers.conf.template > /app/security-headers.conf

# ── Exécution ────────────────────────────────────────────────────────────────
# Image NON PRIVILÉGIÉE : elle tourne sous l'uid 101 et écoute 8080, là où
# l'image nginx officielle démarre en root pour pouvoir se lier au port 80.
# Aucun processus Node en production — le site est du HTML déjà écrit, et le
# moteur du jeu s'exécute chez le visiteur.
#
# ⚠️ La variante `-slim` n'embarque pas les scripts d'entrée
# `/docker-entrypoint.d/`, donc pas d'envsubst au démarrage. Sans effet ici :
# la configuration est déjà figée dans l'image — mais y revenir casserait le
# démarrage sans le moindre message.
FROM nginxinc/nginx-unprivileged:1.30-alpine-slim AS runner

COPY --from=builder /app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=builder /app/nginx/redirects.conf /etc/nginx/redirects.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 8080
