// Les dictionnaires ne portent QUE des chaînes : une fonction ne survivrait
// pas au passage de la frontière serveur → client.
export function format(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => {
        const value = values[key];
        return value === undefined ? match : String(value);
    });
}

/**
 * Choisit entre singulier et pluriel.
 *
 * Volontairement binaire : les quatre langues du site accordent toutes au-delà
 * de un, et `Intl.PluralRules` demanderait de porter une clé par catégorie
 * (`one`, `few`, `many`, `other`) dans des dictionnaires qui n'en ont pas
 * besoin.
 */
export function plural(count: number, one: string, many: string, values: Record<string, string | number> = {}): string {
    return format(count === 1 ? one : many, { count, ...values });
}
