'use client';

import { THEME_COLORS } from './theme';

/**
 * Le thème, lu là où il vit vraiment.
 *
 * `localStorage` est un état EXTÉRIEUR à React : le recopier dans un `useState`
 * marche, mais duplique la source de vérité et se désynchronise entre deux
 * onglets. Ce module l'expose sous la forme qu'attend `useSyncExternalStore`.
 *
 * Dans Reflow, ce n'est pas qu'un réglage d'apparence : des blocs n'existent
 * que dans un thème. Le moteur du jeu s'abonne au même magasin que le bouton.
 */

export type Theme = 'system' | 'light' | 'dark';
export type Resolved = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const listeners = new Set<() => void>();

function notify(): void {
    for (const listener of listeners) listener();
}

export function subscribeTheme(listener: () => void): () => void {
    listeners.add(listener);
    // L'événement `storage` ne se déclenche QUE dans les autres onglets : d'où
    // la liste d'abonnés, qui couvre l'onglet courant.
    window.addEventListener('storage', listener);
    // Le thème « système » suit la machine : sans cet abonnement, basculer le
    // système en pleine partie ne ferait pas apparaître les blocs concernés.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', listener);
        media.removeEventListener('change', listener);
    };
}

export function getTheme(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : 'system';
    } catch {
        // Stockage indisponible : « système » reste un défaut valable.
        return 'system';
    }
}

export function getResolvedTheme(): Resolved {
    const theme = getTheme();
    if (theme !== 'system') return theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** L'instantané rendu côté serveur. Le HTML livré n'a aucun attribut de thème :
 *  c'est donc « système », et le premier rendu client doit dire la même chose
 *  sous peine d'erreur d'hydratation. */
export function getServerTheme(): Theme {
    return 'system';
}

export function getServerResolved(): Resolved {
    return 'dark';
}

export function applyTheme(next: Theme): void {
    try {
        if (next === 'system') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, next);
    } catch {
        // Le thème s'applique quand même, il ne survivra pas au rechargement.
    }

    if (next === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', next);

    // La barre d'adresse doit suivre le clic, pas le rechargement suivant. En
    // « système », chaque balise retrouve la couleur de SA requête média —
    // c'est l'attribut `media` qui dit laquelle, pas l'ordre du document.
    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
        const scheme = meta.media.includes('dark') ? 'dark' : 'light';
        meta.content = next === 'system' ? THEME_COLORS[scheme] : THEME_COLORS[next];
    }

    notify();
}

/** Bascule entre clair et sombre en partant de l'état RÉSOLU. Utilisé par le
 *  jeu : au clavier, « inverser » doit toujours changer quelque chose à
 *  l'écran, ce qu'un cycle passant par « système » ne garantit pas. */
export function toggleResolvedTheme(): void {
    applyTheme(getResolvedTheme() === 'dark' ? 'light' : 'dark');
}
