import type { Dictionary } from './fr';

export const de: Dictionary = {
    meta: {
        title: 'Reflow',
        titleTag: 'Reflow — das Jump-and-Run, dessen Level dein Fenster ist',
        description:
            'Ein Jump-and-Run, dessen Kulisse das Browserfenster ist. Ändere seine Größe, um die Plattformen zu verschieben, wechsle das Thema, um weitere erscheinen zu lassen. 100 Rätsel und endlose Partien, ohne Konto.',
        ogAlt: 'Reflow — ein Jump-and-Run, das mit dem Browserfenster gespielt wird',
        keywords:
            'Browser Jump and Run, Fenstergröße Spiel, originelles Webspiel, Browser Rätsel, kostenloses Spiel ohne Konto, Puzzle-Platformer',
        shortName: 'Reflow',
    },
    header: {
        skipToContent: 'Zum Inhalt springen',
        brand: 'Reflow',
        tagline: 'das Level ist dein Fenster',
        navLabel: 'Navigation',
        navPuzzles: 'Rätsel',
        navEndless: 'Endlos',
        navMechanics: 'Mechaniken',
        navRules: 'Regeln',
        navAbout: 'Über',
        languageLabel: 'Sprache',
        themeLabel: 'Thema',
        themeToggle: 'Thema: {mode}',
        themeSystem: 'System',
        themeLight: 'Hell',
        themeDark: 'Dunkel',
    },
    home: {
        kicker: 'Jump-and-Run',
        title: 'Das Level ist dein Fenster',
        lede: 'Jede Plattform hängt an einem Fensterrand. Verkleinere das Fenster, und sie kommen zu dir. Vergrößere es, und der Abgrund öffnet sich.',
        play: 'Spielen',
        playFirst: 'Mit dem ersten Rätsel beginnen',
        resume: 'Fortsetzen',
        browse: 'Alle 100 Rätsel ansehen',
        endless: 'Endlose Partien',
        progress: '{done} von {total} Rätseln gelöst',
        sections: [
            {
                title: 'Eine Kulisse, die kein anderes Spiel benutzt',
                body: 'In Reflow hat keine Plattform eine absolute Position. Jede hängt an einem Fensterrand: Breite und Höhe deines Browsers gehen Bild für Bild in ihre Lage ein. Eine Ecke zu ziehen skaliert keine Ansicht des Spiels — es verschiebt die Kulisse, öffnet Durchgänge, schließt andere und kann dich an eine Wand quetschen.',
            },
            {
                title: 'Mechaniken, dem Browser abgeschaut',
                body: 'Die Größenänderung ist nur die erste. Manche Blöcke existieren nur unterhalb einer bestimmten Breite. Andere nur im hellen Thema, oder nur im dunklen — der Themenschalter wird zur Spielsteuerung. Der Browser-Zoom ändert die Größe des Spielfelds, die Zurück-Schaltfläche spult die Zeit zurück, und ein zu schmales Fenster tötet.',
            },
            {
                title: 'Hundert Rätsel, dann das Endlose',
                body: 'Die hundert handgebauten Rätsel reichen vom ersten Sprung bis zu Abfolgen, die verlangen, mitten im Flug die Fenstergröße zu ändern. Sind sie gelöst, übernimmt der Endlosmodus: jede Partie entsteht aus einem Startwert, keine wiederholt sich, und die Schwierigkeit steigt mit der Serie. Ein Startwert passt in einen Link — die eben gespielte Partie lässt sich unverändert weitergeben.',
            },
            {
                title: 'Kein Konto, keine Werbung',
                body: 'Reflow läuft vollständig in deinem Browser. Es gibt keinen Spielserver, kein Konto, keine Werbung und keinen Tracker Dritter. Dein Fortschritt bleibt in deinem Browser und wird nirgendwohin gesendet.',
            },
        ],
        rulesLink: 'Die Regeln lesen',
        mechanicsLink: 'Die Mechaniken im Detail',
    },
    game: {
        title: 'Spielfeld',
        close: 'Verlassen',
        restart: 'Neu starten',
        rewind: 'Zurückspulen',
        pause: 'Pause',
        resume: 'Fortsetzen',
        attempts: 'Versuch {count}',
        elapsed: 'Zeit',
        orbs: 'Kugeln',
        size: 'Fenster',
        won: 'Geschafft',
        wonIn: 'Geschafft in {time} s, {count} Versuche',
        wonInOne: 'Geschafft in {time} s, im ersten Versuch',
        deadSpike: 'Getroffen',
        deadFall: 'Gestürzt',
        deadCrush: 'Vom Fenster zerquetscht',
        retry: 'Nochmal',
        next: 'Nächstes Rätsel',
        nextRun: 'Nächste Partie',
        backToCatalogue: 'Zurück zum Katalog',
        share: 'Link zur Partie kopieren',
        copied: 'Link kopiert',
        hintResize: 'Ändere die Fenstergröße.',
        controlsTitle: 'Steuerung',
        controlMove: 'Bewegen',
        controlJump: 'Springen',
        controlRewind: 'Zurückspulen',
        controlRestart: 'Neu starten',
        controlQuit: 'Verlassen',
        rewindArmed: 'Die Zurück-Schaltfläche des Browsers spult dieses Rätsel zurück.',
        tooSmall: 'Fenster zu klein',
        tooSmallBody:
            'Das Spielfeld fällt unter {w} × {h} Pixel: für ein Level ist kein Platz mehr. Vergrößere das Fenster.',
        touchTitle: 'Eine Tastatur ist nötig',
        touchBody:
            'Reflow wird mit Tastatur und einem größenveränderbaren Fenster gespielt. Ein Telefon hat weder das eine noch das andere: das Spiel wartet auf einem Rechner auf dich.',
        touchAnyway: 'Trotzdem versuchen',
    },
    tiers: {
        easy: 'Leicht',
        medium: 'Mittel',
        hard: 'Schwer',
        easyPlural: 'Leichte',
        mediumPlural: 'Mittlere',
        impossible: 'Unmöglich',
        impossiblePlural: 'Unmögliche',
        hardPlural: 'Schwere',
    },
    hints: {
        button: 'Hinweis',
        available: 'Ein Hinweis ist verfügbar',
        heading: 'Hinweis {n} von {total}',
        close: 'Schließen',
        more: 'Noch ein Hinweis',
        step1: 'Dieses Rätsel spielt mit:',
        step2: 'Was das bedeutet:',
        step3: 'Was zu versuchen ist:',
        promise:
            'Keiner dieser Hinweise verrät die Lösung: das Rätsel bleibt ganz.',
        gestures: {
            resize:
                'Das Fenster ist der einzige Hebel. Bring es näher an die Größe oben rechts.',
            edge:
                'Nicht jeder Absatz hängt am selben Rand. Zieh an einer Seite und schau, welche sich bewegen.',
            appear:
                'Ein Stück des Weges fehlt. Verkleinere das Fenster deutlich und schau, was erscheint.',
            motion:
                'Warten ist eine Handlung. Spring nicht, sobald du kannst.',
            theme:
                'Wechsle das Thema mitten in der Partie — Taste T, oder die Schaltfläche in der Spielleiste.',
            rewind:
                'Halte R, um sechs Sekunden zurückzuspulen. Bei diesem Rätsel tut die Zurück-Schaltfläche dasselbe.',
            orbs:
                'Der Ausgang bleibt zu, solange eine Kugel fehlt. Sieh auf den Zähler oben rechts.',
            crush:
                'Verkleinern kann töten. Schau, wo du stehst, bevor du an einem Rand ziehst.',
            ice:
                'Auf dem Eis bremse vor der Kante. Der Schwung trägt, die Leere auch.',
            bounce:
                'Ein federnder Absatz wirft höher als ein Sprung. Lass dich darauf fallen.',
            conveyor:
                'Das Band trägt dich: geh dagegen an, um stehen zu bleiben.',
            blink:
                'Zähl den Takt. Der Boden kommt immer im selben Abstand zurück.',
            chase:
                'Die Klinge richtet sich auf dich aus. Beweg dich und komm zurück: sie braucht Zeit zum Fallen.',
            wind:
                'Der Wind ändert die Reichweite deiner Sprünge. Spring früher oder später.',
            crumble:
                'Bleib nicht auf einem brüchigen Absatz stehen: quere ihn.',
            gravity:
                'Dreh den Bildschirm. Was eine Wand war, wird zum Boden.',
            screen:
                'Das Spielfeld lässt sich einstellen: zieh an den Griffen, dreh es.',
        },
    },
    mechanics: {
        resize: {
            name: 'Größe ändern',
            body: 'Das Fenster ist das Level. Seine Breite und Höhe gehen in jedem Bild in die Position jedes Blocks ein.',
        },
        edge: {
            name: 'Die Ränder',
            body: 'Jeder Block hängt an einem Rand. An einer Seite zu ziehen holt heran, was daran hängt, und schiebt alles andere weg: genau das macht einen Abgrund überwindbar.',
        },
        appear: {
            name: 'Erscheinungen',
            body: 'Manche Blöcke existieren nur oberhalb oder nur unterhalb einer bestimmten Fenstergröße. Nichts kündigt sie an — man findet sie, indem man an einem Rand zieht.',
        },
        motion: {
            name: 'Bewegung',
            body: 'Plattformen, die hin und her fahren, Klingen, die von der Decke fallen. Auf den richtigen Moment zu warten ist eine eigenständige Handlung. Wenn dein System reduzierte Bewegung verlangt, laufen diese Bewegungen halb so schnell.',
        },
        theme: {
            name: 'Das Thema',
            body: 'Blöcke, die nur im hellen Thema existieren, andere nur im dunklen. Der Themenschalter in der Spielleiste, oder die Taste T, wird zur Steuerung wie das Springen.',
        },
        rewind: {
            name: 'Das Zurückspulen',
            body: 'Die Zeit läuft sechs Sekunden zurück. Bei diesen Rätseln spult die Zurück-Schaltfläche des Browsers zurück, statt die Seite zu verlassen.',
        },
        orbs: {
            name: 'Die Kugeln',
            body: 'Der Ausgang bleibt zu, solange eine fehlt: das Level muss in beide Richtungen durchquert werden.',
        },
        crush: {
            name: 'Das Zerquetschen',
            body: 'Zwei Wände treffen sich, und für dich bleibt kein Platz. Das Fenster zu verkleinern kann töten.',
        },
        ice: {
            name: 'Das Eis',
            body: 'Ein Absatz ohne Reibung: der Schwung bleibt, und Bremsen braucht so viel Platz wie Anfahren.',
        },
        bounce: {
            name: 'Der Absprung',
            body: 'Ein federnder Absatz wirft höher als ein Sprung. Nur so erreicht man manche Absätze — und landet auf Stacheln.',
        },
        conveyor: {
            name: 'Das Band',
            body: 'Ein Absatz, der dich trägt, solange du darauf stehst. Stehenbleiben heißt dort gehen.',
        },
        blink: {
            name: 'Das Blinken',
            body: 'Blöcke, die nur einen Teil der Zeit existieren. Der Boden unter den Füßen verschwindet im festen Takt.',
        },
        chase: {
            name: 'Die folgende Klinge',
            body: 'Eine Klinge an der Decke, die sich auf deine waagerechte Position ausrichtet. Man hängt sie nicht ab: man geht im richtigen Moment darunter durch.',
        },
        wind: {
            name: 'Der Wind',
            body: 'Eine Zone, die ständig drückt. Sie verändert die Reichweite jedes Sprungs, der sie kreuzt, in die eine oder andere Richtung.',
        },
        crumble: {
            name: 'Die brüchigen Absätze',
            body: 'Sie geben keine halbe Sekunde nach dem Aufsetzen nach. Man quert sie, man ruht nicht darauf.',
        },
        gravity: {
            name: 'Die Schwerkraft',
            body: 'Der Bildschirm dreht sich in Vierteldrehungen, und der Fall folgt. Manche Rätsel sind nicht in einer einzigen Ausrichtung geschrieben: Ihr Weg zweigt an einem quadratischen Drehpunkt ab, und was danach kommt, ist erst Boden, wenn der Bildschirm gedreht ist.',
        },
        screen: {
            name: 'Der innere Bildschirm',
            body: 'Das Spielfeld ist ein Bildschirm, den du selbst einstellst: seine Griffe verändern seine Größe, seine Drehung die Fallrichtung. Das Browserfenster bleibt seine Grenze.',
        },
    },
    puzzles: {
        seuil: { name: 'Die Schwelle', brief: 'Nichts zu überwinden: nur zu begreifen, dass der Ausgang am rechten Fensterrand hängt und sich mit ihm bewegt.' },
        marche: { name: 'Die Stufe', brief: 'Eine Plattform, ein Sprung. Genug, um zu lernen, dass der Boden der untere Fensterrand ist und sonst nichts.' },
        enjambee: { name: 'Der Schritt', brief: 'Zwei Stachelbänder ebenerdig. Der Anlauf zählt hier so viel wie der Sprung.' },
        corniche: { name: 'Das Sims', brief: 'Vier Absätze, die nach rechts ansteigen. Das erste Mal, dass man Höhe gewinnt.' },
        descente: { name: 'Der Abstieg', brief: 'Der Weg führt hinab statt hinauf: Fallen wird zu einer Art des Vorankommens.' },
        bordure: { name: 'Der Rand', brief: 'Das Ziel hängt rechts, der Start links: der Abstand dazwischen ist die Breite deines Fensters.' },
        suspendu: { name: 'Das Hängende', brief:
                'Der Weg hängt an der Decke: begehbar wird er erst, wenn der Bildschirm gedreht ist.' },
        lucarne: { name: 'Die Dachluke', brief: 'In der Mitte fehlt eine Brücke. Es gibt sie dennoch — aber nur unterhalb einer bestimmten Breite.' },
        balancier: { name: 'Die Schaukel', brief: 'Eine Plattform, die steigt und sinkt. Warten wird hier zur Handlung.' },
        navette: { name: 'Die Fähre', brief: 'Dieselbe Idee waagerecht: eine Plattform, die von einem Ende ihres Gangs zum anderen fährt.' },
        clairiere: { name: 'Die Lichtung', brief: 'Der Weg existiert nur im hellen Thema: im dunklen gibt es weder Plattform noch Ausgang. Die Taste T ist hier eine Spielsteuerung.' },
        nocturne: { name: 'Nocturne', brief: 'Umgekehrt, und schlimmer: im hellen Thema werden die Plattformen zu Stacheln.' },
        collecte: { name: 'Die Sammlung', brief: 'Zwei Kugeln, die einzusammeln sind, bevor der Ausgang sich zu öffnen bequemt.' },
        detour: { name: 'Der Umweg', brief: 'Die Kugeln liegen am Ende des Wegs, der Ausgang am Start. Man muss zurück.' },
        ecart: { name: 'Der Abstand', brief: 'Die Absätze wechseln zwischen linkem und rechtem Rand: das Fenster zieht sie paarweise auseinander.' },
        rebord: { name: 'Die Fensterbank', brief: 'Vier Absätze unter hundert Pixeln. Genauigkeit ersetzt Reichweite.' },
        couloir: { name: 'Der Gang', brief: 'Zwei niedrige Mauern am Boden und ein Weg, der knapp darüber verläuft.' },
        vide: { name: 'Die Leere', brief: 'Das erste Rätsel ohne Boden: Fallen kostet nicht mehr ein Stachelband, sondern den Versuch.' },
        pendule: { name: 'Das Pendel', brief: 'Zwei bewegte Plattformen über der Leere, absichtlich gegeneinander verschoben.' },
        entonnoir: { name: 'Der Trichter', brief: 'Zwei Wege schließen sich aus: der eine über 860 Pixel Breite, der andere darunter.' },
        etau: { name: 'Der Schraubstock', brief: 'Zwei Wände, eine links, eine rechts verankert. Verkleinern lässt sie sich treffen — auf dir.' },
        escalier: { name: 'Die Treppe', brief: 'Vier Absätze und zwei Klingen, die die Treppe gegeneinander versetzt fegen.' },
        traverse: { name: 'Die Querung', brief: 'Fast alles hängt am rechten Rand, über der Leere. Das Fenster ist der einzige verbliebene Hebel.' },
        alternance: { name: 'Der Wechsel', brief: 'Eine helle Plattform, eine dunkle, im Wechsel: das Thema muss mitten in der Querung umgeschaltet werden.' },
        guillotine: { name: 'Die Guillotine', brief: 'Drei Klingen fallen von der Decke, jede in ihrem eigenen Takt.' },
        serpentin: { name: 'Die Serpentine', brief: 'Der Weg macht im Aufstieg zwei Kehren. Man läuft über die eigene Spur hinweg.' },
        bascule: {
            name: 'Die Wippe',
            brief:
                'Zwei gegenläufige Plattformen, dann ein quadratischer Drehpunkt: der Rest des Weges wird erst eine Vierteldrehung später zum Boden.',
        },
        jachere: { name: 'Die Brache', brief: 'Ein Weg, den es nur im Hellen gibt — und eine Klinge, die es ebenfalls nur im Hellen gibt.' },
        cordee: { name: 'Die Seilschaft', brief: 'Drei Kugeln entlang eines durchgehenden Aufstiegs. Keine davon nimmt man im Vorbeigehen mit.' },
        grenier: { name: 'Der Dachboden', brief:
                'Alles steht kopf, der Ausgang auch. Den Bildschirm zu drehen ist der einzige Weg, einen Fuß daraufzusetzen.' },
        passerelle: { name: 'Der Steg', brief: 'Das mittlere Feld erscheint erst unter 800 Pixeln Breite.' },
        tourniquet: {
            name: 'Das Drehkreuz',
            brief:
                'Drei Ausrichtungen nacheinander. Jeder Drehpunkt übergibt an die nächste, und man hält sich nur einen Moment darauf.',
        },
        cascade: { name: 'Die Kaskade', brief: 'Ein langer Abstieg, bei dem ein Absatz im falschen Moment seitlich wegrutscht.' },
        sablier: { name: 'Die Sanduhr', brief: 'Oberhalb von 780 Pixeln versperrt eine Wand den Weg; der Durchgang öffnet sich nur darunter.' },
        relais: { name: 'Die Staffel', brief: 'Zwei Kugeln, getragen von bewegten Plattformen, über der Leere.' },
        faille: { name: 'Der Spalt', brief: 'Drei Abstände von hundertzehn Pixeln, genau an der Grenze eines Sprungs.' },
        vertige: { name: 'Der Schwindel', brief: 'Kein Boden, vier bewegte Plattformen und ein letzter Absatz, der am rechten Rand klebt.' },
        dedale: { name: 'Das Labyrinth', brief: 'Das Level hat je nach Breite zwei Gesichter, und der Ausgang liegt nicht am selben Ort.' },
        funambule: { name: 'Der Seiltänzer', brief: 'Siebzig Pixel breite Absätze über der Leere und zwei Kugeln, die nicht zu verfehlen sind.' },
        contrepoids: { name: 'Das Gegengewicht', brief:
                'Ein Weg, kopfüber gebaut. Richtig herum gelesen führt er nirgendwohin.' },
        retour: {
            name: 'Die Rückkehr',
            brief:
                'Der Drehpunkt geht in die andere Richtung. Das Zurückspulen bleibt für die Fehler — es wird welche geben.',
        },
        metronome: { name: 'Das Metronom', brief: 'Drei Klingen im Abstand einer Drittelzeit. Der Rhythmus ist die einzige Lösung.' },
        eclipse: { name: 'Die Finsternis', brief: 'Der Weg wechselt über der Leere das Thema: zu spät umzuschalten heißt, ins Nichts zu springen.' },
        tenaille: { name: 'Die Zange', brief: 'Ein Durchgang, den es nur unter 900 Pixeln gibt, zwischen zwei sich schließenden Wänden.' },
        verticale: {
            name: 'Die Senkrechte',
            brief:
                'Ein Schacht, der erst zum Schacht wird, wenn der Bildschirm kippt: aufrecht sind seine Stufen bloße Säulen.',
        },
        gouffre: { name: 'Der Abgrund', brief: 'Vier Abstände von neunzig Pixeln, alle von atmenden Plattformen getragen.' },
        spirale: {
            name: 'Die Spirale',
            brief:
                'Der Weg windet sich eine volle Umdrehung und wechselt an jeder Ecke den Boden.',
        },
        veilleuse: { name: 'Das Nachtlicht', brief: 'Ein Weg, den es nur im Dunkeln gibt und dessen mittleres Feld nur im schmalen Fenster existiert.' },
        horloge: { name: 'Die Uhr', brief: 'Drei Plattformen gleicher Periode, um ein Drittel versetzt. Man muss in den Takt einsteigen.' },
        cordon: { name: 'Die Schnur', brief: 'Drei Kugeln in den vier Ecken des Fensters, und der Ausgang zurück am Start.' },
        abime: { name: 'Der Schlund', brief: 'Zwei bedingte Felder über der Leere: das Fenster verkleinern oder fallen.' },
        charniere: {
            name: 'Das Scharnier',
            brief:
                'Der Weg knickt im rechten Winkel ab. Seine zweite Hälfte besteht nur aus Säulen — erst gekippt tragen sie.',
        },
        souffle: { name: 'Der letzte Atemzug', brief: 'Fünf bewegte Absätze, zwei Kugeln, kein Boden und der Ausgang am rechten Rand.' },
        epilogue: { name: 'Der Epilog', brief: 'Alles auf einmal — die Ränder, das Thema, die Bewegung, die Kugeln und die Leere.' },
        verglas: {
            name: 'Das Glatteis',
            brief:
                'Vier Eisabsätze über der Leere. Bremsen braucht so viel Platz wie Anlaufen, und den gibt es nicht.',
        },
        patinoire: {
            name: 'Die Eisbahn',
            brief:
                'Breite Eisflächen, und Stacheln, die unten warten. Der Schwung hält lange an, nachdem man die Taste losgelassen hat.',
        },
        banquise: {
            name: 'Das Packeis',
            brief:
                'Eine durchgehend vereiste Serpentine mit einer Kehre auf halber Höhe. Die Kehre ist das Problem.',
        },
        derapage: {
            name: 'Das Schleudern',
            brief:
                'Ein Band, das rückwärts drückt, eine Eisfläche, dann ein Band in die andere Richtung. Nichts bleibt an seinem Platz, du auch nicht.',
        },
        tremplin: {
            name: 'Das Sprungbrett',
            brief:
                'Ein federnder Absatz wirft doppelt so hoch wie ein Sprung. Nur so erreicht man den nächsten.',
        },
        catapulte: {
            name: 'Die Katapulte',
            brief:
                'Derselbe Absprung, aber die Landung schwingt. Man muss im richtigen Moment los, nicht wenn man bereit ist.',
        },
        ressac: {
            name: 'Die Rückströmung',
            brief:
                'Ein Absprung, dann eine Bö im Flug. Die Reichweite deines Sprungs ist nicht mehr die, die du kennst.',
        },
        soufflerie: {
            name: 'Der Windkanal',
            brief:
                'Drei Abstände, die kein Sprung überwindet. Nur der Wind kreuzt sie, und er weht nicht überall.',
        },
        bourrasque: {
            name: 'Die Bö',
            brief:
                'Zwei Böen um eine bewegte Plattform. Der Wind trägt dich, das Schwingen holt dich zurück.',
        },
        alize: {
            name: 'Der Passat',
            brief:
                'Der Wind weht gegen dich, über dem Eis. Das genügt, um dich in die eben überwundene Leere zurückzuschicken.',
        },
        tapis: {
            name: 'Das Band',
            brief:
                'Zwei Förderbänder in Gegenrichtung. Stehenbleiben heißt dort gehen.',
        },
        contresens: {
            name: 'Gegen den Strom',
            brief:
                'Zwei Bänder, beide rückwärts, über der Leere. Man kommt voran, indem man langsamer zurückweicht.',
        },
        laminoir: {
            name: 'Das Walzwerk',
            brief:
                'Zwei Bänder, zwei Wände, die sich beim Verkleinern treffen, und Stacheln dazwischen.',
        },
        stroboscope: {
            name: 'Das Stroboskop',
            brief:
                'Zwei Absätze, die gegenläufig blinken. Nie sind beide zugleich da.',
        },
        intermittence: {
            name: 'Das Flackern',
            brief:
                'Der Boden kommt im festen Takt zurück — aber nicht im selben Takt auf beiden Seiten.',
        },
        battement: {
            name: 'Der Herzschlag',
            brief:
                'Ein Absatz blinkt, einer schwingt, einer blinkt gegen den Takt. Drei Uhren, keine gestimmt.',
        },
        cendres: {
            name: 'Die Asche',
            brief:
                'Drei Absätze, die keine halbe Sekunde nach dem Aufsetzen nachgeben. Es gibt kein Anhalten mehr.',
        },
        effondrement: {
            name: 'Der Einsturz',
            brief:
                'Brüchige Absätze, getrennt von einer bewegten Plattform. Warten ist tödlich, nicht warten auch.',
        },
        poussiere: {
            name: 'Der Staub',
            brief:
                'Zwei Kugeln auf dem, was gleich fällt. Man muss zurück, und es wird nichts mehr da sein.',
        },
        damocles: {
            name: 'Damokles',
            brief:
                'Eine Klinge an der Decke richtet sich auf dich aus und fällt alle zweieinhalb Sekunden.',
        },
        traque: {
            name: 'Die Hetzjagd',
            brief:
                'Die Klinge folgt dir, und der Boden gibt hinter dir nach. Man kann weder halten noch umkehren.',
        },
        ombre: {
            name: 'Der Schatten',
            brief:
                'Der Weg existiert nur im dunklen Thema, und die Klinge folgt dir hindurch.',
        },
        frimas: {
            name: 'Der Raureif',
            brief:
                'Eis, darunter ein bewegter Absatz. Man kommt schnell an und noch schneller wieder weg.',
        },
        avalanche: {
            name: 'Die Lawine',
            brief:
                'Eisabsätze, die nachgeben. Bremsen dauert länger, als sie erlauben.',
        },
        congere: {
            name: 'Die Schneewehe',
            brief:
                'Ein Eisabsatz erscheint nur im schmalen Fenster. Ohne ihn ist die Lücke achtzig Pixel zu breit.',
        },
        trebuchet: {
            name: 'Das Trebuchet',
            brief:
                'Ein Absprung schickt dich direkt in eine Decke aus Stacheln. Man muss im Flug ausweichen.',
        },
        mortier: {
            name: 'Der Mörser',
            brief:
                'Zwei Kugeln, eine davon ganz oben. Nur der Absprung reicht hin, und der Ausgang liegt unten.',
        },
        rafale: {
            name: 'Der Windstoß',
            brief:
                'Der Wind trägt über zwei Lücken — aber eine der beiden Landungen blinkt.',
        },
        tourmente: {
            name: 'Der Sturm',
            brief:
                'Eine Bö, eine Klinge, die dir folgt, und eine Lücke, die kein Sprung überwindet.',
        },
        sirocco: {
            name: 'Der Schirokko',
            brief:
                'Der Wind trägt, die Absätze geben nach. Der zweite hält nicht lange genug für neuen Anlauf.',
        },
        engrenage: {
            name: 'Das Getriebe',
            brief:
                'Drei Ausrichtungen, drei Förderbänder und zwei Drehpunkte, auf denen man eine Sekunde steht.',
        },
        moulin: {
            name: 'Die Mühle',
            brief:
                'Sie dreht verkehrt herum: die Vierteldrehungen gehen gegen den Uhrzeigersinn.',
        },
        pilon: {
            name: 'Der Stößel',
            brief:
                'Zwei Bänder, zwei Klingen im Gegentakt. Das Band entscheidet, wo du stehst, wenn sie fallen.',
        },
        eclair: {
            name: 'Der Blitz',
            brief:
                'Ein Blinken doppelt so schnell wie sonst, und nur jeder zweite Absatz.',
        },
        syncope: {
            name: 'Die Synkope',
            brief:
                'Ein Band, das dich rückwärts trägt, auf einen Absatz zu, der nicht immer da ist.',
        },
        arythmie: {
            name: 'Die Arrhythmie',
            brief:
                'Drei Absätze, drei verschiedene Perioden, keine trifft auf die andere.',
        },
        dislocation: {
            name: 'Die Verrenkung',
            brief:
                'Alles bröckelt oder blinkt, der Drehpunkt eingeschlossen. Nichts, worauf man landet, hält.',
        },
        erosion: {
            name: 'Die Erosion',
            brief:
                'Eis, dann brüchig, dann Eis. Man kommt zu schnell auf dem an, was nicht halten wird.',
        },
        guet: {
            name: 'Die Wache',
            brief:
                'Die Klinge folgt dir über zwei blinkende Absätze. Auf den Boden warten heißt auf die Klinge warten.',
        },
        embuscade: {
            name: 'Der Hinterhalt',
            brief:
                'Ein Absatz existiert nur im schmalen Fenster, und die Klinge lässt nicht locker, während du ihn suchst.',
        },
        curee: {
            name: 'Die Hatz',
            brief:
                'Zwei Kugeln einzusammeln, mit einer Klinge über dem Kopf. Der Umweg wird bezahlt.',
        },
        verrou: {
            name: 'Der Riegel',
            brief:
                'Zwei Mauern verriegeln den Aufstieg. Der Durchgang öffnet sich nur, wenn der Bildschirm eine Vierteldrehung kippt.',
        },
        garrot: {
            name: 'Die Aderpresse',
            brief:
                'Ein Band, das dich zur sich schließenden Wand drückt. Verkleinern tötet hier schneller als sonst wo.',
        },
        'chausse-trappe': {
            name: 'Die Fallgrube',
            brief:
                'Der mittlere Absatz erscheint nur im schmalen Fenster — und er gibt nach wie die anderen.',
        },
        apnee: {
            name: 'Die Apnoe',
            brief:
                'Zwei Kugeln, drei Ausrichtungen und kein fester Tritt dazwischen.',
        },
        terminus: {
            name: 'Die Endstation',
            brief:
                'Die letzte: Sprungfeder, Wind, eine Klinge, die dich verfolgt, und eine Vierteldrehung zum Schluss.',
        },
    },
    puzzlesPage: {
        title: 'Die Rätsel',
        heading: 'Hundert handgebaute Rätsel',
        lede: 'Von der ersten Stufe bis zu Abfolgen, die verlangen, mitten im Flug die Fenstergröße zu ändern.',
        metaDescription:
            'Die 100 Rätsel von Reflow, nach Schwierigkeit geordnet. Jedes spielt mit einer Browser-Mechanik: den Fensterrändern, den Erscheinungen, dem Thema, der Bewegung, dem Zurückspulen.',
        done: '{done} von {total} gelöst',
        play: 'Spielen',
        statusDone: 'Gelöst',
        statusNew: 'Nie gespielt',
        bestTime: 'Bestzeit: {time} s',
        mechanicsLabel: 'Mechaniken',
        endlessTitle: 'Und danach?',
        endlessBody:
            'Wenn alle hundert gefallen sind, übernehmen die endlosen Partien: aus einem Startwert erzeugt, nie zweimal dieselbe.',
        endlessCta: 'Zu den endlosen Partien',
    },
    puzzlePage: {
        play: 'Dieses Rätsel spielen',
        previewHeading: 'Vorschau',
        previewAlt: 'Vorschau des Levels {name}',
        previewNote:
            'Von der Engine des Spiels selbst gezeichnet, in der Größe, für die das Rätsel entworfen wurde. Gestrichelt: die brüchigen Absätze, und was nur im anderen Thema oder bei einer anderen Fenstergröße existiert.',
        briefHeading: 'Was zu begreifen ist',
        mechanicsHeading: 'Beteiligte Mechaniken',
        tierHeading: 'Schwierigkeit',
        statsHeading: 'Dein Durchgang',
        statusDone: 'Gelöst in {time} s',
        statusNew: 'Noch nicht gelöst',
        previous: 'Vorheriges Rätsel',
        next: 'Nächstes Rätsel',
        backToCatalogue: 'Alle Rätsel',
        metaTitle: '{name} — {tier} Rätsel aus Reflow',
        metaDescription: '{brief} Ein {tier} Rätsel aus Reflow, dem Jump-and-Run, dessen Level das Browserfenster ist.',
        breadcrumb: 'Rätsel',
    },
    endless: {
        title: 'Endlose Partien',
        heading: 'Erzeugte Partien, nie zweimal dieselbe',
        lede: 'Jede Partie entsteht aus einem Startwert. Die Schwierigkeit steigt mit der Serie, und ein Startwert passt in einen Link.',
        metaDescription:
            'Der Endlosmodus von Reflow: aus einem Startwert erzeugte Level, alle verschieden, stetig schwerer. Ohne Konto, und jede Partie lässt sich als Link teilen.',
        start: 'Partie starten',
        again: 'Noch eine Partie',
        seedLabel: 'Startwert',
        seedHelp: 'Zwei Spieler, die denselben Startwert eingeben, erhalten genau dasselbe Level.',
        seedPlaceholder: 'ein Wort, eine Zahl…',
        seedApply: 'Diesen Startwert spielen',
        depth: 'Runde {depth}',
        record: 'Beste Serie: {depth}',
        recordEmpty: 'Noch keine Serie.',
        shareRun: 'Link zu dieser Partie kopieren',
        sections: [
            {
                title: 'Was der Startwert bestimmt',
                body: 'Der Startwert legt alles fest: die Zahl der Plattformen, ihre Breite, ihren Abstand, den Rand, an dem jede hängt, das Vorkommen von Klingen und Kugeln. Bei gleichem Startwert erhalten zwei Spieler am anderen Ende der Welt dasselbe Level, auf den Pixel genau, ohne dass ein Server es ihnen schicken müsste.',
            },
            {
                title: 'Warum eine erzeugte Partie immer lösbar ist',
                body: 'Der Generator streut die Plattformen nicht zufällig und hofft: er baut den Weg. Jede Plattform wird in Sprungweite der vorigen gesetzt, Höhe und Abstand aus der tatsächlichen Flugbahn der Figur abgeleitet. Die Partie ist damit von Bauart her lösbar, bei der oben angezeigten Referenzgröße.',
            },
        ],
    },
    rules: {
        title: 'Regeln',
        heading: 'So wird gespielt',
        lede: 'Die Pfeiltasten zum Gehen, die Leertaste zum Springen — und das Fenster für alles andere.',
        metaDescription:
            'Die Regeln von Reflow: die Figur bewegen, springen, zurückspulen und vor allem die Größe des Browserfensters ändern, um die Kulisse selbst zu verschieben.',
        steps: [
            {
                title: 'Bewegen und springen',
                body: 'Pfeil links und rechts, oder A und D. Leertaste, Pfeil hoch oder W zum Springen. Früh loszulassen ergibt einen kurzen Sprung: es ist die einzige Taste mit zwei Höhen.',
            },
            {
                title: 'Das Fenster ist die Kulisse',
                body: 'Jede Plattform hängt an einem Fensterrand. Die Ecke des Browsers zu ziehen ändert nicht den Maßstab des Spiels: es verschiebt die Plattformen gegeneinander. Es ist die mächtigste Steuerung des Spiels, und sie liegt auf keiner Taste.',
            },
            {
                title: 'Der Zoom zählt auch',
                body: 'Strg und + verkleinern das Spielfeld in CSS-Pixeln, Strg und − vergrößern es. Das ist eine zweite Art, die Größe zu ändern — nützlich, wenn das Fenster den Bildschirm schon ausfüllt.',
            },
            {
                title: 'Sterben kostet nichts',
                body: 'Ein Stachel, ein Sturz in die Leere oder das Zerquetschen zwischen zwei Wänden startet den Versuch auf der Stelle neu. R spult sechs Sekunden zurück, und bei manchen Rätseln tut die Zurück-Schaltfläche des Browsers dasselbe.',
            },
            {
                title: 'Kugeln halten den Ausgang zu',
                body: 'Trägt ein Level Kugeln, bleibt der Ausgang zu, solange eine fehlt. Dann heißt es: hinüber, aufsammeln und zurück.',
            },
            {
                title: 'Nichts wird woanders als bei dir gespeichert',
                body: 'Dein Fortschritt und deine Bestzeiten liegen im lokalen Speicher deines Browsers. Kein Konto, keine Übertragung — und diesen Speicher zu leeren setzt alles zurück.',
            },
            {
                title: 'Ein Hinweis, wenn du feststeckst',
                body: 'Nach einer Weile, oder nach ein paar Toden, leuchtet in der Spielleiste eine Schaltfläche „Hinweis“ auf. Drei Stufen, von der vagesten zur konkretesten — und keine verrät die Lösung: sie benennen die beteiligte Mechanik und die Geste, die zu versuchen ist, nie wo zu springen ist oder bei welcher Größe.',
            },
        ],
        back: 'Spielen',
    },
    mechanicsPage: {
        browserHeading: 'Was vom Browser kommt',
        rulesHeading: 'Und die Regeln des Spiels selbst',
        title: 'Mechaniken',
        heading: 'Was Reflow dem Browser abschaut',
        lede: 'Alle aus Schnittstellen, die der Browser längst bereitstellt — und die kein Spiel benutzt.',
        metaDescription:
            'Die Mechaniken von Reflow und was sie dem Browser entnehmen: die Fenstergröße, die Ränder, das helle oder dunkle Thema, den Zoom, den Verlauf.',
        intro: 'Ein gewöhnliches Jump-and-Run zeichnet seine Kulisse in eine Leinwand und kümmert sich nicht um das Fenster darum herum. Reflow macht das Gegenteil: es hat keine eigene Kulisse. Seine Geometrie ist eine Funktion der Größe deines Fensters, und alles, was der Browser messen lässt, wird zur Steuerung.',
        outro: 'Eine siebte Mechanik gibt es auf dem Papier — eine Figur, die zwei nebeneinander stehende Fenster durchquert, ohne Server synchron gehalten. Sie wartet auf eine spätere Fassung: sie hängt von einem Pop-up-Blocker ab, und eine Mechanik, die nur bei der Hälfte der Spieler funktioniert, ist keine.',
        back: 'Spielen',
    },
    about: {
        title: 'Über',
        heading: 'Über Reflow',
        lede: 'Ein Jump-and-Run ohne Konto, ohne Werbung und ohne Spielserver.',
        metaDescription:
            'Reflow, ein kostenloses Jump-and-Run, das mit dem Browserfenster gespielt wird. Wie es gebaut ist, was nicht erhoben wird und wer hinter der Seite steht.',
        sections: [
            {
                title: 'Wie es gebaut ist',
                body: 'Die Seite ist vollständig statisch: einmal geschriebenes HTML, von nginx ausgeliefert. Die Physik läuft in deinem Browser mit festem Schritt, und erzeugte Level entstehen aus einem Startwert statt aus einem Server. Es gibt nichts zu sichern, nichts, das ausfallen könnte, und das Spiel läuft offline weiter, sobald die Seite geladen ist.',
            },
            {
                title: 'Die Level prüft eine Maschine',
                body: 'Ein unspielbares Rätsel sieht man beim Lesen nicht: nichts stürzt ab, es ist schlicht unmöglich. Deshalb spielt ein Programm jedes Level nach und sucht eine Folge von Handlungen bis zum Ausgang — mit der Engine des Spiels und ihren echten Konstanten. Kein Level erscheint ohne diesen Beweis.',
            },
            {
                title: 'Was nicht erhoben wird',
                body: 'Kein Konto, keine Werbung, kein Tracker Dritter. Dein Fortschritt bleibt in deinem Browser und wird nirgendwohin gesendet. Die Reichweitenmessung ist ein selbst gehostetes Matomo, ohne Cookies eingerichtet.',
            },
            {
                title: 'Wer es gemacht hat',
                body: '{author}, Entwickler. Reflow gesellt sich zu Azimut, Push Your Luck und Loups-Garous, versammelt auf einer gemeinsamen Übersicht.',
            },
        ],
        clearTitle: 'Deinen Fortschritt löschen',
        clearBody:
            'Deine gelösten Rätsel, deine Bestzeiten, die freigeschalteten Hinweise und deine beste Serie liegen in diesem Browser und sonst nirgends. Diese Schaltfläche löscht sie, ohne Weg zurück.',
        clearButton: 'Alles löschen',
        cleared: 'Gelöscht',
        contactTitle: 'Schreiben',
        contactBody: 'Ein unmögliches Rätsel, eine holprige Übersetzung, eine Idee:',
        back: 'Spielen',
    },
    legal: {
        title: 'Impressum',
        heading: 'Impressum',
        lede: 'Die Angaben, die das Gesetz von einer öffentlich zugänglichen Seite verlangt.',
        metaDescription:
            'Herausgeber, Hoster und Nutzungsbedingungen von reflow.leoderoin.fr, dem Jump-and-Run, dessen Level das Browserfenster ist.',
        sections: [
            {
                title: 'Herausgeber',
                body: 'Die Seite reflow.leoderoin.fr wird von {author} herausgegeben, privat und nicht gewerblich. Verantwortlich für den Inhalt ist der Herausgeber selbst.',
            },
            {
                title: 'Hoster',
                body: 'Die Seite wird gehostet von {host}, {address}. Telefon: {phone}. Registernummer {registration}.',
            },
            {
                title: 'Inhalt',
                body: 'Die Texte, die Level, die Engine und die Illustrationen dieser Seite stammen von ihrem Herausgeber. Der Quellcode steht unter der MIT-Lizenz. Die Schriften Space Grotesk und JetBrains Mono werden unter der SIL-Open-Font-Lizenz vertrieben.',
            },
            {
                title: 'Ausgehende Links',
                body: 'Diese Seite verlinkt nur auf jeux.leoderoin.fr, die private Seite ihres Autors und das öffentliche Code-Repository. Sie zeigt keine Werbung und enthält keinen kommerziellen oder Affiliate-Link.',
            },
        ],
        contactTitle: 'Kontakt',
        contactBody: 'Bei Fragen zu diesem Impressum:',
        back: 'Spielen',
    },
    privacy: {
        title: 'Datenschutz',
        heading: 'Datenschutz',
        lede: 'Was gemessen wird, was nicht, und wo es bleibt.',
        metaDescription:
            'Was Reflow misst, was nicht, und was in deinem Browser bleibt. Kein Konto, kein Tracker Dritter, kein Mess-Cookie.',
        sections: [
            {
                title: 'Dein Fortschritt',
                body: 'Die gelösten Rätsel, deine Bestzeiten, die freigeschalteten Hinweise und deine beste Endlos-Serie liegen im lokalen Speicher deines Browsers. Sie werden NIE an einen Server gesendet: es gibt keinen. Du kannst alles mit einer Schaltfläche löschen, auf der Seite „Über“.',
            },
            {
                title: 'Das Spiel selbst',
                body: 'Die Physik-Engine und die Levelerzeugung laufen vollständig in deinem Browser. Eine erzeugte Partie entsteht aus einem Startwert, der auf deinem Rechner berechnet wird, und nichts von dem, was du spielst, wird irgendwohin übertragen.',
            },
            {
                title: 'Reichweitenmessung',
                body: 'Die Seite nutzt Matomo, installiert auf demselben Server. Erfasst werden die aufgerufenen Seiten, die Browsersprache, der Gerätetyp und die verweisende Seite. Keine Daten gehen an einen Dritten, und es gibt weder Werbenetzwerk noch eingebettetes soziales Netzwerk.',
            },
            {
                title: 'Cookies',
                body: 'Keine. Matomo ist ohne Cookies eingerichtet, was dieser Seite ein Einwilligungsbanner erspart. Deine Themenwahl bleibt im lokalen Speicher und wird nie an den Server gesendet.',
            },
            {
                title: 'Server-Protokolle',
                body: 'Wie jeder Webserver führt auch dieser technische Zugriffsprotokolle: IP-Adresse, Datum, angeforderte Seite. Sie dienen der Fehlersuche und der Sicherheit und werden zu nichts anderem genutzt.',
            },
            {
                title: 'Deine Rechte',
                body: 'Du kannst Auskunft über die dich betreffenden Daten, ihre Berichtigung oder ihre Löschung verlangen. Die Anfrage erfolgt per E-Mail und muss nicht begründet werden.',
            },
        ],
        contactTitle: 'Schreiben',
        contactBody: 'Um deine Rechte auszuüben oder eine Frage zu stellen:',
        back: 'Spielen',
    },
    footer: {
        madeBy: 'Erstellt von {author}',
        source: 'Quellcode',
        otherGames: 'Meine anderen Spiele',
        versionLabel: 'Version {version}',
    },
    notFound: {
        title: 'Seite nicht gefunden',
        body: 'Diese Adresse entspricht nichts auf dieser Seite.',
        back: 'Zurück zum Spiel',
    },
};
