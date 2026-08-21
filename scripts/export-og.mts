import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { fr } from '../src/i18n/dictionaries/fr.ts';
import { en } from '../src/i18n/dictionaries/en.ts';
import { es } from '../src/i18n/dictionaries/es.ts';
import { de } from '../src/i18n/dictionaries/de.ts';
import { LEVELS } from '../src/data/levels.ts';
import { resolve } from '../src/game/geometry.ts';

// Les SVG de `public/` sont la SOURCE des icônes ; l'image de partage, elle,
// est décrite ici parce qu'elle est PARAMÉTRÉE PAR LANGUE. Les PNG produits
// sont versionnés : la construction Docker n'a ni sharp ni polices système, et
// un rendu de texte y donnerait un résultat différent de celui vérifié à l'œil.
const ROOT = join(import.meta.dirname, '..');
const FONT = 'DejaVu Sans, Noto Sans, Liberation Sans, sans-serif';

// L'image montre un VRAI niveau, résolu par le moteur à la taille de l'image.
// Un décor inventé pour l'occasion finirait par ne plus ressembler au jeu.
const SAMPLE = LEVELS.find((level) => level.id === 'corniche')!;

// ⚠️ Le niveau est résolu à SA taille de référence, puis mis à l'échelle. Le
// résoudre directement à la taille de la vignette ne le rétrécirait pas : les
// blocs ancrés à gauche gardent leurs coordonnées en pixels, et la moitié du
// chemin sortirait de l'image.
const BOARD = SAMPLE.reference;

function board(): string {
    // La vignette montre un VRAI niveau — `corniche`, résolu à sa taille de
    // référence puis mis à l'échelle. Le résoudre directement à la taille de la
    // vignette ne le rétrécirait pas : les blocs ancrés à gauche gardent leurs
    // coordonnées en pixels, et la moitié du chemin sortirait de l'image.
    const scale = 0.4;
    const originX = 740;
    const originY = 350;
    const width = BOARD.w * scale;
    const height = BOARD.h * scale;

    const parts: string[] = [
        // Le cadre fantôme, décalé : la taille précédente de la fenêtre. C'est
        // le même signe que la marque, appliqué au niveau lui-même.
        `<rect x="${originX + 24}" y="${originY + 24}" width="${width}" height="${height}" fill="none" stroke="#9d7bff" stroke-width="3" stroke-dasharray="11 9"/>`,
        // La fenêtre courante, pleine : sans fond, le niveau se perdait dans la
        // page et la moitié droite de l'image paraissait vide.
        `<rect x="${originX}" y="${originY}" width="${width}" height="${height}" fill="#141824" stroke="#7b8398" stroke-width="3"/>`,
        `<rect x="${originX + 2}" y="${originY + 2}" width="${width - 4}" height="${height - 4}" fill="url(#paper)"/>`,
    ];

    for (const block of SAMPLE.blocks) {
        if (block.theme === 'light') continue;
        const rect = resolve(block.rect, BOARD);
        const x = originX + rect.x * scale;
        const y = originY + rect.y * scale;
        const w = Math.max(3, rect.w * scale);
        const h = Math.max(3, rect.h * scale);

        if (block.kind === 'solid') {
            parts.push(
                `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="#2b3247"/>`,
                `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="2.5" fill="#9d7bff"/>`,
            );
        } else if (block.kind === 'goal') {
            parts.push(
                `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="#a3e635" stroke-width="3"/>`,
            );
        } else if (block.kind === 'orb') {
            parts.push(
                `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="#fbbf24" stroke-width="3"/>`,
            );
        } else {
            parts.push(
                `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="#ff3d7f"/>`,
            );
        }
    }

    const spawn = resolve(SAMPLE.spawn, BOARD);
    parts.push(
        `<rect x="${(originX + spawn.x * scale).toFixed(1)}" y="${(originY + spawn.y * scale).toFixed(1)}" width="${(22 * scale).toFixed(1)}" height="${(30 * scale).toFixed(1)}" fill="#ffffff"/>`,
    );

    // La cote, AU-DESSUS du cadre et alignée à droite : c'est l'élément
    // d'interface que le joueur lit en permanence. Sous le cadre, elle tombait
    // sur le trait du cadre fantôme.
    parts.push(
        `<text x="${originX + width}" y="${originY - 14}" text-anchor="end" font-family="${FONT}" font-size="20" fill="#8b93aa" letter-spacing="2">${BOARD.w}×${BOARD.h}</text>`,
    );

    return parts.join('\n  ');
}

function svg(d: typeof fr): string {
    const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const lede = d.home.lede.split('.')[0]!;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="#9d7bff" stroke-opacity="0.09" stroke-width="1"/>
    </pattern>
    <pattern id="paper" width="16" height="16" patternUnits="userSpaceOnUse">
      <path d="M16 0H0V16" fill="none" stroke="#9d7bff" stroke-opacity="0.14" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#0b0d12"/>
  <rect width="1200" height="630" fill="url(#g)"/>

  <g transform="translate(78 72)">
    <rect x="12" y="0" width="56" height="43" fill="none" stroke="#9d7bff" stroke-width="4"/>
    <rect x="0" y="18" width="62" height="48" fill="#141824" stroke="#7b8398" stroke-width="3"/>
    <rect x="9" y="52" width="22" height="4" fill="#2b3247"/>
    <rect x="9" y="52" width="22" height="1.6" fill="#9d7bff"/>
    <rect x="12" y="43" width="8" height="9" fill="#ffffff"/>
    <rect x="40" y="43" width="8" height="9" fill="none" stroke="#a3e635" stroke-width="2.5"/>
  </g>

  <text x="200" y="132" font-family="${FONT}" font-size="52" font-weight="bold" fill="#e4e7f2" letter-spacing="4">${esc(d.meta.title)}</text>
  <text x="82" y="268" font-family="${FONT}" font-size="46" font-weight="bold" fill="#e4e7f2">${esc(d.home.title)}</text>
  <text x="82" y="332" font-family="${FONT}" font-size="26" fill="#8b93aa">${esc(lede)}.</text>

  <text x="82" y="452" font-family="${FONT}" font-size="24" font-weight="bold" fill="#a3e635">${esc(d.home.browse)}</text>
  <text x="82" y="502" font-family="${FONT}" font-size="24" fill="#8b93aa">${esc(d.endless.title)}</text>

  <text x="82" y="576" font-family="${FONT}" font-size="24" font-weight="bold" fill="#9d7bff" letter-spacing="1">reflow.leoderoin.fr</text>

  ${board()}
</svg>`;
}

async function png(source: string | Buffer, output: string, width: number, height: number) {
    const buffer = await sharp(Buffer.from(source as string), { density: 384 })
        .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toBuffer();
    const target = join(ROOT, output);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, buffer);
    console.log(`${output} — ${width}×${height}, ${(buffer.length / 1024).toFixed(1)} Ko`);
}

for (const [locale, d] of Object.entries({ fr, en, es, de })) {
    await png(svg(d as typeof fr), `public/og-${locale}.png`, 1200, 630);
}

const ICONS = [
    { src: 'public/logo-mark.svg', out: 'public/icon-192.png', size: 192 },
    { src: 'public/logo-mark.svg', out: 'public/icon-512.png', size: 512 },
    { src: 'public/logo-mark-maskable.svg', out: 'public/icon-maskable-512.png', size: 512 },
    // iOS ignore le favicon SVG et n'accepte qu'un PNG.
    { src: 'public/logo-mark.svg', out: 'src/app/apple-icon.png', size: 180 },
];
for (const icon of ICONS) {
    await png(await readFile(join(ROOT, icon.src)), icon.out, icon.size, icon.size);
}

// Le favicon reste vectoriel : Next le sert sur `/icon.svg`, et tous les
// navigateurs modernes le préfèrent à un PNG, à n'importe quelle taille.
await writeFile(join(ROOT, 'src/app/icon.svg'), await readFile(join(ROOT, 'public/logo-mark.svg')));
console.log('src/app/icon.svg — copié depuis public/logo-mark.svg');
