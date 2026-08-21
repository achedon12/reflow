// Les dictionnaires ne portent QUE des chaînes : une fonction ne survivrait
// pas au passage de la frontière serveur → client.
export function format(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => {
        const value = values[key];
        return value === undefined ? match : String(value);
    });
}

