'use client';

import { useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import { format } from '@/i18n/format';
import { applyTheme, getServerTheme, getTheme, subscribeTheme, type Theme } from '@/lib/theme-store';

// Un seul bouton qui fait défiler les trois états, au lieu de trois boutons
// côte à côte. L'icône affiche l'état COURANT et le nom accessible le dit à
// voix haute : c'est ce qui rend un bouton cyclique honnête, sans quoi son
// état est deviné.
const ORDER: Theme[] = ['system', 'light', 'dark'];

export function ThemeToggle({ dictionary }: { dictionary: Dictionary }) {
    const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

    const Icon = { system: Monitor, light: Sun, dark: Moon }[theme];
    const modeLabel = {
        system: dictionary.header.themeSystem,
        light: dictionary.header.themeLight,
        dark: dictionary.header.themeDark,
    }[theme];
    const label = format(dictionary.header.themeToggle, { mode: modeLabel });

    return (
        <button
            type="button"
            onClick={() => applyTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] ?? 'system')}
            title={label}
            className="flex size-8 items-center justify-center border border-transparent text-fg-muted transition-colors hover:border-border-subtle hover:bg-bg-elevated hover:text-fg"
        >
            <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
            <span className="sr-only">{label}</span>
        </button>
    );
}
