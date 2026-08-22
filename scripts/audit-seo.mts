/**
 * L'AUDIT DE RÉFÉRENCEMENT, sur les fichiers RÉELLEMENT produits.
 *
 * Il ne relit pas `lib/seo.ts` : il ouvre les 432 pages de `out/` et vérifie ce
 * qu'un robot y trouverait. Une métadonnée juste dans le code mais absente du
 * HTML — parce qu'une route l'oublie, parce qu'un `generateMetadata` ne
 * s'exécute pas — ne se voit que là.
 *
 *   npm run build && npm run seo
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const OUT = 'out';
let failures = 0;
let warnings = 0;
const fail = (message: string) => {
    failures += 1;
    console.error(`  ✗ ${message}`);
};
const warn = (message: string) => {
    warnings += 1;
    console.warn(`  ! ${message}`);
};

async function pages(dir: string): Promise<string[]> {
    const found: string[] = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === '_next') continue;
            found.push(...(await pages(full)));
        } else if (entry.name === 'index.html') {
            found.push(full);
        }
    }
    return found.sort();
}

/** L'URL canonique attendue pour un fichier de `out/`. */
function urlOf(file: string): string {
    const path = relative(OUT, file).split(sep).slice(0, -1).join('/');
    return path ? `/${path}/` : '/';
}

const one = (html: string, pattern: RegExp): string | null => html.match(pattern)?.[1] ?? null;
const all = (html: string, pattern: RegExp): string[] => [...html.matchAll(pattern)].map((m) => m[1]!);

const files = await pages(OUT);
console.log(`Référencement — ${files.length} pages produites\n`);

const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
const canonicals = new Map<string, string>();
const alternates = new Map<string, Map<string, string>>();

for (const file of files) {
    const url = urlOf(file);
    const html = await readFile(file, 'utf8');
    const say = (message: string) => `${url} : ${message}`;

    // ── Les quatre balises sans lesquelles rien ne marche ───────────────────
    const lang = one(html, /<html[^>]*\slang="([^"]+)"/);
    if (!lang) fail(say('pas de lang sur <html>'));

    const title = one(html, /<title[^>]*>([^<]*)<\/title>/);
    if (!title) fail(say('pas de <title>'));
    else {
        if (title.length < 25) warn(say(`titre de ${title.length} caractères, trop court : « ${title} »`));
        if (title.length > 65) warn(say(`titre de ${title.length} caractères, tronqué dans les résultats`));
        titles.set(title, [...(titles.get(title) ?? []), url]);
    }

    const description = one(html, /<meta name="description" content="([^"]*)"/);
    if (!description) fail(say('pas de meta description'));
    else {
        if (description.length < 70) warn(say(`description de ${description.length} caractères, trop courte`));
        if (description.length > 165) warn(say(`description de ${description.length} caractères, tronquée`));
        descriptions.set(description, [...(descriptions.get(description) ?? []), url]);
    }

    const canonical = one(html, /<link rel="canonical" href="([^"]+)"/);
    if (!canonical) fail(say('pas de canonique'));
    else {
        canonicals.set(url, canonical);
        if (!canonical.endsWith('/')) fail(say(`canonique sans barre finale : ${canonical}`));
        const expected = urlOf(file);
        if (!canonical.endsWith(expected)) fail(say(`la canonique pointe ailleurs : ${canonical}`));
    }

    // ── Les langues se citent-elles toutes ? ────────────────────────────────
    const links = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)];
    const map = new Map(links.map((m) => [m[1]!, m[2]!]));
    alternates.set(url, map);
    if (map.size > 0) {
        for (const locale of ['fr', 'en', 'es', 'de', 'x-default']) {
            if (!map.has(locale)) fail(say(`hreflang ${locale} manquant`));
        }
    }

    // ── Un seul H1, et il n'est pas vide ────────────────────────────────────
    const h1 = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
    if (h1.length === 0) fail(say('pas de <h1>'));
    if (h1.length > 1) fail(say(`${h1.length} <h1> sur la même page`));
    if (h1[0] !== undefined && h1[0].replace(/<[^>]*>/g, '').trim() === '') fail(say('<h1> vide'));

    // ── Open Graph et Twitter ───────────────────────────────────────────────
    for (const property of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image', 'og:locale']) {
        if (!html.includes(`property="${property}"`)) fail(say(`${property} manquant`));
    }
    if (!html.includes('name="twitter:card"')) fail(say('twitter:card manquant'));

    // ── Les images se décrivent-elles ? ─────────────────────────────────────
    for (const img of [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])) {
        if (!/\balt=/.test(img)) fail(say(`<img> sans alt : ${img.slice(0, 80)}`));
    }

    // ── Le JSON-LD se lit-il ? ──────────────────────────────────────────────
    for (const block of all(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
        try {
            JSON.parse(block);
        } catch (error) {
            fail(say(`JSON-LD illisible : ${(error as Error).message}`));
        }
    }
}

// ── Deux pages ne doivent pas se disputer la même requête ──────────────────
for (const [title, urls] of titles) {
    if (urls.length > 1) fail(`titre en double sur ${urls.length} pages (« ${title} ») : ${urls.slice(0, 3).join(', ')}…`);
}
for (const [description, urls] of descriptions) {
    if (urls.length > 1) {
        fail(
            `description en double sur ${urls.length} pages (« ${description.slice(0, 60)}… ») : ${urls.slice(0, 3).join(', ')}…`,
        );
    }
}

// ── Les hreflang sont-ils RÉCIPROQUES ? ────────────────────────────────────
const known = new Set(canonicals.values());
for (const [url, map] of alternates) {
    for (const [locale, href] of map) {
        if (locale === 'x-default') continue;
        if (!known.has(href)) fail(`${url} : hreflang ${locale} pointe vers une page inexistante (${href})`);
    }
}

// ── Le plan du site couvre-t-il tout ? ─────────────────────────────────────
const sitemap = await readFile(join(OUT, 'sitemap.xml'), 'utf8');
const listed = new Set(all(sitemap, /<loc>([^<]+)<\/loc>/g));
const produced = new Set([...canonicals.values()]);
for (const url of produced) {
    if (!listed.has(url)) fail(`absente du plan du site : ${url}`);
}
for (const url of listed) {
    if (!produced.has(url)) fail(`le plan du site annonce une page qui n'existe pas : ${url}`);
}

const robots = await readFile(join(OUT, 'robots.txt'), 'utf8');
if (!/Sitemap:\s*https?:\/\/\S+sitemap\.xml/i.test(robots)) fail('robots.txt ne déclare pas le plan du site');

console.log('');
console.log(`${listed.size} URL au plan du site, ${titles.size} titres distincts.`);
if (failures > 0) {
    console.error(`\n${failures} problème(s), ${warnings} avertissement(s).`);
    process.exit(1);
}
console.log(`\nRien à redire. ${warnings} avertissement(s).`);
