'use client';

import { useSyncExternalStore } from 'react';
import {
    progressSnapshot,
    serverProgressSnapshot,
    subscribeProgress,
    type Progress,
} from '@/lib/progress';

/**
 * La progression du joueur.
 *
 * Lue par `useSyncExternalStore` et non recopiée dans un état : le stockage
 * local est un système EXTÉRIEUR à React, et le dupliquer le désynchroniserait
 * entre deux onglets — ou entre la grille et la carte d'une même énigme.
 *
 * L'instantané serveur est vide, ce qui est exact : le HTML est produit à la
 * construction et ne connaît la progression de personne. React s'en sert pour
 * l'hydratation, puis rebascule tout seul sur la valeur réelle.
 */
export function useProgress(): Progress {
    return useSyncExternalStore(subscribeProgress, progressSnapshot, serverProgressSnapshot);
}
