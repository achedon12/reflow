'use client';

import { useMemo } from 'react';

/**
 * LA RÈGLE GRADUÉE.
 *
 * Le sujet du jeu est une TAILLE que l'on règle : la montrer par un simple
 * nombre serait la traiter comme un détail. Deux règles encadrent donc l'écran,
 * graduées tous les dix pixels, chiffrées tous les cent — on lit sa cote comme
 * sur un réglet, et on voit d'un coup d'œil de combien on s'est écarté.
 *
 * Les graduations sont un DÉGRADÉ RÉPÉTÉ, pas des éléments : un écran de
 * 1200 px en compterait cent vingt, redessinés à chaque tirage de poignée. Les
 * chiffres, eux, sont des nœuds — mais un tous les cent pixels seulement, et
 * ils ne changent qu'au redimensionnement.
 */

const MINOR = 10;
const LABEL = 100;

function marks(length: number): number[] {
    const out: number[] = [];
    for (let value = LABEL; value < length - 24; value += LABEL) out.push(value);
    return out;
}

export function ScreenRuler({ width, height }: { width: number; height: number }) {
    const across = useMemo(() => marks(width), [width]);
    const down = useMemo(() => marks(height), [height]);

    return (
        <>
            {/* Règle du haut */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 left-0 h-5 border-b border-border-strong"
                style={{
                    width,
                    // Deux traits superposés : les mineurs tous les 10 px sur
                    // 4 px de haut, les majeurs tous les 100 px sur 10 px. Sans
                    // cette différence de longueur, l'œil ne trouve pas la
                    // centaine et la règle ne se lit plus.
                    backgroundImage: [
                        `repeating-linear-gradient(to right, var(--rule-major) 0 1px, transparent 1px ${LABEL}px)`,
                        `repeating-linear-gradient(to right, var(--rule-tick) 0 1px, transparent 1px ${MINOR}px)`,
                    ].join(','),
                    backgroundPosition: 'bottom, bottom',
                    backgroundSize: '100% 10px, 100% 4px',
                    backgroundRepeat: 'repeat-x, repeat-x',
                }}
            >
                {across.map((value) => (
                    <span
                        key={value}
                        className="numeric absolute top-0 text-[0.55rem] leading-none text-fg-muted"
                        style={{ left: value + 3 }}
                    >
                        {value}
                    </span>
                ))}
            </div>

            {/* Règle de gauche */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 -left-7 w-6 border-r border-border-strong"
                style={{
                    height,
                    backgroundImage: [
                        `repeating-linear-gradient(to bottom, var(--rule-major) 0 1px, transparent 1px ${LABEL}px)`,
                        `repeating-linear-gradient(to bottom, var(--rule-tick) 0 1px, transparent 1px ${MINOR}px)`,
                    ].join(','),
                    backgroundPosition: 'right, right',
                    backgroundSize: '10px 100%, 4px 100%',
                    backgroundRepeat: 'repeat-y, repeat-y',
                }}
            >
                {down.map((value) => (
                    <span
                        key={value}
                        className="numeric absolute left-0 text-[0.55rem] leading-none text-fg-muted"
                        style={{ top: value + 3 }}
                    >
                        {value}
                    </span>
                ))}
            </div>
        </>
    );
}
