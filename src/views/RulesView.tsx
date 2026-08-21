import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';

export function RulesView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-3">
                <h1 className="text-3xl text-balance sm:text-4xl">{d.rules.heading}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{d.rules.lede}</p>
            </header>

            {/* Une liste ORDONNÉE : les six points se lisent dans l'ordre, et
                c'est aussi ce qui les fait comprendre comme un mode d'emploi
                par un moteur de recherche. */}
            <ol className="grid gap-px border border-border-subtle bg-border-subtle">
                {d.rules.steps.map((stepCopy, index) => (
                    <li key={stepCopy.title} className="flex gap-5 bg-bg p-6">
                        <span className="numeric shrink-0 text-sm text-accent">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex flex-col gap-1.5">
                            <h2 className="text-lg">{stepCopy.title}</h2>
                            <p className="max-w-2xl text-sm leading-relaxed text-fg-muted text-pretty">
                                {stepCopy.body}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
