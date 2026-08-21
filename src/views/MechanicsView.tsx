import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import type { Mechanic } from '@/game/types';

const ORDER: Mechanic[] = ['resize', 'edge', 'appear', 'motion', 'theme', 'rewind', 'orbs', 'crush'];

export function MechanicsView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-3">
                <h1 className="max-w-2xl text-3xl text-balance sm:text-4xl">{d.mechanicsPage.heading}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{d.mechanicsPage.lede}</p>
            </header>

            <p className="max-w-2xl text-base leading-relaxed text-fg text-pretty">{d.mechanicsPage.intro}</p>

            <ul className="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
                {ORDER.map((key, index) => (
                    <li key={key} className="flex flex-col gap-2 bg-bg p-6">
                        <span className="numeric text-xs text-accent">{String(index + 1).padStart(2, '0')}</span>
                        <h2 className="text-lg">{d.mechanics[key].name}</h2>
                        <p className="text-sm leading-relaxed text-fg-muted text-pretty">{d.mechanics[key].body}</p>
                    </li>
                ))}
            </ul>

            <p className="max-w-2xl border-l-2 border-border-strong pl-5 text-sm leading-relaxed text-fg-muted text-pretty">
                {d.mechanicsPage.outro}
            </p>
        </div>
    );
}
