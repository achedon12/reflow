/** Un rectangle en pixels, résolu pour une taille de fenêtre donnée. */
export type Rect = { x: number; y: number; w: number; h: number };

/**
 * Un rectangle exprimé RELATIVEMENT à la fenêtre.
 *
 *     x = ax × W + ox        w = aw × W + ow
 *     y = ay × H + oy        h = ah × H + oh
 *
 * C'est toute l'idée du jeu, tenue en huit nombres. Une plateforme avec
 * `ax = 1, ox = -160` reste collée au bord DROIT : rétrécir la fenêtre la fait
 * venir vers le joueur. Une plateforme avec `aw = 1` traverse toujours l'écran,
 * quelle que soit sa largeur.
 *
 * Rien dans le niveau n'est en coordonnées absolues : c'est ce qui garantit
 * qu'aucun niveau ne peut ignorer le redimensionnement.
 */
export type Anchor = {
    ax: number;
    ay: number;
    ox: number;
    oy: number;
    aw: number;
    ah: number;
    ow: number;
    oh: number;
};

export type BlockKind = 'solid' | 'spike' | 'goal' | 'orb' | 'wind';

/**
 * La matière d'un palier.
 *
 * Elle ne change que ce qui se passe AU CONTACT — le reste de la physique est
 * commun. C'est ce qui permet d'en ajouter sans toucher au calcul de portée du
 * constructeur : un palier de glace se saute comme un autre, il ne se quitte
 * pas pareil.
 */
export type Surface = 'ice' | 'bouncy' | 'conveyor';

/**
 * Un bloc qui n'existe qu'une partie du temps.
 *
 * `duty` est la fraction du cycle pendant laquelle il est là : 0,5 signifie une
 * fois sur deux. Purement fonction du temps, donc rembobinable et vérifiable —
 * aucun état à retenir.
 */
export type Blink = {
    period: number;
    /** Dans ]0, 1[. */
    duty: number;
    phase?: number;
};

/** Un va-et-vient sinusoïdal autour de la position ancrée. */
export type Motion = {
    /** Amplitude en pixels sur chaque axe. */
    dx: number;
    dy: number;
    /** Durée d'un aller-retour complet, en secondes. */
    period: number;
    /** Décalage de phase dans [0, 1[ — sert à désynchroniser deux blocs. */
    phase?: number;
};

/**
 * La condition d'existence d'un bloc, en pixels de fenêtre.
 *
 * C'est le second levier du redimensionnement : au lieu de DÉPLACER la
 * géométrie, il la fait apparaître et disparaître. Un pont qui n'existe qu'en
 * dessous de 900 px de large oblige à rétrécir pour traverser.
 */
export type Condition = {
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
};

export type Block = {
    kind: BlockKind;
    rect: Anchor;
    motion?: Motion;
    /** La matière du palier. Sans effet sur les autres genres de bloc. */
    surface?: Surface;
    /** Vitesse du tapis, en pixels par seconde. Signée. `conveyor` uniquement. */
    speed?: number;
    /** Le bloc clignote : il n'existe qu'une partie du cycle. */
    blink?: Blink;
    /**
     * Le bloc se centre sur le joueur en X — l'épée au-dessus de la tête.
     *
     * Pure fonction de la position du joueur, donc sans état : c'est ce qui la
     * rend compatible avec le rembobinage et avec le vérificateur.
     */
    chase?: boolean;
    /** Le palier cède peu après qu'on s'y est posé. */
    crumble?: boolean;
    /** Accélération horizontale imposée dans la zone. `wind` uniquement. */
    force?: number;
    /** Le bloc n'existe que dans ce thème. Le joueur change de thème pour le
     *  faire apparaître — le bouton de l'interface fait partie du jeu. */
    theme?: 'light' | 'dark';
    when?: Condition;
};

/** Les mécaniques mises en jeu par un niveau. Sert à l'affichage et au
 *  classement du catalogue, jamais à la simulation. */
export type Mechanic =
    | 'resize'
    | 'edge'
    | 'appear'
    | 'motion'
    | 'theme'
    | 'rewind'
    | 'orbs'
    | 'crush'
    | 'ice'
    | 'bounce'
    | 'conveyor'
    | 'blink'
    | 'chase'
    | 'wind'
    | 'crumble';

export type Tier = 'easy' | 'medium' | 'hard' | 'impossible';

export type Level = {
    /** Identifiant ET segment d'URL. ASCII, sans accent, stable à jamais :
     *  c'est une adresse publique une fois le niveau en ligne. */
    id: string;
    tier: Tier;
    mechanics: readonly Mechanic[];
    /** Seuls `x` et `y` du rectangle résolu servent : le joueur a sa taille. */
    spawn: Anchor;
    /** Le bas de la fenêtre est-il un sol, ou le vide ? */
    floor: 'solid' | 'deadly';
    blocks: readonly Block[];
    /** Taille de fenêtre à laquelle le niveau a été conçu et vérifié. Affichée
     *  au joueur comme une cote : c'est un repère, pas une obligation. */
    reference: { w: number; h: number };
};

export type Viewport = { w: number; h: number };

export type Theme = 'light' | 'dark';

/** L'état du joueur, et lui seul : tout le reste se recalcule. C'est ce qui
 *  rend le rembobinage possible en enregistrant sept nombres par image. */
export type PlayerState = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    grounded: boolean;
    coyote: number;
    buffer: number;
    /** Index des orbes déjà ramassées, en champ de bits. */
    orbs: number;
    /** Paliers friables déjà tombés, en champ de bits. */
    broken: number;
    /** Le palier friable en train de céder, ou -1. Un seul à la fois : on n'est
     *  jamais posé sur deux. */
    crumbling: number;
    /** L'instant où il a commencé à céder. */
    crumbleAt: number;
    /** Index du bloc sur lequel le joueur repose, ou -1 pour le sol de la
     *  fenêtre. C'est lui qui dit quelle plateforme mobile doit l'emporter. */
    ground: number;
    /** Temps écoulé depuis le début de la tentative, en secondes. */
    time: number;
};

export type Input = {
    left: boolean;
    right: boolean;
    jump: boolean;
    /** Vrai pendant l'image où le saut vient d'être demandé. */
    jumpPressed: boolean;
};

export type Outcome = 'playing' | 'won' | 'dead-spike' | 'dead-fall' | 'dead-crush';
