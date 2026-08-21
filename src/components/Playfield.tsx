'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, ArrowRight, Moon, RotateCcw, Sun, Undo2, X } from 'lucide-react';
import {
    HUD_HEIGHT,
    MAX_CATCHUP,
    MIN_PLAYFIELD_H,
    MIN_PLAYFIELD_W,
    PLAYER_H,
    PLAYER_W,
    REWIND_EVERY,
    REWIND_SECONDS,
    REWIND_SPEED,
    STEP,
} from '@/game/constants';
import { orbCount, spawnState, step } from '@/game/engine';
import { motionOffset, present, resolve } from '@/game/geometry';
import type { Input, Level, PlayerState, Viewport } from '@/game/types';
import type { Dictionary } from '@/i18n';
import { format } from '@/i18n/format';
import {
    getResolvedTheme,
    getServerResolved,
    subscribeTheme,
    toggleResolvedTheme,
} from '@/lib/theme-store';

/**
 * L'AIRE DE JEU.
 *
 * Elle occupe la fenêtre entière, et ce n'est pas une décision d'affichage :
 * la géométrie des niveaux est une FONCTION de `innerWidth` et `innerHeight`.
 * Jouer dans un cadre plus petit que la fenêtre priverait le jeu de sa seule
 * mécanique.
 *
 * Le rendu se fait en éléments du document, pas dans un canevas — ce sont de
 * vraies boîtes, avec de vraies bordures, dans une vraie page. C'est cohérent
 * avec le propos, et ça donne gratuitement le thème, le contraste renforcé et
 * la mise à l'échelle du zoom.
 *
 * ⚠️ React ne rend les blocs QU'UNE FOIS par niveau. Tout ce qui bouge est
 * écrit directement dans le style par la boucle : re-rendre soixante fois par
 * seconde ferait tomber le jeu bien avant la physique.
 *
 * ⚠️ Le composant est REMONTÉ à chaque niveau (`key` posée par l'appelant).
 * C'est ce qui permet à tout l'état de partir de sa valeur initiale sans un
 * seul effet de remise à zéro.
 */

const HISTORY_LENGTH = Math.ceil(REWIND_SECONDS / STEP / REWIND_EVERY);

type Session =
    | { kind: 'puzzle'; level: Level }
    | { kind: 'endless'; level: Level; depth: number; seed: string };

export type PlayfieldProps = {
    session: Session;
    dictionary: Dictionary;
    onClose: () => void;
    /** Omis quand il n'y a pas de suite — le bouton disparaît alors. */
    onNext?: () => void;
    nextLabel?: string;
    /** Le lien à copier pour rejouer exactement cette partie. */
    shareUrl?: string;
    /** Appelé UNE FOIS quand le niveau est terminé. C'est le seul point par
     *  lequel la progression sort de l'aire de jeu. */
    onWin?: (seconds: number, tries: number) => void;
    /** Le nom de l'énigme, ou le palier en mode infini. */
    title: string;
};

function useViewport(): { view: Viewport; ready: boolean } {
    const [view, setView] = useState<Viewport>({ w: 0, h: 0 });

    useEffect(() => {
        const measure = () => {
            setView({ w: window.innerWidth, h: window.innerHeight - HUD_HEIGHT });
        };
        measure();
        window.addEventListener('resize', measure);
        // Le zoom par pincement et la barre d'URL mobile ne déclenchent pas
        // toujours `resize` : `visualViewport` est le seul à les rapporter.
        window.visualViewport?.addEventListener('resize', measure);
        return () => {
            window.removeEventListener('resize', measure);
            window.visualViewport?.removeEventListener('resize', measure);
        };
    }, []);

    return { view, ready: view.w > 0 };
}

const KEYS_LEFT = new Set(['ArrowLeft', 'a', 'A', 'q', 'Q']);
const KEYS_RIGHT = new Set(['ArrowRight', 'd', 'D']);
const KEYS_JUMP = new Set([' ', 'Spacebar', 'ArrowUp', 'w', 'W', 'z', 'Z']);

export function Playfield({
    session,
    dictionary,
    onClose,
    onNext,
    nextLabel,
    shareUrl,
    onWin,
    title,
}: PlayfieldProps) {
    const level = session.level;
    const { view, ready } = useViewport();
    const theme = useSyncExternalStore(subscribeTheme, getResolvedTheme, getServerResolved);

    const [won, setWon] = useState<{ time: number; tries: number } | null>(null);
    const [tries, setTries] = useState(1);
    const [copied, setCopied] = useState(false);

    const playerRef = useRef<HTMLDivElement | null>(null);
    const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timeRef = useRef<HTMLSpanElement | null>(null);
    const orbsRef = useRef<HTMLSpanElement | null>(null);
    const sizeRef = useRef<HTMLSpanElement | null>(null);
    const deathRef = useRef<HTMLParagraphElement | null>(null);

    // Tout l'état vivant tient dans une seule référence : le relire au prochain
    // rendu React n'aurait aucun sens, il change cent vingt fois par seconde.
    const game = useRef({
        player: null as PlayerState | null,
        history: [] as PlayerState[],
        frames: 0,
        tries: 1,
        rewinding: false,
        deadFor: 0,
        finished: false,
    });

    const input = useRef<Input>({ left: false, right: false, jump: false, jumpPressed: false });

    // Références « dernière valeur connue » : la boucle a besoin de la taille,
    // du thème et du rappel de victoire les plus récents, sans être reconstruite
    // — la reconstruire relancerait la partie à chaque pixel de
    // redimensionnement, c'est-à-dire pendant tout le geste du joueur.
    const viewRef = useRef(view);
    const themeRef = useRef(theme);
    const winRef = useRef(onWin);
    useEffect(() => {
        viewRef.current = view;
        themeRef.current = theme;
        winRef.current = onWin;
    });

    // Le défilement de la page derrière l'aire de jeu : la barre de défilement
    // reste visible et la molette fait bouger le document sous le personnage.
    // Rétabli au départ, y compris si la page avait déjà un `overflow` posé.
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    const totalOrbs = useMemo(() => orbCount(level), [level]);
    const playable = ready && view.w >= MIN_PLAYFIELD_W && view.h >= MIN_PLAYFIELD_H;

    const respawn = useCallback(() => {
        const state = game.current;
        state.player = spawnState(level, viewRef.current);
        state.history = [];
        state.frames = 0;
        state.rewinding = false;
        state.deadFor = 0;
    }, [level]);

    const restart = useCallback(() => {
        const state = game.current;
        state.finished = false;
        state.tries += 1;
        setWon(null);
        setTries(state.tries);
        respawn();
        if (deathRef.current) deathRef.current.textContent = '';
    }, [respawn]);

    // ── Clavier ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey) return;
            if (KEYS_LEFT.has(event.key)) {
                input.current.left = true;
            } else if (KEYS_RIGHT.has(event.key)) {
                input.current.right = true;
            } else if (KEYS_JUMP.has(event.key)) {
                if (!event.repeat) input.current.jumpPressed = true;
                input.current.jump = true;
            } else if (event.key === 'r' || event.key === 'R') {
                game.current.rewinding = true;
            } else if (event.key === 't' || event.key === 'T') {
                // Basculer le thème SANS quitter le clavier : sur les énigmes
                // à thème, aller chercher le bouton du pied de page ferait
                // perdre la partie à chaque fois.
                toggleResolvedTheme();
            } else if (event.key === 'Escape') {
                onClose();
                return;
            } else if (event.key === 'Enter') {
                restart();
                return;
            } else {
                return;
            }
            // La barre d'espace fait défiler la page et les flèches aussi :
            // sans ça, l'aire de jeu bouge sous le personnage.
            event.preventDefault();
        };

        const up = (event: KeyboardEvent) => {
            if (KEYS_LEFT.has(event.key)) input.current.left = false;
            else if (KEYS_RIGHT.has(event.key)) input.current.right = false;
            else if (KEYS_JUMP.has(event.key)) input.current.jump = false;
            else if (event.key === 'r' || event.key === 'R') game.current.rewinding = false;
        };

        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
        };
    }, [onClose, restart]);

    // ── Le bouton Précédent comme rembobinage ───────────────────────────────
    //
    // Réservé aux niveaux qui le déclarent : détourner le bouton Précédent sur
    // TOUT le jeu enfermerait le joueur dans la page, ce qui n'est pas une
    // mécanique mais un piège. Ici, la sortie reste à un clic (Échap, ou le
    // bouton Quitter), et l'entrée d'historique posée est retirée au départ.
    const armed = level.mechanics.includes('rewind');
    useEffect(() => {
        if (!armed) return;
        let leaving = false;
        let timer = 0;
        history.pushState({ reflowRewind: true }, '');

        const onPop = () => {
            if (leaving) return;
            game.current.rewinding = true;
            // Le rembobinage s'arrête tout seul : un appui sur Précédent en
            // vaut une demi-seconde, un maintien de R en vaut autant qu'on veut.
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                game.current.rewinding = false;
            }, 500);
            history.pushState({ reflowRewind: true }, '');
        };

        window.addEventListener('popstate', onPop);
        return () => {
            leaving = true;
            window.clearTimeout(timer);
            window.removeEventListener('popstate', onPop);
            if (history.state?.reflowRewind) history.back();
        };
    }, [armed]);

    // ── La boucle ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (!playable) return;
        let raf = 0;
        let last = performance.now();
        let accumulator = 0;

        const state = game.current;
        if (!state.player) respawn();

        const paint = () => {
            const player = state.player;
            if (!player) return;
            const currentView = viewRef.current;
            const currentTheme = themeRef.current;

            for (let index = 0; index < level.blocks.length; index += 1) {
                const element = blockRefs.current[index];
                if (!element) continue;
                const block = level.blocks[index]!;
                if (!present(block, currentView, currentTheme)) {
                    element.style.display = 'none';
                    continue;
                }
                const rect = resolve(block.rect, currentView);
                const offset = motionOffset(block, player.time);
                element.style.display = '';
                element.style.width = `${rect.w}px`;
                element.style.height = `${rect.h}px`;
                element.style.transform = `translate3d(${rect.x + offset.x}px, ${rect.y + offset.y}px, 0)`;
            }

            const avatar = playerRef.current;
            if (avatar) avatar.style.transform = `translate3d(${player.x}px, ${player.y}px, 0)`;

            if (timeRef.current) timeRef.current.textContent = player.time.toFixed(2);
            if (orbsRef.current && totalOrbs > 0) {
                let taken = 0;
                for (let bit = 0; bit < totalOrbs; bit += 1) {
                    if (player.orbs & (1 << bit)) taken += 1;
                }
                orbsRef.current.textContent = `${taken}/${totalOrbs}`;
            }
            if (sizeRef.current) sizeRef.current.textContent = `${currentView.w}×${currentView.h}`;
        };

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            const elapsed = Math.min((now - last) / 1000, MAX_CATCHUP);
            last = now;

            if (!state.player || state.finished) {
                paint();
                return;
            }

            if (state.deadFor > 0) {
                // Une pause très courte après la mort : sans elle, la mort et
                // la réapparition tombent sur la même image et on ne voit rien.
                state.deadFor -= elapsed;
                if (state.deadFor <= 0) {
                    state.tries += 1;
                    setTries(state.tries);
                    respawn();
                    if (deathRef.current) deathRef.current.textContent = '';
                }
                paint();
                return;
            }

            if (state.rewinding && state.history.length > 1) {
                const steps = Math.max(1, Math.round((elapsed / STEP / REWIND_EVERY) * REWIND_SPEED));
                for (let i = 0; i < steps && state.history.length > 1; i += 1) state.history.pop();
                const restored = state.history[state.history.length - 1];
                if (restored) state.player = { ...restored };
                accumulator = 0;
                paint();
                return;
            }

            accumulator += elapsed;
            let guard = 0;
            while (accumulator >= STEP && guard < 240) {
                accumulator -= STEP;
                guard += 1;

                const result = step(
                    level,
                    viewRef.current,
                    themeRef.current,
                    state.player,
                    input.current,
                    STEP,
                );
                input.current.jumpPressed = false;
                state.player = result.player;
                state.frames += 1;

                if (state.frames % REWIND_EVERY === 0) {
                    state.history.push({ ...result.player });
                    if (state.history.length > HISTORY_LENGTH) state.history.shift();
                }

                if (result.outcome === 'won') {
                    state.finished = true;
                    setWon({ time: result.player.time, tries: state.tries });
                    winRef.current?.(result.player.time, state.tries);
                    break;
                }
                if (result.outcome !== 'playing') {
                    state.deadFor = 0.22;
                    if (deathRef.current) {
                        deathRef.current.textContent = {
                            'dead-spike': dictionary.game.deadSpike,
                            'dead-fall': dictionary.game.deadFall,
                            'dead-crush': dictionary.game.deadCrush,
                        }[result.outcome];
                    }
                    break;
                }
            }

            paint();
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [dictionary, level, playable, respawn, totalOrbs]);

    const copyShare = useCallback(() => {
        if (!shareUrl) return;
        void navigator.clipboard?.writeText(shareUrl).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        });
    }, [shareUrl]);

    const matchesReference =
        Math.abs(view.w - level.reference.w) <= 40 && Math.abs(view.h - level.reference.h) <= 40;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg" role="application" aria-label={dictionary.game.title}>
            {/* La bande de commandes, en haut : elle tient lieu de barre
                d'outils, et les cotes qu'elle affiche SONT une information de
                jeu — c'est là qu'on lit la taille de sa propre fenêtre. */}
            <div
                className="flex shrink-0 items-center gap-2 border-b border-border-subtle bg-bg-elevated px-3"
                style={{ height: HUD_HEIGHT }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 border border-border-subtle px-2 py-1 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                >
                    <X aria-hidden="true" className="size-3.5" />
                    {dictionary.game.close}
                </button>
                <button
                    type="button"
                    onClick={restart}
                    className="flex items-center gap-1.5 border border-border-subtle px-2 py-1 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                >
                    <RotateCcw aria-hidden="true" className="size-3.5" />
                    {dictionary.game.restart}
                </button>
                <button
                    type="button"
                    onPointerDown={() => {
                        game.current.rewinding = true;
                    }}
                    onPointerUp={() => {
                        game.current.rewinding = false;
                    }}
                    onPointerLeave={() => {
                        game.current.rewinding = false;
                    }}
                    className="flex items-center gap-1.5 border border-border-subtle px-2 py-1 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                >
                    <Undo2 aria-hidden="true" className="size-3.5" />
                    {dictionary.game.rewind}
                </button>

                {/* La bascule de thème, DANS l'aire de jeu.
                    Sur les énigmes à thème, c'est une commande de jeu au même
                    titre que le saut — et l'aire couvre toute la fenêtre, donc
                    le sélecteur du pied de page est hors d'atteinte pendant la
                    partie. Il n'était joignable qu'en quittant le niveau. */}
                <button
                    type="button"
                    onClick={toggleResolvedTheme}
                    title={`${dictionary.mechanics.theme.name} (T)`}
                    className="flex items-center gap-1.5 border border-border-subtle px-2 py-1 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                >
                    {theme === 'dark' ? (
                        <Moon aria-hidden="true" className="size-3.5" />
                    ) : (
                        <Sun aria-hidden="true" className="size-3.5" />
                    )}
                    <span className="sr-only">{dictionary.mechanics.theme.name}</span>
                    <kbd className="numeric text-[0.65rem] text-fg-muted">T</kbd>
                </button>

                <p className="ml-3 hidden truncate text-xs text-fg md:block">{title}</p>

                <p className="ml-auto flex items-center gap-3 text-xs text-fg-muted">
                    <span className="hidden sm:inline">{format(dictionary.game.attempts, { count: tries })}</span>
                    {totalOrbs > 0 && (
                        <span className="numeric">
                            <span className="label mr-1 text-fg-muted">{dictionary.game.orbs}</span>
                            <span ref={orbsRef} className="text-orb">
                                0/{totalOrbs}
                            </span>
                        </span>
                    )}
                    <span className="numeric">
                        <span ref={timeRef}>0.00</span> s
                    </span>
                    {/* La cote : la taille courante, et celle à laquelle le
                        niveau a été conçu. Elle passe au violet quand les deux
                        se rejoignent — c'est un repère, pas une solution. */}
                    <span
                        className={`numeric border px-2 py-0.5 ${
                            matchesReference ? 'border-accent text-accent' : 'border-border-subtle text-fg-muted'
                        }`}
                        title={`${level.reference.w}×${level.reference.h}`}
                    >
                        <span ref={sizeRef}>
                            {view.w}×{view.h}
                        </span>
                    </span>
                </p>
            </div>

            {/* L'aire elle-même. `overflow-hidden` et non `visible` : un bloc
                ancré à un bord peut sortir du cadre quand la fenêtre change de
                taille, et il ne doit alors pas allonger la page. */}
            <div className="playfield-grid relative flex-1 overflow-hidden">
                {!playable && (
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                        <h2 className="text-lg font-semibold">{dictionary.game.tooSmall}</h2>
                        <p className="max-w-sm text-sm text-fg-muted">
                            {format(dictionary.game.tooSmallBody, { w: MIN_PLAYFIELD_W, h: MIN_PLAYFIELD_H })}
                        </p>
                    </div>
                )}

                {playable && (
                    <>
                        {level.blocks.map((block, index) => (
                            <div
                                key={index}
                                ref={(element) => {
                                    blockRefs.current[index] = element;
                                }}
                                aria-hidden="true"
                                className={`absolute top-0 left-0 will-change-transform ${
                                    block.kind === 'solid'
                                        ? 'border-t-2 border-t-[var(--solid-edge)] bg-[var(--solid)]'
                                        : block.kind === 'spike'
                                          ? 'bg-[var(--hazard)]'
                                          : block.kind === 'goal'
                                            ? 'border-2 border-[var(--goal)] bg-[var(--goal-glow)]'
                                            : 'border-2 border-[var(--orb)]'
                                }`}
                            />
                        ))}

                        <div
                            ref={playerRef}
                            aria-hidden="true"
                            className="absolute top-0 left-0 border-2 border-[var(--player-edge)] bg-[var(--player)] will-change-transform"
                            style={{ width: PLAYER_W, height: PLAYER_H }}
                        />

                        {/* Le sol mortel se signale : sans marque, une chute
                            paraît un bug plutôt qu'une règle. */}
                        {level.floor === 'deadly' && (
                            <div
                                aria-hidden="true"
                                className="absolute inset-x-0 bottom-0 h-1 bg-[var(--hazard)] opacity-70"
                            />
                        )}

                        <p
                            ref={deathRef}
                            aria-live="polite"
                            className="pointer-events-none absolute inset-x-0 top-8 text-center text-sm font-semibold text-hazard"
                        />

                        {armed && (
                            <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-fg-muted">
                                {dictionary.game.rewindArmed}
                            </p>
                        )}
                    </>
                )}

                {won && (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg/85 px-6">
                        <div className="w-full max-w-sm border border-border-strong bg-bg-elevated p-5">
                            <p className="label text-goal">{dictionary.game.won}</p>
                            <p className="numeric mt-2 text-lg text-fg">
                                {won.tries === 1
                                    ? format(dictionary.game.wonInOne, { time: won.time.toFixed(2) })
                                    : format(dictionary.game.wonIn, {
                                          time: won.time.toFixed(2),
                                          count: won.tries,
                                      })}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {onNext && (
                                    <button
                                        type="button"
                                        onClick={onNext}
                                        className="border border-accent bg-accent px-3 py-1.5 text-sm text-accent-contrast transition-opacity hover:opacity-90"
                                    >
                                        {nextLabel}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={restart}
                                    className="border border-border-strong px-3 py-1.5 text-sm text-fg transition-colors hover:bg-bg-sunken"
                                >
                                    {dictionary.game.retry}
                                </button>
                                {shareUrl && (
                                    <button
                                        type="button"
                                        onClick={copyShare}
                                        className="border border-border-strong px-3 py-1.5 text-sm text-fg transition-colors hover:bg-bg-sunken"
                                    >
                                        {copied ? dictionary.game.copied : dictionary.game.share}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="border border-border-subtle px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                                >
                                    {dictionary.game.backToCatalogue}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Commandes tactiles. Le jeu réclame un clavier ET une fenêtre
                    redimensionnable, ce qu'un téléphone n'a pas — mais refuser
                    net priverait un visiteur curieux de tout aperçu. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-3 sm:hidden">
                    <div className="pointer-events-auto flex gap-2">
                        <TouchKey
                            label={dictionary.game.controlMove}
                            onDown={() => {
                                input.current.left = true;
                            }}
                            onUp={() => {
                                input.current.left = false;
                            }}
                        >
                            <ArrowLeft aria-hidden="true" className="size-5" />
                        </TouchKey>
                        <TouchKey
                            label={dictionary.game.controlMove}
                            onDown={() => {
                                input.current.right = true;
                            }}
                            onUp={() => {
                                input.current.right = false;
                            }}
                        >
                            <ArrowRight aria-hidden="true" className="size-5" />
                        </TouchKey>
                    </div>
                    <TouchKey
                        label={dictionary.game.controlJump}
                        onDown={() => {
                            input.current.jump = true;
                            input.current.jumpPressed = true;
                        }}
                        onUp={() => {
                            input.current.jump = false;
                        }}
                    >
                        <span className="text-xs">{dictionary.game.controlJump}</span>
                    </TouchKey>
                </div>
            </div>
        </div>
    );
}

function TouchKey({
    label,
    onDown,
    onUp,
    children,
}: {
    label: string;
    onDown: () => void;
    onUp: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            onPointerDown={(event) => {
                event.preventDefault();
                onDown();
            }}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onUp}
            className="pointer-events-auto flex size-14 touch-none items-center justify-center border border-border-strong bg-bg-elevated/90 text-fg"
        >
            {children}
        </button>
    );
}
