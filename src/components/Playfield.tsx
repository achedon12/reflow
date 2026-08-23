'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Lightbulb,
    Moon,
    RotateCcw,
    RotateCw,
    Sun,
    Undo2,
    X,
} from 'lucide-react';
import {
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
import { decisiveMechanic, hintCount, unlockedHints } from '@/game/hints';
import { playViewport, reframePlayer, solveBlocks } from '@/game/geometry';
import type { Block, Input, Level, PlayerState, Quarter } from '@/game/types';
import type { GameStrings } from '@/i18n';
import { format } from '@/i18n/format';
import { loadProgress, recordHints } from '@/lib/progress';
import { ScreenHandles } from './ScreenHandles';
import { ScreenRuler } from './ScreenRuler';
import { useScreen } from './useScreen';
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
    dictionary: GameStrings;
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
    const { screen, ref: screenRef, resize, turn } = useScreen();
    const view = { w: screen.w, h: screen.h };
    const theme = useSyncExternalStore(subscribeTheme, getResolvedTheme, getServerResolved);

    const [won, setWon] = useState<{ time: number; tries: number } | null>(null);
    const [tries, setTries] = useState(1);
    const [copied, setCopied] = useState(false);

    // L'énigme dont les indices sont MÉMORISÉS. Le mode infini n'en garde
    // aucun : une partie engendrée ne se retrouve pas.
    const persisted = session.kind === 'puzzle' ? level.id : null;

    // Les indices : combien sont proposés, combien ont été lus, et le panneau
    // est-il ouvert. `read` sert uniquement à signaler qu'un NOUVEL indice est
    // arrivé — sans quoi le bouton s'allume une fois et ne dit plus rien.
    //
    // Semés à l'initialisation avec ce qui avait déjà été gagné : celui qui a
    // abandonné hier devant une énigme est précisément celui à qui il ne faut
    // pas réimposer l'attente. Lu ici et non dans un effet — cette aire de jeu
    // n'existe qu'après un clic, elle n'est jamais rendue côté serveur, donc il
    // n'y a aucune hydratation à désynchroniser.
    const [unlocked, setUnlocked] = useState(() =>
        persisted ? (loadProgress().hints[persisted] ?? 0) : 0,
    );
    const [read, setRead] = useState(unlocked);
    const [hintOpen, setHintOpen] = useState(false);

    // L'avertissement « il faut un clavier ».
    //
    // ⚠️ Testé sur le POINTEUR et non sur la largeur : une fenêtre étroite sur
    // un ordinateur reste jouable, c'est même ce que plusieurs énigmes
    // demandent. Ce qui manque sur un téléphone, ce sont les touches ET la
    // poignée de redimensionnement — pas des pixels.
    //
    // `any-pointer: fine` rattrape la tablette munie d'un clavier et d'un
    // trackpad, où le jeu se tient parfaitement.
    //
    // Lu à l'initialisation et non dans un effet : cette aire de jeu n'existe
    // qu'après un clic, elle n'est jamais rendue côté serveur — il n'y a donc
    // aucune hydratation à désynchroniser, et un état posé depuis un effet
    // provoque un rendu en cascade.
    const [dismissedTouch, setDismissedTouch] = useState(false);
    const [needsKeyboard] = useState(
        () =>
            window.matchMedia('(pointer: coarse)').matches &&
            !window.matchMedia('(any-pointer: fine)').matches,
    );

    const playerRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timeRef = useRef<HTMLSpanElement | null>(null);
    const orbsRef = useRef<HTMLSpanElement | null>(null);
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
        /** Temps passé sur l'énigme, tentatives cumulées. Distinct de
         *  `player.time`, qui repart de zéro à chaque mort. */
        spent: 0,
        unlocked,
    });

    const input = useRef<Input>({ left: false, right: false, jump: false, jumpPressed: false });

    // Références « dernière valeur connue » : la boucle a besoin de la taille,
    // du thème et du rappel de victoire les plus récents, sans être reconstruite
    // — la reconstruire relancerait la partie à chaque pixel de
    // redimensionnement, c'est-à-dire pendant tout le geste du joueur.
    const themeRef = useRef(theme);
    const winRef = useRef(onWin);
    const pausedRef = useRef(false);
    useEffect(() => {
        themeRef.current = theme;
        winRef.current = onWin;
        // La lecture d'un indice met la partie EN PAUSE : lire pendant qu'on
        // tombe serait une punition, et le compteur qui déclenche l'indice
        // suivant ne doit pas tourner pendant qu'on lit le précédent.
        pausedRef.current = hintOpen;
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

    // L'index d'un bloc n'est PAS son bit : les orbes sont mêlées aux autres
    // blocs, et le bit compte les orbes seules. La table évite de recompter ce
    // décalage à chaque image.
    const orbBits = useMemo(() => {
        const bits = new Map<number, number>();
        let bit = 0;
        level.blocks.forEach((block, index) => {
            if (block.kind === 'orb') {
                bits.set(index, bit);
                bit += 1;
            }
        });
        return bits;
    }, [level]);
    const playable = screen.w >= MIN_PLAYFIELD_W && screen.h >= MIN_PLAYFIELD_H;

    const respawn = useCallback(() => {
        const state = game.current;
        const now = screenRef.current;
        state.player = spawnState(level, { w: now.w, h: now.h }, now.quarter);
        state.history = [];
        state.frames = 0;
        state.rewinding = false;
        state.deadFor = 0;
    }, [level, screenRef]);

    /**
     * Le quart de tour, appliqué AU JOUEUR aussi.
     *
     * Sa position dans le monde ne doit pas bouger : c'est le sol qui change de
     * côté. Sans ce transport, pivoter en plein saut le téléporterait.
     */
    const rotate = useCallback(
        (delta: 1 | 3) => {
            const state = game.current;
            const before = screenRef.current;
            if (state.player) {
                state.player = reframePlayer(
                    state.player,
                    { w: before.w, h: before.h },
                    before.quarter,
                    (((before.quarter + delta) % 4) as Quarter),
                );
                // Le rembobinage ne doit pas ramener dans l'ancien repère.
                state.history = [];
            }
            turn(delta);
        },
        [screenRef, turn],
    );

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
            } else if (event.key === 'g' || event.key === 'G') {
                // ⚠️ Pas `R` : c'est déjà le rembobinage. Deux commandes sur la
                // même touche, c'est une mort à chaque tentative de pivot.
                rotate(event.shiftKey ? 3 : 1);
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
    }, [onClose, restart, rotate]);

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

        // Ce qui était déjà ramassé à l'image précédente. Sert à ne déclencher
        // l'éclat qu'au MOMENT du ramassage, et pas à chaque image ensuite.
        const wasTaken = new Array<boolean>(level.blocks.length).fill(false);

        const paint = () => {
            const player = state.player;
            if (!player) return;
            const now = screenRef.current;
            const currentView = { w: now.w, h: now.h };
            const quarter = now.quarter;
            const frame = playViewport(currentView, quarter);
            const currentTheme = themeRef.current;

            // ⚠️ On repasse par `solveBlocks` au lieu de résoudre chaque bloc à
            // la main : lui seul connaît le clignotement, les paliers déjà
            // tombés et la lame qui se cale sur le joueur. Résolus un par un,
            // un bloc éteint restait dessiné et un palier tombé aussi.
            const solved = solveBlocks(
                level.blocks,
                currentView,
                currentTheme,
                player.time,
                player.time,
                player,
                quarter,
            );
            const byIndex = new Map(solved.map((entry) => [entry.index, entry]));

            // L'écran occupe la place de son encombrement TOURNÉ : couché, un
            // écran de 1000×560 devient un puits de 560×1000.
            const panel = panelRef.current;
            if (panel) {
                panel.style.width = `${frame.w}px`;
                panel.style.height = `${frame.h}px`;
            }

            for (let index = 0; index < level.blocks.length; index += 1) {
                const element = blockRefs.current[index];
                if (!element) continue;
                const placed = byIndex.get(index);
                if (!placed) {
                    element.style.display = 'none';
                    continue;
                }
                const block = level.blocks[index]!;
                element.style.display = '';
                element.style.width = `${placed.rect.w}px`;
                element.style.height = `${placed.rect.h}px`;
                element.style.transform = `translate3d(${placed.rect.x}px, ${placed.rect.y}px, 0)`;

                if (block.kind === 'orb') {
                    const bit = orbBits.get(index);
                    const taken = bit !== undefined && (player.orbs & (1 << bit)) !== 0;
                    if (taken !== wasTaken[index]) {
                        wasTaken[index] = taken;
                        if (taken) {
                            element.dataset.taken = '';
                            // Retirer, forcer un recalcul, remettre : sans quoi
                            // le navigateur ne rejoue pas une animation dont la
                            // classe est déjà là — après un retour en arrière,
                            // la même orbe se reprend.
                            element.classList.remove('orb-pop');
                            void element.offsetWidth;
                            element.classList.add('orb-pop');
                        } else {
                            // Retour en arrière ou réapparition : l'orbe
                            // redevient à prendre.
                            delete element.dataset.taken;
                            element.classList.remove('orb-pop');
                        }
                    }
                }
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
        };

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            const elapsed = Math.min((now - last) / 1000, MAX_CATCHUP);
            last = now;

            if (!state.player || state.finished || pausedRef.current) {
                paint();
                return;
            }

            // Le temps qui décide d'un indice : celui passé SUR L'ÉNIGME, pas
            // sur la tentative en cours. Il s'arrête tout seul quand l'onglet
            // passe en arrière-plan, la boucle y étant gelée par le navigateur.
            state.spent += elapsed;
            const earned = Math.max(
                state.unlocked,
                unlockedHints(level, state.spent, state.tries - 1),
            );
            if (earned !== state.unlocked) {
                state.unlocked = earned;
                setUnlocked(earned);
                if (persisted) recordHints(persisted, earned);
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
                    { w: screenRef.current.w, h: screenRef.current.h },
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
    }, [dictionary, level, orbBits, persisted, playable, respawn, screenRef, totalOrbs]);

    const copyShare = useCallback(() => {
        if (!shareUrl) return;
        void navigator.clipboard?.writeText(shareUrl).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        });
    }, [shareUrl]);

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-hidden bg-bg-sunken p-3"
            role="application"
            aria-label={dictionary.game.title}
        >
            {/* La bande de commandes : elle tient lieu de barre de titre à
                l'écran de jeu, et les cotes qu'elle affiche SONT une
                information — c'est là qu'on lit la taille qu'on est en train
                de régler.

                ⚠️ Les intitulés disparaissent sous 640 px et les icônes
                restent : à 390 px, la barre débordait de 110 px et poussait le
                chrono et la cote hors de l'écran. */}
            <div
                className="flex w-full max-w-full shrink-0 flex-wrap items-center gap-1.5 border border-border-subtle bg-bg-elevated px-2 py-1.5"
                style={{ maxWidth: Math.max(320, playViewport(view, screen.quarter).w) }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    title={dictionary.game.close}
                    className="btn btn-slim"
                >
                    <X aria-hidden="true" className="size-3.5" />
                    <span className="sr-only sm:not-sr-only">{dictionary.game.close}</span>
                </button>
                <button
                    type="button"
                    onClick={restart}
                    title={dictionary.game.restart}
                    className="btn btn-slim"
                >
                    <RotateCcw aria-hidden="true" className="size-3.5" />
                    <span className="sr-only sm:not-sr-only">{dictionary.game.restart}</span>
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
                    title={dictionary.game.rewind}
                    className="btn btn-slim"
                >
                    <Undo2 aria-hidden="true" className="size-3.5" />
                    <span className="sr-only sm:not-sr-only">{dictionary.game.rewind}</span>
                </button>

                {/* La bascule de thème, DANS l'aire de jeu.
                    Sur les énigmes à thème, c'est une commande de jeu au même
                    titre que le saut — et l'aire couvre toute la fenêtre, donc
                    le sélecteur du pied de page est hors d'atteinte pendant la
                    partie. Il n'était joignable qu'en quittant le niveau. */}
                {/* La rotation : elle emporte la gravité. C'est la commande
                    qui manquait — redimensionner ne faisait varier qu'une
                    dimension du problème. */}
                <button
                    type="button"
                    onClick={(event) => rotate(event.shiftKey ? 3 : 1)}
                    title={`${dictionary.mechanics.gravity.name} (G)`}
                    className="btn btn-slim"
                >
                    {/* L'icône porte l'orientation courante : sur une énigme
                        qui se joue en plusieurs quarts de tour, savoir où l'on
                        en est vaut mieux que de le déduire du décor. */}
                    <RotateCw
                        aria-hidden="true"
                        className="size-3.5 transition-transform duration-200 motion-reduce:transition-none"
                        style={{ transform: `rotate(${screen.quarter * 90}deg)` }}
                    />
                    <span className="sr-only">{dictionary.mechanics.gravity.name}</span>
                    <kbd className="numeric text-[0.65rem]">G</kbd>
                </button>

                <button
                    type="button"
                    onClick={toggleResolvedTheme}
                    title={`${dictionary.mechanics.theme.name} (T)`}
                    className="btn btn-slim"
                >
                    {theme === 'dark' ? (
                        <Moon aria-hidden="true" className="size-3.5" />
                    ) : (
                        <Sun aria-hidden="true" className="size-3.5" />
                    )}
                    <span className="sr-only">{dictionary.mechanics.theme.name}</span>
                    <kbd className="numeric text-[0.65rem] text-fg-muted">T</kbd>
                </button>

                {/* Le bouton n'existe qu'une fois un indice gagné, et il ne
                    s'ouvre JAMAIS tout seul : un panneau qui surgit sans qu'on
                    l'ait demandé prend le joueur pour un incapable. Il
                    s'allume, c'est tout. */}
                {unlocked > 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            setHintOpen(true);
                            setRead(unlocked);
                        }}
                        className={`btn btn-slim ${unlocked > read ? 'border-accent text-accent' : ''}`}
                    >
                        <Lightbulb aria-hidden="true" className="size-3.5" />
                        {dictionary.hints.button}
                        <span className="numeric text-[0.65rem]">
                            {unlocked}/{hintCount()}
                        </span>
                    </button>
                )}

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
                    {/* La cote est MODIFIABLE : c'est un panneau de propriétés,
                        pas un afficheur. On règle l'écran à la poignée ou au
                        clavier, comme on veut.

                        ⚠️ Elle n'indique plus la cote de conception du niveau.
                        L'afficher revenait à donner la réponse : il suffisait
                        de recopier deux nombres pour que la mécanique
                        disparaisse. Elle reste sur la page de l'énigme, pour
                        qui la cherche. */}
                    <span className="numeric flex items-center gap-1 border border-border-subtle px-1.5 py-0.5">
                        <input
                            type="number"
                            aria-label={`${dictionary.game.size} — L`}
                            value={screen.w}
                            min={MIN_PLAYFIELD_W}
                            onChange={(event) => resize(Number(event.target.value) || screen.w, screen.h)}
                            className="h-6 w-12 bg-transparent text-right text-fg focus-visible:text-accent"
                        />
                        <span aria-hidden="true" className="text-fg-muted">
                            ×
                        </span>
                        <input
                            type="number"
                            aria-label={`${dictionary.game.size} — H`}
                            value={screen.h}
                            min={MIN_PLAYFIELD_H}
                            onChange={(event) => resize(screen.w, Number(event.target.value) || screen.h)}
                            className="h-6 w-12 bg-transparent text-left text-fg focus-visible:text-accent"
                        />
                    </span>
                </p>
            </div>

            {/* L'ÉCRAN DE JEU. Sa taille est celle que le joueur règle, et non
                celle de la fenêtre : c'est lui l'instrument.

                `overflow-hidden` et non `visible` : un bloc ancré à un bord
                peut sortir du cadre quand l'écran change de taille, et il ne
                doit alors pas déborder sur la page. */}
            <div className="relative shrink-0 pt-6 pl-7">
                <ScreenRuler
                    width={playViewport(view, screen.quarter).w}
                    height={playViewport(view, screen.quarter).h}
                />
                <div
                    ref={panelRef}
                    className="playfield-grid relative overflow-hidden border border-border-strong bg-bg"
                    style={{
                        width: playViewport(view, screen.quarter).w,
                        height: playViewport(view, screen.quarter).h,
                    }}
                >
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
                                className={`absolute top-0 left-0 will-change-transform ${blockClass(block)}`}
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

                {/* Annoncé aux lecteurs d'écran, qui ne voient pas un bouton
                    changer de couleur. */}
                <p aria-live="polite" className="sr-only">
                    {unlocked > read ? dictionary.hints.available : ''}
                </p>

                {needsKeyboard && !dismissedTouch && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/90 px-6">
                        <div className="panel w-full max-w-sm bg-bg-elevated p-5">
                            <h2 className="text-lg font-semibold">{dictionary.game.touchTitle}</h2>
                            <p className="mt-2 text-sm text-fg-muted text-pretty">{dictionary.game.touchBody}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDismissedTouch(true)}
                                    className="btn btn-accent"
                                >
                                    {dictionary.game.touchAnyway}
                                </button>
                                {/* Pas d'icône ici : masquer l'intitulé sous 640 px
                                    laissait un bouton VIDE — et ce panneau ne
                                    s'affiche que sur écran tactile, donc
                                    justement là où il était vide. */}
                                <button type="button" onClick={onClose} className="btn">
                                    {dictionary.game.close}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {hintOpen && (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg/85 px-6">
                        <div className="panel w-full max-w-md bg-bg-elevated p-5">
                            <p className="label text-accent">
                                {format(dictionary.hints.heading, { n: unlocked, total: hintCount() })}
                            </p>

                            <ol className="mt-4 flex flex-col gap-4">
                                <li>
                                    <p className="text-xs text-fg-muted">{dictionary.hints.step1}</p>
                                    <p className="mt-1 text-sm text-fg">
                                        {level.mechanics.map((key) => dictionary.mechanics[key].name).join(' · ')}
                                    </p>
                                </li>

                                {unlocked >= 2 && (
                                    <li>
                                        <p className="text-xs text-fg-muted">{dictionary.hints.step2}</p>
                                        <ul className="mt-1 flex flex-col gap-1.5">
                                            {level.mechanics.map((key) => (
                                                <li key={key} className="text-sm text-fg text-pretty">
                                                    {dictionary.mechanics[key].body}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                )}

                                {unlocked >= 3 && (
                                    <li>
                                        <p className="text-xs text-fg-muted">{dictionary.hints.step3}</p>
                                        <p className="mt-1 border-l-2 border-accent pl-3 text-sm text-fg text-pretty">
                                            {dictionary.hints.gestures[decisiveMechanic(level, view, theme)]}
                                        </p>
                                    </li>
                                )}
                            </ol>

                            <p className="mt-4 text-xs text-fg-muted text-pretty">{dictionary.hints.promise}</p>

                            <button
                                type="button"
                                onClick={() => setHintOpen(false)}
                                className="mt-4 border border-border-strong px-3 py-1.5 text-sm text-fg transition-colors hover:bg-bg-sunken"
                            >
                                {dictionary.hints.close}
                            </button>
                        </div>
                    </div>
                )}

                {won && (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg/85 px-6">
                        <div className="panel w-full max-w-sm bg-bg-elevated p-5">
                            <p className="label text-goal-ink">{dictionary.game.won}</p>
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
                                        className="btn btn-accent"
                                    >
                                        {nextLabel}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={restart}
                                    className="btn"
                                >
                                    {dictionary.game.retry}
                                </button>
                                {shareUrl && (
                                    <button
                                        type="button"
                                        onClick={copyShare}
                                        className="btn"
                                    >
                                        {copied ? dictionary.game.copied : dictionary.game.share}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn"
                                >
                                    {dictionary.game.backToCatalogue}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ScreenHandles
                    quarter={screen.quarter}
                    current={() => ({ w: screenRef.current.w, h: screenRef.current.h })}
                    onResize={resize}
                    label={dictionary.game.size}
                />

                {/* Commandes tactiles. Le jeu réclame un clavier, ce qu'un
                    téléphone n'a pas — mais l'écran de jeu, lui, s'y règle
                    parfaitement au doigt. */}
                <div className="touch-only pointer-events-none absolute inset-x-0 bottom-0 justify-between p-3">
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
        </div>
    );
}

/**
 * L'habillage d'un bloc.
 *
 * Chaque matière doit se reconnaître AVANT d'être éprouvée : un joueur qui
 * découvre qu'un palier est en glace en glissant dans le vide n'apprend rien,
 * il subit. D'où un liseré propre à chacune, et le pointillé pour ce qui ne
 * durera pas.
 *
 * ⚠️ La classe `orb` porte l'éclat de ramassage, dans `globals.css`. La retirer
 * d'ici décrocherait l'animation sans casser une seule ligne de code.
 */
function blockClass(block: Block): string {
    if (block.kind === 'spike') return 'bg-[var(--hazard)]';
    if (block.kind === 'goal') return 'border-2 border-[var(--goal)] bg-[var(--goal-glow)]';
    if (block.kind === 'orb') return 'orb border-2 border-[var(--orb)]';
    if (block.kind === 'wind') return 'border border-dashed border-[var(--wind-edge)] bg-[var(--wind)]';
    if (block.crumble) return 'border-t-2 border-dashed border-[var(--belt)] bg-[var(--solid)]';
    if (block.surface === 'ice') return 'border-t-2 border-t-[var(--ice)] bg-[var(--ice-fill)]';
    if (block.surface === 'bouncy') return 'border-t-4 border-t-[var(--bounce)] bg-[var(--solid)]';
    if (block.surface === 'conveyor') return 'border-t-2 border-t-[var(--belt)] bg-[var(--solid)]';
    return 'border-t-2 border-t-[var(--solid-edge)] bg-[var(--solid)]';
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
