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
 * ⚠️ La fenêtre reste la LIMITE : l'écran intérieur ne peut jamais la dépasser.
 * Une petite fenêtre reste une contrainte réelle, et c'est ce qui garde au jeu
 * son propos — le décor tient toujours dans ce que le navigateur accorde.
 */

export type Screen = Viewport & { quarter: Quarter };

/** La taille de départ. VOLONTAIREMENT quelconque : la faire coïncider avec la
 *  cote de l'énigme rendrait le réglage inutile, ce qui était précisément le
 *  défaut de la version précédente. */
const START: Viewport = { w: 880, h: 520 };

/** Marge autour de l'écran : la place des poignées et de la barre. */
const CHROME_X = 32;
const CHROME_Y = 96;

function available(): Viewport {
    return {
        w: Math.max(MIN_PLAYFIELD_W, window.innerWidth - CHROME_X),
        h: Math.max(MIN_PLAYFIELD_H, window.innerHeight - CHROME_Y),
    };
}

/** Réduit un écran jusqu'à ce que son encombrement TOURNÉ tienne dans la place
 *  disponible. Un écran couché occupe la place de son autre dimension. */
function fit(screen: Screen, room: Viewport): Screen {
    let { w, h } = screen;
    for (let guard = 0; guard < 40; guard += 1) {
        const footprint = playViewport({ w, h }, screen.quarter);
        const overW = footprint.w - room.w;
        const overH = footprint.h - room.h;
        if (overW <= 0 && overH <= 0) break;
        if (overW > 0) {
            if (screen.quarter % 2 === 0) w -= overW;
            else h -= overW;
        }
        if (overH > 0) {
            if (screen.quarter % 2 === 0) h -= overH;
            else w -= overH;
        }
    }
    return {
        w: Math.max(MIN_PLAYFIELD_W, Math.round(w)),
        h: Math.max(MIN_PLAYFIELD_H, Math.round(h)),
        quarter: screen.quarter,
    };
}

export function useScreen(): {
    screen: Screen;
    ref: React.RefObject<Screen>;
    resize: (w: number, h: number) => void;
    turn: (delta: 1 | 3) => void;
    room: Viewport;
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
            const next = available();
            setRoom(next);
            setScreen((current) => fit(current, next));
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
        setScreen((current) => fit({ ...current, w, h }, available()));
    }, []);

    const turn = useCallback((delta: 1 | 3) => {
        setScreen((current) =>
            fit({ ...current, quarter: (((current.quarter + delta) % 4) as Quarter) }, available()),
        );
    }, []);

    return { screen, ref, resize, turn, room };
}
