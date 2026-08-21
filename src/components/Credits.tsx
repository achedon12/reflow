import { Fragment } from 'react';
import type { Dictionary } from '@/i18n';
import { format } from '@/i18n/format';
import { APP_VERSION, AUTHOR, HUB_URL, REPOSITORY } from '@/lib/site';

const linkClass =
    'tap text-fg no-underline underline-offset-2 transition-colors hover:text-accent hover:underline';

/** Le jeton `{author}` devient un lien. Découper la phrase en dur autour du
 *  nom marcherait en français et casserait dans les autres langues. */
function AuthorLine({ template }: { template: string }) {
    const parts = template.split('{author}');
    return (
        <>
            {parts.map((part, i) => (
                <Fragment key={i}>
                    {part}
                    {i < parts.length - 1 && (
                        <a href={AUTHOR.site} rel="author" className={linkClass}>
                            {AUTHOR.name}
                        </a>
                    )}
                </Fragment>
            ))}
        </>
    );
}

export function Credits({ dictionary }: { dictionary: Dictionary }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[0.72rem] text-fg-muted">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <AuthorLine template={dictionary.footer.madeBy} />
                <span aria-hidden="true" className="text-border-strong">
                    ·
                </span>
                {/* Le lien retour vers le panneau : c'est lui qui fait circuler
                    les joueurs d'un jeu à l'autre. */}
                <a href={HUB_URL} className={linkClass}>
                    {dictionary.footer.otherGames}
                </a>
                <span aria-hidden="true" className="text-border-strong">
                    ·
                </span>
                <a href={REPOSITORY} rel="noopener" className={linkClass}>
                    {dictionary.footer.source}
                </a>
            </span>
            <span className="numeric">{format(dictionary.footer.versionLabel, { version: APP_VERSION })}</span>
        </div>
    );
}
