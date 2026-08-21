import { Fragment } from 'react';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { AUTHOR, HOST } from '@/lib/site';

const LINK = 'text-fg no-underline underline-offset-2 hover:text-accent hover:underline';

/**
 * Remplace les jetons d'un paragraphe par leurs valeurs.
 *
 * Le nom de l'auteur devient un LIEN, les coordonnées de l'hébergeur du texte
 * simple. Les dictionnaires ne portent que des chaînes, et chaque langue place
 * ces éléments là où sa grammaire l'exige — découper la phrase en dur
 * marcherait en français et casserait ailleurs.
 */
function Filled({ template }: { template: string }) {
    const values: Record<string, string> = {
        host: HOST.name,
        address: HOST.address,
        phone: HOST.phone,
        registration: HOST.registration,
    };
    const parts = template.split(/(\{author\}|\{host\}|\{address\}|\{phone\}|\{registration\})/g);
    return (
        <>
            {parts.map((part, index) => {
                if (part === '{author}') {
                    return (
                        <a key={index} href={AUTHOR.site} rel="author" className={LINK}>
                            {AUTHOR.name}
                        </a>
                    );
                }
                const token = part.startsWith('{') ? values[part.slice(1, -1)] : undefined;
                return <Fragment key={index}>{token ?? part}</Fragment>;
            })}
        </>
    );
}

/**
 * Page de texte à sections : mentions légales et confidentialité.
 *
 * Une seule vue plutôt que deux presque identiques : ces pages répondent au
 * même genre de question — un intitulé, une réponse — et leur mise en page n'a
 * aucune raison de diverger.
 */
export function TextPageView({ locale, page }: { locale: Locale; page: 'legal' | 'privacy' }) {
    const d = getDictionary(locale);
    const copy = d[page];

    return (
        <article className="flex flex-col gap-10">
            <header className="flex flex-col gap-3">
                <h1 className="text-3xl text-balance sm:text-4xl">{copy.heading}</h1>
                <p className="max-w-xl text-lg text-fg-muted text-pretty">{copy.lede}</p>
            </header>

            <dl className="grid gap-px border border-border-subtle bg-border-subtle">
                {copy.sections.map((section) => (
                    <div key={section.title} className="flex flex-col gap-2 bg-bg p-6">
                        <dt className="label text-fg-muted">{section.title}</dt>
                        <dd className="m-0 max-w-2xl text-sm leading-relaxed text-fg text-pretty">
                            <Filled template={section.body} />
                        </dd>
                    </div>
                ))}

                <div className="flex flex-col gap-2 bg-bg p-6">
                    <dt className="label text-fg-muted">{copy.contactTitle}</dt>
                    <dd className="m-0 text-sm leading-relaxed text-fg">
                        {copy.contactBody}{' '}
                        <a href={`mailto:${AUTHOR.email}`} className={LINK}>
                            {AUTHOR.email}
                        </a>
                    </dd>
                </div>
            </dl>
        </article>
    );
}
