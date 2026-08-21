/**
 * Générateur pseudo-aléatoire déterministe.
 *
 * `Math.random()` ne convient pas : une partie doit pouvoir être REJOUÉE à
 * l'identique depuis sa graine, et partagée par un lien. C'est aussi ce qui
 * permet au vérificateur de niveaux de rejouer exactement la même génération
 * que le navigateur.
 *
 * mulberry32 : trente-deux bits d'état, une multiplication et trois décalages.
 * Sa qualité statistique dépasse de loin ce qu'un placement de plateformes
 * demande, et il tient en cinq lignes — donc rien à auditer.
 */
export function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return function next() {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export type Rng = {
    /** Réel dans [min, max[. */
    range: (min: number, max: number) => number;
    /** Entier dans [min, max]. */
    int: (min: number, max: number) => number;
    /** Vrai avec la probabilité donnée. */
    chance: (probability: number) => boolean;
    /** Un élément au hasard. Lève sur un tableau vide plutôt que de rendre
     *  `undefined` : un tirage vide est toujours un bug d'appel. */
    pick: <T>(items: readonly T[]) => T;
};

export function makeRng(seed: number): Rng {
    const next = mulberry32(seed);
    const range = (min: number, max: number) => min + next() * (max - min);
    return {
        range,
        int: (min, max) => Math.floor(range(min, max + 1)),
        chance: (probability) => next() < probability,
        pick: <T,>(items: readonly T[]): T => {
            const item = items[Math.floor(next() * items.length)];
            if (item === undefined) throw new Error('pick sur un tableau vide');
            return item;
        },
    };
}

/**
 * Transforme une chaîne en graine numérique — FNV-1a 32 bits.
 *
 * Sert aux graines écrites à la main dans une URL partagée : « bonjour » doit
 * donner le même niveau pour tout le monde, et un identifiant lisible se
 * retient mieux qu'un nombre à dix chiffres.
 */
export function hashSeed(text: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i += 1) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
}
