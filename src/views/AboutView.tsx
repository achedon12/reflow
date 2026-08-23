import { ClearProgress } from '@/components/ClearProgress';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { AUTHOR } from '@/lib/site';

export function AboutView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-3">
                <h1 className="text-3xl text-balance sm:text-4xl">{d.about.heading}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{d.about.lede}</p>
            </header>

            <div className="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
                {d.about.sections.map((section) => (
                    <section key={section.title} className="flex flex-col gap-2 bg-bg p-6">
                        <h2 className="text-lg">{section.title}</h2>
                        <p className="text-sm leading-relaxed text-fg-muted text-pretty">
                            {/* Le nom de l'auteur est un jeton dans la phrase :
                                le découper en dur autour marcherait en
                                français et casserait dans les trois autres. */}
                            {section.body.split('{author}').map((part, index, parts) => (
                                <span key={index}>
                                    {part}
                                    {index < parts.length - 1 && (
                                        <a
                                            href={AUTHOR.site}
                                            rel="author"
                                            className="tap text-fg no-underline underline-offset-2 hover:text-accent hover:underline"
                                        >
                                            {AUTHOR.name}
                                        </a>
                                    )}
                                </span>
                            ))}
                        </p>
                    </section>
                ))}
            </div>

            {/* Le bouton d'effacement. La page de confidentialité renvoie ici :
                les deux se tiennent, ou aucune des deux n'est vraie. */}
            <section className="panel p-6">
                <h2 className="text-lg">{d.about.clearTitle}</h2>
                <p className="mt-2 max-w-xl text-sm text-fg-muted text-pretty">{d.about.clearBody}</p>
                <div className="mt-4">
                    <ClearProgress dictionary={d.about} />
                </div>
            </section>

            <section className="panel p-6">
                <h2 className="text-lg">{d.about.contactTitle}</h2>
                <p className="mt-2 text-sm text-fg-muted">
                    {d.about.contactBody}{' '}
                    <a
                        href={`mailto:${AUTHOR.email}`}
                        className="tap text-fg no-underline underline-offset-2 hover:text-accent hover:underline"
                    >
                        {AUTHOR.email}
                    </a>
                </p>
            </section>
        </div>
    );
}
