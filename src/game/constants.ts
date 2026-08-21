import type { Tier } from './types';

/**
 * Les constantes physiques, en pixels CSS et en secondes.
 *
 * Elles ne sont pas décoratives : `scripts/check-levels.mts` rejoue le moteur
 * avec CES valeurs pour prouver que chaque énigme est finissable. Les changer
 * peut rendre un niveau impossible — le vérificateur le dira.
 */
export const PLAYER_W = 22;
export const PLAYER_H = 30;

/** Gravité. Volontairement forte : un saut mou rend un plateformer illisible. */
export const GRAVITY = 2400;

/** Vitesse de pointe au sol comme en l'air. */
export const MOVE_SPEED = 260;

export const ACCEL_GROUND = 2600;
export const ACCEL_AIR = 1500;
export const FRICTION_GROUND = 2800;

/** Impulsion de saut. Hauteur atteinte : v² / 2g ≈ 102 px. */
export const JUMP_VELOCITY = 700;

/** Vitesse de chute maximale — sans elle, une longue chute traverse un sol. */
export const MAX_FALL = 900;

/**
 * Sauter reste possible quelques centièmes de seconde APRÈS avoir quitté le
 * bord. Sans ce délai, un joueur qui appuie une image trop tard tombe alors
 * qu'il « a sauté » — c'est le premier reproche fait à tout plateformer.
 */
export const COYOTE_TIME = 0.09;

/** Un saut demandé juste AVANT l'atterrissage est mémorisé, puis exécuté. */
export const JUMP_BUFFER = 0.12;

/** Relâcher la touche écourte le saut : c'est ce qui donne deux hauteurs. */
export const JUMP_CUT = 0.4;

/** Hauteur de la bande d'interface, retirée du haut de la fenêtre. */
export const HUD_HEIGHT = 46;

/** En dessous, la fenêtre n'a plus assez de place pour un niveau jouable. */
export const MIN_PLAYFIELD_W = 320;
export const MIN_PLAYFIELD_H = 240;

/** Pas de simulation fixe. Découplé de l'affichage : deux machines doivent
 *  obtenir exactement la même trajectoire, sinon un temps ne veut rien dire. */
export const STEP = 1 / 120;

/** Au-delà, on abandonne le rattrapage : un onglet en arrière-plan revient
 *  avec plusieurs secondes de retard, et les rejouer d'un coup téléporte le
 *  joueur dans un piège. */
export const MAX_CATCHUP = 0.25;

/** Durée du tampon de rembobinage, en secondes. */
export const REWIND_SECONDS = 6;

/** Une image sur deux est enregistrée : 6 s tiennent alors en 360 états. */
export const REWIND_EVERY = 2;

/** Vitesse du rembobinage continu, en multiples du temps réel. */
export const REWIND_SPEED = 2.5;

/**
 * Hauteur de saut retenue pour construire un niveau.
 *
 * La trajectoire monte à ~102 px ; on s'arrête à 74. Un saut à la limite
 * théorique atteint son sommet à vitesse nulle : il existe sur le papier et ne
 * se joue pas.
 *
 * La PORTÉE correspondante n'est pas une constante — elle dépend de la hauteur
 * à franchir, voir `maxRunForRise`.
 */
export const MAX_JUMP_RISE = 74;

/**
 * La portée horizontale d'un saut qui doit ATTEINDRE une hauteur donnée.
 *
 * Les deux maximums ne s'additionnent pas : monter de 74 px consomme presque
 * tout le vol, il ne reste plus de temps pour avancer. Dérivé de la
 * trajectoire réelle plutôt que réglé à la main —
 *
 *     y(t) = JUMP_VELOCITY·t − ½·GRAVITY·t²
 *
 * dont on prend la SECONDE racine (la retombée sur la plateforme), puis
 * `MOVE_SPEED × t`. Le facteur de sécurité couvre l'élan incomplet au décollage
 * et la largeur du personnage.
 */
export function maxRunForRise(rise: number): number {
    if (rise <= 0) return MOVE_SPEED * ((2 * JUMP_VELOCITY) / GRAVITY) * 0.82;
    const discriminant = JUMP_VELOCITY * JUMP_VELOCITY - 2 * GRAVITY * rise;
    if (discriminant <= 0) return 0;
    const t = (JUMP_VELOCITY + Math.sqrt(discriminant)) / GRAVITY;
    return MOVE_SPEED * t * 0.82;
}

/**
 * Quand proposer un indice.
 *
 * DEUX signaux, et le premier atteint suffit : le temps passé sur l'énigme, et
 * le nombre de morts. Ni l'un ni l'autre ne se suffit —
 *
 * - compter les morts seules raterait « Le suspendu » ou « La clairière », où
 *   l'on reste bloqué sans mourir une seule fois : le chemin est simplement
 *   hors d'atteinte ;
 * - compter le temps seul allumerait l'indice sur un joueur qui explore
 *   tranquillement une énigme qu'il est en train de résoudre.
 *
 * Les seuils montent avec la difficulté : trois minutes sur une énigme
 * difficile, c'est normal ; sur la première, c'est qu'on ne voit pas.
 *
 * ⚠️ Le temps ne court PAS pendant la lecture d'un indice ni après la
 * victoire, et il s'arrête tout seul quand l'onglet passe en arrière-plan —
 * la boucle d'animation y est gelée par le navigateur.
 */
export const HINT_STEPS: Record<Tier, { seconds: number; deaths: number }[]> = {
    easy: [
        { seconds: 45, deaths: 5 },
        { seconds: 100, deaths: 12 },
        { seconds: 180, deaths: 22 },
    ],
    medium: [
        { seconds: 75, deaths: 8 },
        { seconds: 160, deaths: 18 },
        { seconds: 280, deaths: 30 },
    ],
    hard: [
        { seconds: 120, deaths: 12 },
        { seconds: 250, deaths: 26 },
        { seconds: 420, deaths: 45 },
    ],
    // Le palier « impossible » est fait pour résister : y proposer un indice au
    // bout de deux minutes serait insultant. On laisse le joueur s'entêter.
    impossible: [
        { seconds: 240, deaths: 25 },
        { seconds: 480, deaths: 50 },
        { seconds: 900, deaths: 90 },
    ],
};

/* ── Les matières et les pièges du palier « impossible » ───────────────────
   Toutes purement fonction de l'état du joueur et du temps : aucune ne retient
   quoi que ce soit hors de `PlayerState`. C'est la condition pour que le
   rembobinage et le vérificateur continuent de marcher. */

/** Frottement sur la glace. Presque nul : on garde son élan, et on le regrette. */
export const FRICTION_ICE = 120;

/** Accélération au sol sur la glace. Réduite : on ne se reprend pas vite. */
export const ACCEL_ICE = 700;

/** Impulsion rendue par un palier élastique. Plus forte que le saut : c'est ce
 *  qui permet d'atteindre des hauteurs qu'aucun saut n'atteint. */
export const BOUNCE_VELOCITY = 980;

/** Un rebond ne se déclenche qu'au-delà de cette vitesse de chute — sinon on
 *  tressaute indéfiniment en se posant. */
export const BOUNCE_THRESHOLD = 120;

/** Vitesse par défaut d'un tapis roulant, en pixels par seconde. */
export const CONVEYOR_SPEED = 130;

/** Délai avant qu'un palier friable ne cède, en secondes. Court : il faut le
 *  traverser, pas s'y reposer. */
export const CRUMBLE_DELAY = 0.45;

/** Au-delà, le champ de bits des paliers friables déborderait. */
export const MAX_CRUMBLE = 8;
