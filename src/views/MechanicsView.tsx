import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import type { Mechanic } from '@/game/types';

/**
 * ⚠️ La séparation n'est pas cosmétique : la page s'intitulait « les six
 * mécaniques » et en listait huit, dans les quatre langues et jusque dans sa
 * description pour les moteurs.
 *
 * Les premières sont PRISES AU NAVIGATEUR — l'écran et son orientation, sa
 * taille, ses bords, les seuils d'apparition, le thème, l'historique,
 * l'écrasement entre deux bords.
 *
 * ⚠️ Les intitulés ne portent plus de nombre. Ils en portaient un, et il a
 * menti deux fois de suite : la page s'appelait « les six mécaniques » en en
 * listant huit, puis quinze. Les autres — mouvement, orbes, glace, rebond, tapis,
 * clignotement, lame qui suit, vent, paliers friables — se trouveraient dans
 * n'importe quel jeu de plateforme : les compter avec les premières
 * affaiblirait la seule promesse qui distingue celui-ci.
 */
const FROM_BROWSER: Mechanic[] = [
    'screen',
    'gravity',
    'resize',
    'edge',
    'appear',
    'theme',
    'rewind',
    'crush',
];
const FROM_THE_GAME: Mechanic[] = [
    'motion',
    'orbs',
    'ice',
    'bounce',
    'conveyor',
    'blink',
    'chase',
    'wind',
    'crumble',
];

export function MechanicsView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    const list = (keys: Mechanic[], offset: number) => (
        <ul className="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
            {keys.map((key, index) => (
                <li key={key} className="flex flex-col gap-2 bg-bg p-6">
                    <span className="numeric text-xs text-accent">
                        {String(offset + index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg">{d.mechanics[key].name}</h3>
                    <p className="text-sm leading-relaxed text-fg-muted text-pretty">{d.mechanics[key].body}</p>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-3">
                <h1 className="max-w-2xl text-3xl text-balance sm:text-4xl">{d.mechanicsPage.heading}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{d.mechanicsPage.lede}</p>
            </header>

            <p className="max-w-2xl text-base leading-relaxed text-fg text-pretty">{d.mechanicsPage.intro}</p>

            <section className="flex flex-col gap-4">
                <h2 className="label text-fg-muted">{d.mechanicsPage.browserHeading}</h2>
                {list(FROM_BROWSER, 0)}
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="label text-fg-muted">{d.mechanicsPage.rulesHeading}</h2>
                {list(FROM_THE_GAME, FROM_BROWSER.length)}
            </section>

            <p className="max-w-2xl border-l-2 border-border-strong pl-5 text-sm leading-relaxed text-fg-muted text-pretty">
                {d.mechanicsPage.outro}
            </p>
        </div>
    );
}
