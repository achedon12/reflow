import { PLAYER_H, PLAYER_W } from '@/game/constants';
import { present, resolve } from '@/game/geometry';
import type { Level } from '@/game/types';

/**
 * L'APERÇU D'UNE ÉNIGME, en SVG.
 *
 * Il n'est pas décoratif : c'est le seul contenu réellement propre à chacune
 * des cinquante-quatre pages, et il répond à la question que se pose un
 * visiteur venu d'un moteur de recherche — « à quoi ça ressemble ? ».
 *
 * Il est produit par le MOTEUR lui-même, à la taille de référence du niveau :
 * un schéma dessiné à la main finirait par ne plus correspondre au niveau
 * qu'il illustre.
 *
 * ⚠️ Il montre l'état du niveau en thème SOMBRE et au repos. Les blocs qui
 * n'existent que dans l'autre thème, ou qu'à une autre taille de fenêtre, sont
 * dessinés en pointillés — les cacher mentirait sur le niveau, les dessiner
 * pleins mentirait sur ce qu'on voit en jouant.
 */
export function LevelPreview({ level, label }: { level: Level; label: string }) {
    const view = level.reference;

    const blocks = level.blocks.map((block, index) => {
        const rect = resolve(block.rect, view);
        // Un bloc conditionnel est dessiné, mais en pointillés : il fait partie
        // du niveau sans faire partie de ce qu'on voit en arrivant.
        const conditional = !present(block, view, 'dark');
        return { key: index, kind: block.kind, rect, conditional, moving: Boolean(block.motion) };
    });

    const spawn = resolve(level.spawn, view);

    return (
        <figure className="border border-border-subtle">
            <svg
                viewBox={`0 0 ${view.w} ${view.h}`}
                className="block h-auto w-full bg-bg-sunken"
                role="img"
                aria-label={label}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <pattern id={`grid-${level.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path
                            d="M40 0H0V40"
                            fill="none"
                            className="stroke-border-subtle"
                            strokeWidth="1"
                            opacity="0.6"
                        />
                    </pattern>
                </defs>
                <rect width={view.w} height={view.h} fill={`url(#grid-${level.id})`} />

                {/* Le sol mortel, s'il l'est : c'est la première chose à savoir
                    avant de se lancer. */}
                {level.floor === 'deadly' && (
                    <rect x="0" y={view.h - 5} width={view.w} height="5" className="fill-hazard" opacity="0.8" />
                )}

                {blocks.map((block) => {
                    const common = {
                        x: block.rect.x,
                        y: block.rect.y,
                        width: Math.max(2, block.rect.w),
                        height: Math.max(2, block.rect.h),
                        ...(block.conditional ? { strokeDasharray: '9 7', opacity: 0.55 } : {}),
                    };

                    if (block.kind === 'solid') {
                        return (
                            <g key={block.key}>
                                <rect
                                    {...common}
                                    fill={block.conditional ? 'none' : 'var(--solid)'}
                                    stroke="var(--solid-edge)"
                                    strokeWidth={block.conditional ? 2 : 0}
                                />
                                {!block.conditional && (
                                    <rect
                                        x={block.rect.x}
                                        y={block.rect.y}
                                        width={Math.max(2, block.rect.w)}
                                        height="3"
                                        fill="var(--solid-edge)"
                                    />
                                )}
                                {/* Une plateforme mobile porte une double flèche :
                                    sans elle, l'aperçu la donne pour fixe. */}
                                {block.moving && (
                                    <text
                                        x={block.rect.x + block.rect.w / 2}
                                        y={block.rect.y - 8}
                                        textAnchor="middle"
                                        className="fill-fg-muted"
                                        fontSize="18"
                                    >
                                        ↕
                                    </text>
                                )}
                            </g>
                        );
                    }

                    if (block.kind === 'spike') {
                        return <rect key={block.key} {...common} fill="var(--hazard)" />;
                    }

                    if (block.kind === 'goal') {
                        return (
                            <rect
                                key={block.key}
                                {...common}
                                fill="var(--goal-glow)"
                                stroke="var(--goal)"
                                strokeWidth="3"
                            />
                        );
                    }

                    return (
                        <rect key={block.key} {...common} fill="none" stroke="var(--orb)" strokeWidth="3" />
                    );
                })}

                <rect
                    x={spawn.x}
                    y={spawn.y}
                    width={PLAYER_W}
                    height={PLAYER_H}
                    fill="var(--player)"
                    stroke="var(--player-edge)"
                    strokeWidth="2"
                />
            </svg>
        </figure>
    );
}
