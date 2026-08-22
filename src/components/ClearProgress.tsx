'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import { clearProgress } from '@/lib/progress';

/**
 * Le bouton qui efface la progression.
 *
 * Il existe parce que la page de confidentialité le promet : « vous pouvez tout
 * effacer d'un bouton, depuis la page à propos ». Une promesse de ce genre sans
 * le bouton en face rendrait la page fausse.
 *
 * Deux temps volontaires : un premier clic demande confirmation, le second
 * efface. L'action est irréversible et ne mérite pas d'être déclenchée par un
 * clic distrait — mais elle ne mérite pas non plus une fenêtre modale du
 * navigateur, qui bloquerait la page.
 */
export function ClearProgress({ dictionary }: { dictionary: Dictionary }) {
    const [state, setState] = useState<'idle' | 'confirm' | 'done'>('idle');

    if (state === 'done') {
        return <p className="numeric text-sm text-goal-ink">{dictionary.about.cleared}</p>;
    }

    return (
        <button
            type="button"
            onClick={() => {
                if (state === 'idle') {
                    setState('confirm');
                    return;
                }
                clearProgress();
                setState('done');
            }}
            className={`btn ${state === 'confirm' ? 'border-hazard text-hazard' : ''}`}
        >
            <Trash2 aria-hidden="true" className="size-4" />
            {state === 'confirm' ? `${dictionary.about.clearButton} ?` : dictionary.about.clearButton}
        </button>
    );
}
