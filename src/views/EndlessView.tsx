'use client';

import { useEffect, useRef } from 'react';
import { useGame } from '@/components/GameProvider';
import { useProgress } from '@/components/useProgress';
import type { Dictionary } from '@/i18n';
import { format } from '@/i18n/format';

/**
 * Le mode infini.
 *
 * La graine se lit dans la barre d'adresse (`?p=graine-palier`) plutôt que dans
 * le fragment : le fragment est réservé au rembobinage par l'historique, et
 * deux mécaniques qui écrivent au même endroit finiraient par se marcher
 * dessus.
 *
 * ⚠️ Lue dans un effet et non par `useSearchParams` : en export statique, ce
 * dernier impose une frontière `Suspense` et fait basculer la page en rendu
 * client — pour un paramètre que `location.search` donne directement.
 */
export function EndlessView({ dictionary }: { dictionary: Dictionary }) {
    const d = dictionary;
    const { startEndless } = useGame();
    const progress = useProgress();
    // Champ NON CONTRÔLÉ : sa valeur n'intéresse personne avant l'envoi du
    // formulaire, et la tenir dans un état obligerait à la poser depuis
    // l'effet qui lit l'URL — une cascade de rendus pour rien.
    const seedRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const parameter = new URLSearchParams(window.location.search).get('p');
        if (!parameter) return;
        // `graine-palier` : la graine peut contenir des tirets, seul le DERNIER
        // segment est le palier.
        const cut = parameter.lastIndexOf('-');
        const label = cut > 0 ? parameter.slice(0, cut) : parameter;
        const depth = cut > 0 ? Number.parseInt(parameter.slice(cut + 1), 10) : 1;
        if (seedRef.current) seedRef.current.value = label;
        startEndless(label, Number.isFinite(depth) && depth > 0 ? depth : 1);
    }, [startEndless]);

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-3">
                <h1 className="max-w-2xl text-3xl text-balance sm:text-4xl">{d.endless.heading}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{d.endless.lede}</p>
            </header>

            <section className="border border-border-subtle p-6">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => startEndless()}
                        className="border border-accent bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
                    >
                        {d.endless.start}
                    </button>
                    <span className="numeric text-sm text-fg-muted">
                        {progress.endlessBest > 0
                            ? format(d.endless.record, { depth: progress.endlessBest })
                            : d.endless.recordEmpty}
                    </span>
                </div>

                <form
                    className="mt-6 flex flex-wrap items-end gap-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        startEndless(seedRef.current?.value.trim() || undefined, 1);
                    }}
                >
                    <label className="flex flex-col gap-1.5">
                        <span className="label text-fg-muted">{d.endless.seedLabel}</span>
                        <input
                            ref={seedRef}
                            name="seed"
                            defaultValue=""
                            placeholder={d.endless.seedPlaceholder}
                            maxLength={32}
                            className="numeric w-56 border border-border-strong bg-bg-elevated px-3 py-1.5 text-sm text-fg outline-none focus-visible:border-accent"
                        />
                    </label>
                    <button
                        type="submit"
                        className="border border-border-strong px-3 py-1.5 text-sm text-fg transition-colors hover:bg-bg-sunken"
                    >
                        {d.endless.seedApply}
                    </button>
                </form>
                <p className="mt-2 max-w-md text-xs text-fg-muted">{d.endless.seedHelp}</p>
            </section>

            <div className="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
                {d.endless.sections.map((section) => (
                    <section key={section.title} className="flex flex-col gap-2 bg-bg p-6">
                        <h2 className="text-lg">{section.title}</h2>
                        <p className="text-sm leading-relaxed text-fg-muted text-pretty">{section.body}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}
