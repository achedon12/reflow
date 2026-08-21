/**
 * La progression du joueur, dans SON navigateur et nulle part ailleurs.
 *
 * Aucun compte, aucun envoi : ces données ne quittent jamais la machine. Elles
 * peuvent donc être éditées à la main par le joueur, ce dont il faut se
 * protéger — tout ce qui sort d'ici est revalidé, jamais cru sur parole.
 */

const KEY = 'reflow:progress';

export type PuzzleRecord = {
    /** Meilleur temps, en secondes. */
    time: number;
    /** Nombre de tentatives lors de la partie réussie. */
    tries: number;
};

export type Progress = {
    puzzles: Record<string, PuzzleRecord>;
    /** Le palier le plus profond atteint en mode infini. */
    endlessBest: number;
};

const EMPTY: Progress = { puzzles: {}, endlessBest: 0 };

function parse(raw: string | null): Progress {
    if (!raw) return { ...EMPTY, puzzles: {} };
    try {
        const value: unknown = JSON.parse(raw);
        if (typeof value !== 'object' || value === null) return { ...EMPTY, puzzles: {} };
        const source = value as Partial<Record<keyof Progress, unknown>>;
        const puzzles: Record<string, PuzzleRecord> = {};
        if (typeof source.puzzles === 'object' && source.puzzles !== null) {
            for (const [id, record] of Object.entries(source.puzzles as Record<string, unknown>)) {
                if (typeof record !== 'object' || record === null) continue;
                const entry = record as Partial<PuzzleRecord>;
                if (typeof entry.time !== 'number' || !Number.isFinite(entry.time)) continue;
                if (typeof entry.tries !== 'number' || !Number.isFinite(entry.tries)) continue;
                puzzles[id] = { time: entry.time, tries: entry.tries };
            }
        }
        const best = typeof source.endlessBest === 'number' && Number.isFinite(source.endlessBest)
            ? Math.max(0, Math.floor(source.endlessBest))
            : 0;
        return { puzzles, endlessBest: best };
    } catch {
        return { ...EMPTY, puzzles: {} };
    }
}

/**
 * Le magasin, tel que `useSyncExternalStore` l'attend.
 *
 * L'instantané doit être STABLE d'un appel à l'autre : rendre un nouvel objet
 * à chaque lecture ferait boucler React indéfiniment. D'où le cache, invalidé
 * à chaque écriture — et lui seul.
 */
let snapshot: Progress | null = null;
const listeners = new Set<() => void>();

/** L'instantané du rendu serveur. Le HTML est produit à la construction : il ne
 *  connaît aucune progression, et l'objet doit être le MÊME à chaque appel. */
const SERVER_SNAPSHOT: Progress = { puzzles: {}, endlessBest: 0 };

export function subscribeProgress(listener: () => void): () => void {
    listeners.add(listener);
    // Une autre onglet peut avoir terminé une énigme entre-temps.
    window.addEventListener('storage', listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', listener);
    };
}

export function progressSnapshot(): Progress {
    if (!snapshot) snapshot = loadProgress();
    return snapshot;
}

export function serverProgressSnapshot(): Progress {
    return SERVER_SNAPSHOT;
}

function invalidate(next: Progress): void {
    snapshot = next;
    for (const listener of listeners) listener();
}

export function loadProgress(): Progress {
    try {
        return parse(localStorage.getItem(KEY));
    } catch {
        // Stockage indisponible (navigation privée, cookies bloqués) : on joue
        // sans mémoire, ce qui reste parfaitement jouable.
        return { ...EMPTY, puzzles: {} };
    }
}

export function saveProgress(progress: Progress): void {
    try {
        localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
        // L'échec d'écriture ne doit jamais interrompre la partie.
    }
    // ⚠️ Un objet NEUF, et pas celui qu'on vient d'écrire : React compare les
    // instantanés par identité, et muter celui qu'il tient en main ne
    // déclencherait aucun rendu.
    invalidate({ puzzles: { ...progress.puzzles }, endlessBest: progress.endlessBest });
}

/** Enregistre une énigme terminée. Le meilleur temps l'emporte. */
export function recordPuzzle(id: string, time: number, tries: number): Progress {
    const progress = loadProgress();
    const previous = progress.puzzles[id];
    if (!previous || time < previous.time) {
        progress.puzzles[id] = { time, tries };
        saveProgress(progress);
    }
    return progress;
}

export function recordEndless(depth: number): Progress {
    const progress = loadProgress();
    if (depth > progress.endlessBest) {
        progress.endlessBest = depth;
        saveProgress(progress);
    }
    return progress;
}
