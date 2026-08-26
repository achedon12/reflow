'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MIN_PLAYFIELD_H, MIN_PLAYFIELD_W } from '@/game/constants';
import { playViewport } from '@/game/geometry';
import type { Quarter, Viewport } from '@/game/types';

/**
 * L'ÉCRAN INTÉRIEUR.
 *
 * L'aire de jeu n'est plus la fenêtre du navigateur : c'est un écran que le
 * joueur règle lui-même, à l'intérieur d'elle. Deux raisons, et la seconde
 * compte autant que la première.
 *
 * 1. La manipulation devient EXPLICITE et toujours disponible. Chaque énigme
 *    était prouvée finissable à sa cote de référence : un joueur dont la
 *    fenêtre tombait à peu près juste n'avait jamais besoin de la
 *    redimensionner, et la mécanique fondatrice du jeu devenait facultative.
 * 2. Elle devient possible SUR TÉLÉPHONE. On ne redimensionne pas la fenêtre
 *    d'un navigateur mobile ; on redimensionne un panneau dans une page.
 *
 * ⚠️ IL PEUT ÊTRE PLUS GRAND QUE LA FENÊTRE. On l'affiche alors RÉDUIT, comme
 * le plan de travail d'un logiciel de dessin : le jeu tourne à sa cote, seul
 * l'affichage rétrécit.
 *
 * C'est ce qui manquait. Brider l'écran à la fenêtre rendait vingt-quatre
 * énigmes sur cent injouables au téléphone — non par difficulté, mais parce
 * qu'un palier ancré à 470 px du bord gauche n'existe tout simplement pas dans
 * un écran de 358. Pivoter n'y changeait rien : les ancrages se résolvent
 * contre l'écran, pas contre l'aire de jeu tournée, et coucher un écran étroit
 * donne un écran étroit couché.
 */

export type Screen = Viewport & { quarter: Quarter };

/** La taille de départ. VOLONTAIREMENT quelconque : la faire coïncider avec la
 *  cote de l'énigme rendrait le réglage inutile, ce qui était précisément le
 *  défaut de la version précédente. */
const START: Viewport = { w: 880, h: 520 };

/** Marge autour de l'écran : la place des poignées et de la barre. */
const CHROME_X = 32;
const CHROME_Y = 96;

/** Le plus grand écran réglable. Au-delà, plus aucune énigme n'y gagne, et le
 *  facteur de réduction rendrait le jeu illisible. */
const MAX_PLAYFIELD = 1800;

function available(): Viewport {
    return {
        w: Math.max(MIN_PLAYFIELD_W, window.innerWidth - CHROME_X),
        h: Math.max(MIN_PLAYFIELD_H, window.innerHeight - CHROME_Y),
    };
}

/** Borne un écran, SANS regarder la fenêtre : c'est le facteur d'affichage qui
 *  s'occupe de le faire tenir. */
function clamp(screen: Screen): Screen {
    return {
        w: Math.min(MAX_PLAYFIELD, Math.max(MIN_PLAYFIELD_W, Math.round(screen.w))),
        h: Math.min(MAX_PLAYFIELD, Math.max(MIN_PLAYFIELD_H, Math.round(screen.h))),
        quarter: screen.quarter,
    };
}

/**
 * Combien de pixels d'écran pour un pixel de jeu.
 *
 * 1 tant que l'écran tient dans la fenêtre — c'est le cas ordinaire, et le jeu
 * s'y affiche au pixel près. En dessous, l'aire est réduite pour tenir : la
 * partie se joue à sa vraie cote, on la regarde simplement de plus loin.
 */
export function zoomFor(screen: Screen, room: Viewport): number {
    const footprint = playViewport(screen, screen.quarter);
    return Math.min(1, room.w / footprint.w, room.h / footprint.h);
}

/**
 * La taille que l'écran de jeu prendra AU LANCEMENT.
 *
 * C'est pour elle qu'une partie engendrée doit être dessinée. Le générateur
 * recevait la taille de la FENÊTRE — une partie tirée pour 1920 × 940 était
 * ensuite jouée dans un écran de 880 × 520 : les ancrages écartaient tout, et
 * l'on mourait à la première image, sur un niveau qui n'avait jamais existé.
 *
 * ⚠️ À n'appeler que dans le navigateur : elle mesure la fenêtre.
 */
export function startingScreen(): Viewport {
    const { w, h } = clamp({ ...START, quarter: 0 });
    return { w, h };
}

export function useScreen(): {
    screen: Screen;
    ref: React.RefObject<Screen>;
    resize: (w: number, h: number) => void;
    turn: (delta: 1 | 3) => void;
    room: Viewport;
    /** Le facteur d'affichage. Les poignées doivent en tenir compte : au doigt,
     *  un pixel parcouru n'est plus un pixel de jeu. */
    zoom: number;
} {
    const [room, setRoom] = useState<Viewport>({ w: START.w, h: START.h });
    const [screen, setScreen] = useState<Screen>({ ...START, quarter: 0 });

    // La boucle de jeu lit l'écran soixante fois par seconde : elle ne peut pas
    // dépendre d'un rendu React, sous peine de sauter des images pendant qu'on
    // tire une poignée. Recopié dans un EFFET et non pendant le rendu — écrire
    // une référence pendant le rendu casse le rendu concurrent.
    const ref = useRef<Screen>(screen);
    useEffect(() => {
        ref.current = screen;
    }, [screen]);

    useEffect(() => {
        const measure = () => {
            setRoom(available());
        };
        measure();
        window.addEventListener('resize', measure);
        window.visualViewport?.addEventListener('resize', measure);
        return () => {
            window.removeEventListener('resize', measure);
            window.visualViewport?.removeEventListener('resize', measure);
        };
    }, []);

    const resize = useCallback((w: number, h: number) => {
        setScreen((current) => clamp({ ...current, w, h }));
    }, []);

    const turn = useCallback((delta: 1 | 3) => {
        setScreen((current) => clamp({ ...current, quarter: (((current.quarter + delta) % 4) as Quarter) }));
    }, []);

    return { screen, ref, resize, turn, room, zoom: zoomFor(screen, room) };
}
