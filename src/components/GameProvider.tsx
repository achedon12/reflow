'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { LEVELS, levelById } from '@/data/levels';
import { generateLevel } from '@/game/generator';
import { prefersReducedMotion, slowMotion } from '@/game/reduced-motion';
import { hashSeed } from '@/game/rng';
import type { Level } from '@/game/types';
import type { GameStrings } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { startingScreen } from './useScreen';
import { path } from '@/i18n/routes';
import { recordEndless, recordPuzzle } from '@/lib/progress';
import { Playfield } from './Playfield';

/**
 * Le lanceur de parties.
 *
 * Il vit dans le châssis, au-dessus de toutes les pages : n'importe quel bouton
 * du site peut ouvrir l'aire de jeu sans changer d'URL. Les pages restent donc
 * du HTML indexable, et le jeu se superpose — plutôt que l'inverse, où le
 * moteur de recherche ne trouverait qu'un canevas vide.
 */

type Session =
    | { kind: 'puzzle'; level: Level }
    | { kind: 'endless'; level: Level; depth: number; seed: string };

type GameApi = {
    startPuzzle: (id: string) => void;
    startEndless: (seed?: string, depth?: number) => void;
    close: () => void;
};

const GameContext = createContext<GameApi | null>(null);

export function useGame(): GameApi {
    const api = useContext(GameContext);
    if (!api) throw new Error('useGame doit être appelé sous <GameProvider>');
    return api;
}

/**
 * La taille de référence d'une partie engendrée : la fenêtre RÉELLE du joueur.
 *
 * ⚠️ Elle n'est bornée que par le BAS. La borner par le haut paraissait
 * prudent et produisait exactement l'inverse : sur une fenêtre plus large que
 * la borne, la partie démarrait déjà disloquée — le chemin écartelé, la sortie
 * hors d'atteinte — avant que le joueur n'ait touché à quoi que ce soit.
 *
 * Engendrer à la taille courante garantit qu'une partie est jouable dès la
 * première image. C'est ensuite au joueur de la déformer, s'il le veut.
 */
/** Une graine lisible tirée au hasard. Un mot se retient et se dicte ; un
 *  nombre à dix chiffres ne se partage qu'en copiant-collant. */
function randomSeed(): string {
    return Math.random().toString(36).slice(2, 8);
}

export function GameProvider({
    locale,
    dictionary,
    children,
}: {
    locale: Locale;
    dictionary: GameStrings;
    children: ReactNode;
}) {
    const [session, setSession] = useState<Session | null>(null);

    // Le réglage est lu au LANCEMENT et non pendant la partie : le changer en
    // plein saut ferait bouger le décor sous le joueur.
    const startPuzzle = useCallback((id: string) => {
        const level = levelById(id);
        if (level) setSession({ kind: 'puzzle', level: prefersReducedMotion() ? slowMotion(level) : level });
    }, []);

    const startEndless = useCallback((seed?: string, depth = 1) => {
        const label = seed && seed.trim() ? seed.trim() : randomSeed();
        const generated = generateLevel({
            seed: hashSeed(label),
            depth,
            reference: startingScreen(),
        });
        const level = prefersReducedMotion() ? slowMotion(generated) : generated;
        setSession({ kind: 'endless', level, depth, seed: label });
    }, []);

    const close = useCallback(() => setSession(null), []);

    const api = useMemo<GameApi>(
        () => ({ startPuzzle, startEndless, close }),
        [close, startEndless, startPuzzle],
    );

    const next = useCallback(() => {
        if (!session) return;
        if (session.kind === 'endless') {
            startEndless(session.seed, session.depth + 1);
            return;
        }
        const index = LEVELS.findIndex((level) => level.id === session.level.id);
        const following = LEVELS[index + 1];
        if (following) {
            setSession({
                kind: 'puzzle',
                level: prefersReducedMotion() ? slowMotion(following) : following,
            });
        } else setSession(null);
    }, [session, startEndless]);

    const onWin = useCallback(
        (seconds: number, tries: number) => {
            if (!session) return;
            if (session.kind === 'puzzle') recordPuzzle(session.level.id, seconds, tries);
            else recordEndless(session.depth);
        },
        [session],
    );

    const hasNext =
        session?.kind === 'endless' ||
        (session?.kind === 'puzzle' &&
            LEVELS.findIndex((level) => level.id === session.level.id) < LEVELS.length - 1);

    const shareUrl =
        session?.kind === 'endless' && typeof window !== 'undefined'
            ? `${window.location.origin}${path('endless', locale)}?p=${encodeURIComponent(session.seed)}-${session.depth}`
            : undefined;

    return (
        <GameContext.Provider value={api}>
            {children}
            {session && (
                // ⚠️ La `key` n'est pas décorative : elle REMONTE l'aire de jeu
                // à chaque niveau. C'est ce qui garantit qu'aucun état de la
                // partie précédente ne survit, sans un seul effet de remise à
                // zéro à tenir à jour.
                <Playfield
                    key={session.kind === 'endless' ? `${session.seed}-${session.depth}` : session.level.id}
                    session={session}
                    dictionary={dictionary}
                    onClose={close}
                    onNext={hasNext ? next : undefined}
                    nextLabel={
                        session.kind === 'endless'
                            ? format(dictionary.endless.depth, { depth: session.depth + 1 })
                            : dictionary.game.next
                    }
                    shareUrl={shareUrl}
                    onWin={onWin}
                    title={
                        session.kind === 'endless'
                            ? `${format(dictionary.endless.depth, { depth: session.depth })} — ${session.seed}`
                            : dictionary.titles[session.level.id] ?? session.level.id
                    }
                />
            )}
        </GameContext.Provider>
    );
}
