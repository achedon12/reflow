import type { Dictionary } from './fr';

export const en: Dictionary = {
    meta: {
        title: 'Reflow',
        /** La signature qui suit le titre de chaque page. Sans elle, « Règles —
         *  Reflow » laissait les deux tiers de la ligne de résultat vides. */
        tagline: 'Reflow, the game played in your window',
        titleTag: 'Reflow — the platformer whose level is your browser window',
        description:
            'A platformer whose scenery is the browser window: resize it, turn it a quarter. 100 puzzles, endless runs, no account needed.',
        ogAlt: 'Reflow — a platformer played with the browser window',
        keywords:
            'browser platformer, resize window game, original web game, browser puzzle game, free game no account, puzzle platformer',
        shortName: 'Reflow',
    },
    header: {
        skipToContent: 'Skip to content',
        brand: 'Reflow',
        tagline: 'the level is your window',
        navLabel: 'Navigation',
        navPuzzles: 'Puzzles',
        navEndless: 'Endless',
        navMechanics: 'Mechanics',
        navRules: 'Rules',
        navAbout: 'About',
        languageLabel: 'Language',
        themeLabel: 'Theme',
        themeToggle: 'Theme: {mode}',
        themeSystem: 'System',
        themeLight: 'Light',
        themeDark: 'Dark',
    },
    home: {
        kicker: 'Platformer',
        title: 'The level is your window',
        lede: 'Every platform is pinned to an edge of the window. Shrink it and they come to you. Stretch it and the chasm opens.',
        play: 'Play',
        playFirst: 'Start with the first puzzle',
        resume: 'Resume',
        browse: 'See all 100 puzzles',
        endless: 'Endless runs',
        progress: '{done} of {total} puzzles finished',
        sections: [
            {
                title: 'Scenery no other game uses',
                body: 'In Reflow no platform has an absolute position. Each one is pinned to an edge of the window: the width and height of your browser go into the calculation of where it sits, frame after frame. Dragging a corner does not resize a view of the game — it moves the scenery, opens passages, closes others, and can crush you against a wall.',
            },
            {
                title: 'Mechanics borrowed from the browser',
                body: 'Resizing is only the first. Some blocks exist only below a certain width. Others exist only in the light theme, or only in the dark one — the theme switch becomes a game control. Browser zoom changes the size of the playfield, the Back button rewinds time, and a window that is too narrow kills.',
            },
            {
                title: 'One hundred puzzles, then the endless mode',
                body: 'The hundred hand-built puzzles run from the first jump to sequences that ask you to resize mid-flight. Once they are done the endless mode takes over: every run is generated from a seed, none repeats, and difficulty climbs with the streak. A seed fits inside a link — the run you just played passes on as it is.',
            },
            {
                title: 'No account, no advertising',
                body: 'Reflow runs entirely in your browser. There is no game server, no account to create, no advertising and no third-party tracker. Your progress stays in your browser and is never sent anywhere.',
            },
        ],
        rulesLink: 'Read the rules',
        mechanicsLink: 'The mechanics in detail',
    },
    game: {
        title: 'Playfield',
        close: 'Quit',
        restart: 'Restart',
        rewind: 'Rewind',
        pause: 'Pause',
        resume: 'Resume',
        attempts: 'Try {count}',
        elapsed: 'Time',
        orbs: 'Orbs',
        size: 'Window',
        won: 'Cleared',
        wonIn: 'Cleared in {time} s, {count} tries',
        wonInOne: 'Cleared in {time} s, first try',
        deadSpike: 'Hit',
        deadFall: 'Fell',
        deadCrush: 'Crushed by the window',
        retry: 'Try again',
        next: 'Next puzzle',
        nextRun: 'Next run',
        backToCatalogue: 'Back to the catalogue',
        share: 'Copy the link to this run',
        copied: 'Link copied',
        hintResize: 'Resize the window.',
        controlsTitle: 'Controls',
        controlMove: 'Move',
        controlJump: 'Jump',
        controlRewind: 'Rewind',
        controlRestart: 'Restart',
        controlQuit: 'Quit',
        rewindArmed: 'The browser’s Back button rewinds this puzzle.',
        tooSmall: 'Play screen too small',
        tooSmallBody:
            'The screen is below {w} × {h} pixels: there is no room left for a level. Drag its handles, or type a size in the bar.',
        touchTitle: 'A keyboard is required',
        touchBody:
            'Reflow is played with a keyboard and a resizable window. A phone has neither: the game will be waiting for you on a computer.',
        touchAnyway: 'Try anyway',
    },
    tiers: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        easyPlural: 'Easy',
        mediumPlural: 'Medium',
        impossible: 'Impossible',
        impossiblePlural: 'Impossible',
        hardPlural: 'Hard',
    },
    hints: {
        button: 'Hint',
        available: 'A hint is available',
        heading: 'Hint {n} of {total}',
        close: 'Close',
        more: 'One more hint',
        step1: 'This puzzle plays on:',
        step2: 'What that means:',
        step3: 'What to try:',
        promise:
            'None of these hints gives the solution: the puzzle is still yours to solve.',
        gestures: {
            resize:
                'The window is the only lever. Bring it closer to the size shown at the top right.',
            edge:
                'Not every platform is pinned to the same edge. Pull one side, and watch which ones move.',
            appear:
                'A piece of the path is missing. Shrink the window hard, and watch what appears.',
            motion:
                'Waiting is an action. Do not jump the moment you can.',
            theme:
                'Switch theme mid-run — the T key, or the button in the game bar.',
            rewind:
                'Hold R to rewind six seconds. On this puzzle the browser’s Back button does the same.',
            orbs:
                'The exit stays shut while one orb remains. Check the counter at the top right.',
            crush:
                'Shrinking can kill. Look at where you are standing before you pull an edge.',
            ice:
                'On ice, brake before the edge. Momentum carries, and so does the void.',
            bounce:
                'A springy platform throws you higher than a jump. Let yourself fall onto it.',
            conveyor:
                'The belt carries you: walk against it to hold your ground.',
            blink:
                'Count the beat. The ground always comes back on the same interval.',
            chase:
                'The blade lines up with you. Move, then come back: it takes time to drop again.',
            wind:
                'Wind changes the reach of your jumps. Take off earlier, or later.',
            crumble:
                'Do not stop on a crumbling ledge: cross it.',
            gravity:
                'Turn the screen. What was a wall becomes a floor.',
            screen:
                'The playfield can be set: drag its handles, turn it.',
        },
    },
    mechanics: {
        resize: {
            name: 'Resizing',
            body: 'The window is the level. Its width and height go into the position of every block, on every frame.',
        },
        edge: {
            name: 'Edges',
            body: 'Every block is pinned to an edge. Pulling one side brings what hangs from it closer and pushes everything else away: that is what makes a chasm crossable.',
        },
        appear: {
            name: 'Appearances',
            body: 'Some blocks exist only above, or only below, a given window size. Nothing announces them — you find them by dragging an edge.',
        },
        motion: {
            name: 'Motion',
            body: 'Platforms that come and go, blades that drop from the ceiling. Waiting for the right moment is an action in its own right. If your system asks for reduced motion, these movements run at half speed.',
        },
        theme: {
            name: 'Theme',
            body: 'Blocks that exist only in the light theme, others only in the dark one. The theme toggle in the game bar, or the T key, becomes a control just like jumping.',
        },
        rewind: {
            name: 'Rewind',
            body: 'Time runs back six seconds. On those puzzles the browser’s Back button rewinds instead of leaving the page.',
        },
        orbs: {
            name: 'Orbs',
            body: 'The exit stays shut while one is still out there: the level has to be crossed both ways.',
        },
        crush: {
            name: 'Crushing',
            body: 'Two walls meeting, and there is no room left for you. Shrinking the window can kill.',
        },
        ice: {
            name: 'Ice',
            body: 'A platform with no friction: you keep your momentum, and braking takes as much room as starting.',
        },
        bounce: {
            name: 'Bounce',
            body: 'A springy platform throws you higher than a jump. It is the only way to reach some ledges — and to come down on spikes.',
        },
        conveyor: {
            name: 'The belt',
            body: 'A platform that carries you while you stand on it. Staying still on it means walking.',
        },
        blink: {
            name: 'Blinking',
            body: 'Blocks that exist only part of the time. The ground under your feet vanishes on a fixed beat.',
        },
        chase: {
            name: 'The tracking blade',
            body: 'A blade fixed to the ceiling that lines up with your horizontal position. You cannot outrun it: you pass under it at the right moment.',
        },
        wind: {
            name: 'Wind',
            body: 'A zone that pushes constantly. It changes the reach of every jump that crosses it, one way or the other.',
        },
        crumble: {
            name: 'Crumbling ledges',
            body: 'They give way less than half a second after you land. They are crossed, not rested on.',
        },
        gravity: {
            name: 'Gravity',
            body: 'The screen turns by quarter turns, and the fall follows. Some puzzles are not written in a single orientation: their path branches on a square pivot, and what comes after is only ground once the screen has turned.',
        },
        screen: {
            name: 'The inner screen',
            body: 'The playfield is a screen you set yourself: its handles resize it, its rotation changes which way you fall. Larger than the window, it is shown scaled down — the game runs at its own size, you just watch it from further away.',
        },
    },
    puzzles: {
        seuil: { name: 'The Threshold', brief: 'Nothing to clear: only the realisation that the exit is pinned to the right edge of the window, and moves with it.' },
        marche: { name: 'The Step', brief: 'One platform, one jump. Enough to learn that the floor is the bottom of your window, and nothing else.' },
        enjambee: { name: 'The Stride', brief: 'Two strips of spikes flat on the floor. The run-up counts as much as the jump.' },
        corniche: { name: 'The Ledge', brief: 'Four platforms climbing to the right. The first time you gain height.' },
        descente: { name: 'The Descent', brief: 'The path goes down instead of up: falling becomes a way of moving forward.' },
        bordure: { name: 'The Border', brief: 'The landing is pinned right, the start left: the gap between them is the width of your window.' },
        suspendu: { name: 'The Hanging', brief:
                'The path hangs from the ceiling: it only becomes walkable once the screen is flipped.' },
        lucarne: { name: 'The Skylight', brief: 'A bridge is missing in the middle. It does exist — but only below a certain width.' },
        balancier: { name: 'The Rocker', brief: 'A platform that rises and falls. Waiting becomes an action.' },
        navette: { name: 'The Shuttle', brief: 'The same idea sideways: a platform running from one end of its corridor to the other.' },
        clairiere: { name: 'The Clearing', brief: 'The path exists only in the light theme: in the dark one there is neither platform nor exit. The T key is a game control here.' },
        nocturne: { name: 'Nocturne', brief: 'The reverse, and worse: in the light theme the platforms turn into spikes.' },
        collecte: { name: 'The Collection', brief: 'Two orbs to pick up before the exit agrees to open.' },
        detour: { name: 'The Detour', brief: 'The orbs are at the end of the path, the exit back at the start. You have to come back.' },
        ecart: { name: 'The Gap', brief: 'Platforms alternate between the left and the right edge: the window pushes them apart two at a time.' },
        rebord: { name: 'The Sill', brief: 'Four platforms under a hundred pixels wide. Precision replaces reach.' },
        couloir: { name: 'The Corridor', brief: 'Two low walls on the floor, and a path running just above them.' },
        vide: { name: 'The Void', brief: 'The first puzzle with no floor: falling no longer costs a strip of spikes, it costs the attempt.' },
        pendule: { name: 'The Pendulum', brief: 'Two moving platforms over the void, deliberately out of phase.' },
        entonnoir: { name: 'The Funnel', brief: 'Two routes exclude each other: one above 860 pixels wide, the other below.' },
        etau: { name: 'The Vice', brief: 'Two walls, one pinned left, the other right. Shrinking makes them meet — on you.' },
        escalier: { name: 'The Staircase', brief: 'Four steps, and two blades sweeping the stairs on opposite beats.' },
        traverse: { name: 'The Crossing', brief: 'Almost everything is pinned to the right edge, over the void. The window is the only lever left.' },
        alternance: { name: 'The Alternation', brief: 'One light platform, one dark, alternating: you have to switch theme mid-crossing.' },
        guillotine: { name: 'The Guillotine', brief: 'Three blades drop from the ceiling, each on its own tempo.' },
        serpentin: { name: 'The Serpentine', brief: 'The path doubles back twice as it climbs. You pass over where you have already been.' },
        bascule: {
            name: 'The Seesaw',
            brief:
                'Two platforms in opposition, then a square pivot: the rest of the path only becomes ground a quarter turn later.',
        },
        jachere: { name: 'The Fallow', brief: 'A path that exists only in light — and a blade that exists only in light too.' },
        cordee: { name: 'The Rope Team', brief: 'Three orbs along one continuous climb. Not one of them is picked up in passing.' },
        grenier: { name: 'The Attic', brief:
                'Everything is upside down, the exit included. Flipping the screen is the only way to set foot on it.' },
        passerelle: { name: 'The Footbridge', brief: 'The middle span only appears below 800 pixels wide.' },
        tourniquet: {
            name: 'The Turnstile',
            brief:
                'Three orientations in a row. Each pivot hands over to the next, and you hold it for barely a moment.',
        },
        cascade: { name: 'The Cascade', brief: 'A long descent, one step of which slides sideways at the wrong moment.' },
        sablier: { name: 'The Hourglass', brief: 'A wall blocks the way above 780 pixels; the passage only opens below.' },
        relais: { name: 'The Relay', brief: 'Two orbs carried by moving platforms, over the void.' },
        faille: { name: 'The Rift', brief: 'Three gaps of a hundred and ten pixels, at the exact limit of a jump.' },
        vertige: { name: 'Vertigo', brief: 'No floor, four moving platforms, and a final step glued to the right edge.' },
        dedale: { name: 'The Maze', brief: 'The level has two faces depending on the width, and the exit is not in the same place in each.' },
        funambule: { name: 'The Tightrope', brief: 'Seventy-pixel platforms over the void, and two orbs you cannot miss.' },
        contrepoids: { name: 'The Counterweight', brief:
                'A path built head down. Reading it the right way up leads nowhere.' },
        retour: {
            name: 'The Return',
            brief:
                'The pivot turns the other way. Rewinding is still there for the mistakes — there will be some.',
        },
        metronome: { name: 'The Metronome', brief: 'Three blades a third of a beat apart. Rhythm is the only solution.' },
        eclipse: { name: 'The Eclipse', brief: 'The path alternates themes over the void: switching too late means jumping into nothing.' },
        tenaille: { name: 'The Pincer', brief: 'A passage that exists only below 900 pixels, between two walls closing in.' },
        verticale: {
            name: 'The Vertical',
            brief:
                'A well that is only a well once the screen is laid on its side: upright, its steps are mere pillars.',
        },
        gouffre: { name: 'The Chasm', brief: 'Four gaps of ninety pixels, every one of them carried by a breathing platform.' },
        spirale: {
            name: 'The Spiral',
            brief:
                'The path coils through a full turn, changing floor at every corner.',
        },
        veilleuse: { name: 'The Night Light', brief: 'A path that exists only in the dark, one span of which exists only in a narrow window.' },
        horloge: { name: 'The Clock', brief: 'Three platforms on the same period, a third of a beat apart. You have to step into the bar.' },
        cordon: { name: 'The Cord', brief: 'Three orbs in the four corners of the window, and the exit back where you started.' },
        abime: { name: 'The Abyss', brief: 'Two conditional spans over the void: shrink the window, or fall.' },
        charniere: {
            name: 'The Hinge',
            brief:
                'The path bends at a right angle. Its second half is nothing but pillars — lay the screen down and they carry you.',
        },
        souffle: { name: 'Last Breath', brief: 'Five moving steps, two orbs, no floor, and the exit against the right edge.' },
        epilogue: { name: 'The Epilogue', brief: 'Everything at once — the edges, the theme, the motion, the orbs and the void.' },
        verglas: {
            name: 'The Black Ice',
            brief:
                'Four ice ledges over the void. Braking takes as much room as setting off, and there is none.',
        },
        patinoire: {
            name: 'The Rink',
            brief:
                'Wide sheets of ice, and spikes waiting below. Momentum lasts long after you let go of the key.',
        },
        banquise: {
            name: 'The Ice Field',
            brief:
                'A serpentine frozen end to end, with a turnback halfway up. The turnback is the problem.',
        },
        derapage: {
            name: 'The Skid',
            brief:
                'A belt pushing backwards, a sheet of ice, then a belt pushing the other way. Nothing holds still, you included.',
        },
        tremplin: {
            name: 'The Springboard',
            brief:
                'A springy ledge throws you twice as high as a jump. It is the only way to reach the next one.',
        },
        catapulte: {
            name: 'The Catapult',
            brief:
                'The same bounce, but the landing sways. You have to leave at the right moment, not when you feel ready.',
        },
        ressac: {
            name: 'The Undertow',
            brief:
                'A bounce, then a gust in mid-flight. The reach of your jump is no longer the one you know.',
        },
        soufflerie: {
            name: 'The Wind Tunnel',
            brief:
                'Three gaps no jump can cross. Only the wind crosses them, and it does not blow everywhere.',
        },
        bourrasque: {
            name: 'The Squall',
            brief:
                'Two gusts framing a moving platform. The wind carries you, the swing takes you back.',
        },
        alize: {
            name: 'The Trade Wind',
            brief:
                'The wind blows against you, over ice. That is enough to send you back into the void you just crossed.',
        },
        tapis: {
            name: 'The Belt',
            brief:
                'Two conveyor belts running opposite ways. Standing still on them means walking.',
        },
        contresens: {
            name: 'Against the Grain',
            brief:
                'Two belts, both pushing backwards, over the void. You advance by retreating more slowly.',
        },
        laminoir: {
            name: 'The Rolling Mill',
            brief:
                'Two belts, two walls that meet when the window shrinks, and spikes in between.',
        },
        stroboscope: {
            name: 'The Strobe',
            brief:
                'Two ledges blinking in opposition. The two are never there at once.',
        },
        intermittence: {
            name: 'The Flicker',
            brief:
                'The ground comes back on a fixed interval — but not the same interval on both sides.',
        },
        battement: {
            name: 'The Beat',
            brief:
                'One ledge blinking, one swinging, one blinking off-beat. Three clocks, none in tune.',
        },
        cendres: {
            name: 'Ashes',
            brief:
                'Three ledges that give way less than half a second after you land. There is no stopping any more.',
        },
        effondrement: {
            name: 'The Collapse',
            brief:
                'Crumbling ledges separated by a moving platform. Waiting is fatal, not waiting too.',
        },
        poussiere: {
            name: 'Dust',
            brief:
                'Two orbs sitting on what is about to fall. You have to come back, and there will be nothing left.',
        },
        damocles: {
            name: 'Damocles',
            brief:
                'A blade fixed to the ceiling lines up with your position and drops every two and a half seconds.',
        },
        traque: {
            name: 'The Hunt',
            brief:
                'The blade follows you, and the ground gives way behind you. You can neither stop nor turn back.',
        },
        ombre: {
            name: 'The Shadow',
            brief:
                'The path exists only in the dark theme, and the blade follows you through it.',
        },
        frimas: {
            name: 'The Frost',
            brief:
                'Ice, including one moving ledge. You arrive fast, and you leave faster.',
        },
        avalanche: {
            name: 'The Avalanche',
            brief:
                'Ice ledges that crumble. Braking takes longer than they allow.',
        },
        congere: {
            name: 'The Snowdrift',
            brief:
                'One ice ledge appears only in a narrow window. Without it the gap is eighty pixels too wide.',
        },
        trebuchet: {
            name: 'The Trebuchet',
            brief:
                'A bounce sends you straight into a ceiling of spikes. You have to step aside in mid-air.',
        },
        mortier: {
            name: 'The Mortar',
            brief:
                'Two orbs, one of them at the very top. Only the bounce reaches it, and the exit is below.',
        },
        rafale: {
            name: 'The Gust',
            brief:
                'The wind carries you over two gaps — but one of the two landings blinks.',
        },
        tourmente: {
            name: 'The Storm',
            brief:
                'A gust, a blade that follows you, and a gap no jump can cross.',
        },
        sirocco: {
            name: 'The Sirocco',
            brief:
                'The wind carries, the ledges give way. The second one will not hold long enough to build up speed.',
        },
        engrenage: {
            name: 'The Gearing',
            brief:
                'Three orientations, three conveyor belts, and two pivots you hold for a second.',
        },
        moulin: {
            name: 'The Mill',
            brief:
                'It turns the wrong way: the quarter turns go counter-clockwise.',
        },
        pilon: {
            name: 'The Pestle',
            brief:
                'Two belts, two blades falling off-beat. It is the belt that decides where you are when they fall.',
        },
        eclair: {
            name: 'The Flash',
            brief:
                'A blink twice as fast as usual, and only every other ledge.',
        },
        syncope: {
            name: 'The Syncope',
            brief:
                'A belt carrying you backwards, towards a ledge that is not always there.',
        },
        arythmie: {
            name: 'The Arrhythmia',
            brief:
                'Three ledges, three different periods, none of them landing on the others.',
        },
        dislocation: {
            name: 'The Dislocation',
            brief:
                'Everything crumbles or blinks, the pivot included. Nothing you land on lasts.',
        },
        erosion: {
            name: 'The Erosion',
            brief:
                'Ice, then crumble, then ice. You arrive too fast on what will not hold.',
        },
        guet: {
            name: 'The Watch',
            brief:
                'The blade follows you over two blinking ledges. Waiting for the ground means waiting for the blade.',
        },
        embuscade: {
            name: 'The Ambush',
            brief:
                'One ledge exists only in a narrow window, and the blade does not let go while you look for it.',
        },
        curee: {
            name: 'The Quarry',
            brief:
                'Two orbs to collect with a blade overhead. The detour is paid for.',
        },
        verrou: {
            name: 'The Bolt',
            brief:
                'Two walls lock the climb. The way through opens only when the screen is laid on its side.',
        },
        garrot: {
            name: 'The Tourniquet',
            brief:
                'A belt pushing you towards the closing wall. Shrinking kills faster here than anywhere.',
        },
        'chausse-trappe': {
            name: 'The Trapdoor',
            brief:
                'The middle ledge appears only in a narrow window — and it gives way like the others.',
        },
        apnee: {
            name: 'Apnea',
            brief:
                'Two orbs, three orientations, and not one steady step between them.',
        },
        terminus: {
            name: 'The Terminus',
            brief:
                'The last one: bounce, wind, a blade that tracks you, and a quarter turn to end it.',
        },
    },
    puzzlesPage: {
        title: 'The puzzles',
        heading: 'One hundred hand-built puzzles',
        lede: 'From the first step to sequences that ask you to resize the window mid-flight.',
        metaDescription:
            'The 100 puzzles of Reflow, sorted by difficulty. Each plays on a browser mechanic: the edges, the theme, gravity, motion, rewinding.',
        done: '{done} of {total} finished',
        play: 'Play',
        statusDone: 'Finished',
        statusNew: 'Never played',
        bestTime: 'Best time: {time} s',
        mechanicsLabel: 'Mechanics',
        endlessTitle: 'And then?',
        endlessBody:
            'When all hundred have fallen, the endless runs take over: generated from a seed, never twice the same.',
        endlessCta: 'Move on to the endless runs',
    },
    puzzlePage: {
        play: 'Play this puzzle',
        previewHeading: 'Preview',
        previewAlt: 'Preview of the level {name}',
        previewNote:
            'Drawn by the game engine itself, at the size the puzzle was designed for. Dashed: the crumbling ledges, and what exists only in the other theme or at another window size.',
        briefHeading: 'What there is to work out',
        mechanicsHeading: 'Mechanics in play',
        tierHeading: 'Difficulty',
        statsHeading: 'Your run',
        statusDone: 'Finished in {time} s',
        statusNew: 'Not finished yet',
        previous: 'Previous puzzle',
        next: 'Next puzzle',
        backToCatalogue: 'All puzzles',
        metaTitle: '{name} — a {tier} Reflow puzzle',
        metaDescription: '{brief} A {tier} puzzle from Reflow, the game played in your window.',
        breadcrumb: 'Puzzles',
    },
    endless: {
        title: 'Endless runs',
        heading: 'Generated runs, never twice the same',
        lede: 'Every run is born from a seed. Difficulty climbs with the streak, and a seed fits inside a link.',
        metaDescription:
            'Reflow’s endless mode: levels generated from a seed, all different, steadily harder. No account, and every run can be shared as a link.',
        start: 'Start a run',
        again: 'Another run',
        seedLabel: 'Seed',
        seedHelp: 'Two players entering the same seed get exactly the same level.',
        seedPlaceholder: 'a word, a number…',
        seedApply: 'Play this seed',
        depth: 'Round {depth}',
        record: 'Best streak: {depth}',
        recordEmpty: 'No streak yet.',
        shareRun: 'Copy the link to this run',
        sections: [
            {
                title: 'What the seed decides',
                body: 'The seed fixes everything: the number of platforms, their width, their spacing, the edge each one is pinned to, the presence of blades and orbs. Given the same seed, two players on opposite sides of the world get the same level, to the pixel, without any server having to send it to them.',
            },
            {
                title: 'Why a generated run is always finishable',
                body: 'The generator does not scatter platforms and hope for the best: it builds the path. Each platform is placed within jumping range of the last, height and distance derived from the character’s real trajectory. The run is therefore finishable by construction, at the reference size shown at the top of the screen.',
            },
        ],
    },
    rules: {
        title: 'Rules',
        heading: 'How to play',
        lede: 'Arrow keys to move, space to jump, and the window for everything else.',
        metaDescription:
            'How Reflow is played: moving, jumping, rewinding, and above all resizing the browser window to move the scenery itself.',
        steps: [
            {
                title: 'Move and jump',
                body: 'Left and right arrows, or A and D. Space, the up arrow or W to jump. Letting go early gives a short hop: it is the only key with two heights.',
            },
            {
                title: 'The window is the scenery',
                body: 'Every platform is pinned to an edge of the window. Dragging the corner of your browser does not change the scale of the game: it moves the platforms relative to each other. It is the most powerful control in the game, and it is on no key at all.',
            },
            {
                title: 'Zoom counts too',
                body: 'Ctrl and + shrink the playfield in CSS pixels, Ctrl and − enlarge it. It is a second way of resizing, useful when the window already fills the screen.',
            },
            {
                title: 'Dying costs nothing',
                body: 'A spike, a fall into the void or a crush between two walls restarts the attempt on the spot. R rewinds six seconds, and on some puzzles the browser’s Back button does the same.',
            },
            {
                title: 'Orbs keep the exit shut',
                body: 'When a level carries orbs, the exit stays closed while one remains. You then have to cross, collect, and come back.',
            },
            {
                title: 'Nothing is stored anywhere but here',
                body: 'Your progress and your best times live in your browser’s local storage. No account, nothing sent, and clearing that storage resets everything.',
            },
            {
                title: 'A hint if you get stuck',
                body: 'After a while, or a few deaths, a “Hint” button lights up in the game bar. Three rungs, from vaguest to most concrete — and none of them gives the solution: they name the mechanic in play and the gesture to try, never where to jump or at what size.',
            },
        ],
        back: 'Play',
    },
    mechanicsPage: {
        browserHeading: 'What comes from the browser',
        rulesHeading: 'And the game’s own rules',
        title: 'Mechanics',
        heading: 'What Reflow borrows from the browser',
        lede: 'All taken from interfaces the browser already exposes — and that no game uses.',
        metaDescription:
            'The mechanics of Reflow and what they borrow from the browser: window size, edges, light or dark theme, gravity, browsing history.',
        intro: 'A regular platformer draws its scenery in a canvas and ignores the window around it. Reflow does the opposite: it has no scenery of its own. Its geometry is a function of the size of your window, and anything the browser lets you measure becomes a control.',
        outro: 'A seventh mechanic exists on paper — one character crossing two side-by-side windows, kept in sync without a server. It is waiting for a later version: it depends on a pop-up blocker, and a mechanic that only works for half the players is not a mechanic.',
        back: 'Play',
    },
    about: {
        title: 'About',
        heading: 'About Reflow',
        lede: 'A platformer with no account, no advertising and no game server.',
        metaDescription:
            'Reflow, a free platformer played with the browser window. How it is built, what is not collected, and who is behind the site.',
        sections: [
            {
                title: 'How it is built',
                body: 'The site is entirely static: HTML written once and served by nginx. The physics engine runs in your browser at a fixed step, and generated levels are born from a seed rather than from a server. There is nothing to back up, nothing that can break, and the game works offline once the page has loaded.',
            },
            {
                title: 'The levels are verified by a machine',
                body: 'An unplayable puzzle does not show up on reading: nothing crashes, it is simply impossible. Every level is therefore replayed by a program that searches for a sequence of actions leading to the exit, using the game engine and its real constants. No level is published without that proof.',
            },
            {
                title: 'What is not collected',
                body: 'No account, no advertising, no third-party tracker. Your progress is kept in your browser and is never sent anywhere. Audience measurement is a self-hosted Matomo, configured without cookies.',
            },
            {
                title: 'Who made it',
                body: '{author}, developer. Reflow joins Azimut, Push Your Luck and Loups-Garous, gathered on a common board.',
            },
        ],
        clearTitle: 'Erase your progress',
        clearBody:
            'Your finished puzzles, your best times, the hints you unlocked and your best streak live in this browser and nowhere else. This button deletes them, and there is no undo.',
        clearButton: 'Erase everything',
        cleared: 'Erased',
        contactTitle: 'Write',
        contactBody: 'An impossible puzzle, a clumsy translation, an idea:',
        back: 'Play',
    },
    legal: {
        title: 'Legal notice',
        heading: 'Legal notice',
        lede: 'The information the law requires from a publicly accessible site.',
        metaDescription:
            'Publisher, host and terms of use for reflow.leoderoin.fr, the platformer whose level is the browser window.',
        sections: [
            {
                title: 'Publisher',
                body: 'The site reflow.leoderoin.fr is published by {author}, personally and non-commercially. The publication director is the publisher himself.',
            },
            {
                title: 'Host',
                body: 'The site is hosted by {host}, {address}. Telephone: {phone}. Company number {registration}.',
            },
            {
                title: 'Content',
                body: 'The texts, the levels, the engine and the illustrations on this site are the work of its publisher. The source code is released under the MIT licence. The Space Grotesk and JetBrains Mono typefaces are distributed under the SIL Open Font licence.',
            },
            {
                title: 'Outbound links',
                body: 'This site links only to jeux.leoderoin.fr, its author’s personal site and the public code repository. It carries no advertising and no commercial or affiliate link.',
            },
        ],
        contactTitle: 'Contact',
        contactBody: 'For any question about this notice:',
        back: 'Play',
    },
    privacy: {
        title: 'Privacy',
        heading: 'Privacy',
        lede: 'What is measured, what is not, and where it stays.',
        metaDescription:
            'What Reflow measures, what it does not, and what stays in your browser. No account, no third-party tracker, no measurement cookie.',
        sections: [
            {
                title: 'Your progress',
                body: 'The puzzles you have finished, your best times, the hints you have unlocked and your best endless streak are kept in your browser’s local storage. They are NEVER sent to a server: there is none. You can erase all of it with one button, from the “about” page.',
            },
            {
                title: 'The game itself',
                body: 'The physics engine and the level generation run entirely in your browser. A generated run is born from a seed computed on your machine, and nothing you play is transmitted anywhere.',
            },
            {
                title: 'Audience measurement',
                body: 'The site uses Matomo, installed on the same server. It records the pages visited, the browser language, the device type and the referring page. No data goes to a third-party service, and there is no ad network and no embedded social widget.',
            },
            {
                title: 'Cookies',
                body: 'None. Matomo is configured without cookies, which spares this site a consent banner. Your theme choice is kept in local storage and never sent to the server.',
            },
            {
                title: 'Server logs',
                body: 'Like any web server, this one keeps technical access logs: IP address, date, page requested. They serve diagnosis and security, and are used for nothing else.',
            },
            {
                title: 'Your rights',
                body: 'You may request access to the data concerning you, its correction or its erasure. The request is made by email and needs no justification.',
            },
        ],
        contactTitle: 'Write',
        contactBody: 'To exercise your rights or ask a question:',
        back: 'Play',
    },
    footer: {
        madeBy: 'Made by {author}',
        source: 'Source code',
        otherGames: 'My other games',
        versionLabel: 'Version {version}',
    },
    notFound: {
        title: 'Page not found',
        body: 'This address does not match anything on this site.',
        back: 'Back to the game',
    },
};
