// Dictionnaire de RÉFÉRENCE. Les autres langues sont typées d'après lui :
// ajouter une clé ici et l'oublier ailleurs casse `npm run typecheck`.
export const fr = {
    meta: {
        title: 'Reflow',
        titleTag: 'Reflow — le jeu de plateforme dont le niveau est votre fenêtre',
        description:
            'Un jeu de plateforme où le décor est la fenêtre du navigateur. Redimensionnez-la pour déplacer les plateformes, changez de thème pour en faire apparaître. 100 énigmes et des parties infinies, sans compte.',
        ogAlt: 'Reflow — un jeu de plateforme joué avec la fenêtre du navigateur',
        keywords:
            'jeu de plateforme navigateur, jeu redimensionner fenêtre, jeu web original, énigmes navigateur, jeu gratuit sans compte, puzzle platformer',
        shortName: 'Reflow',
    },
    header: {
        skipToContent: 'Aller au contenu',
        brand: 'Reflow',
        tagline: 'le niveau, c’est votre fenêtre',
        navLabel: 'Navigation',
        navPuzzles: 'Énigmes',
        navEndless: 'Infini',
        navMechanics: 'Mécaniques',
        navRules: 'Règles',
        navAbout: 'À propos',
        languageLabel: 'Langue',
        themeLabel: 'Thème',
        themeToggle: 'Thème : {mode}',
        themeSystem: 'Système',
        themeLight: 'Clair',
        themeDark: 'Sombre',
    },
    home: {
        kicker: 'Jeu de plateforme',
        title: 'Le niveau, c’est votre fenêtre',
        lede: 'Les plateformes sont accrochées aux bords de la fenêtre. Rétrécissez-la, et elles viennent à vous. Agrandissez-la, et le gouffre s’ouvre.',
        play: 'Jouer',
        playFirst: 'Commencer par la première énigme',
        resume: 'Reprendre',
        browse: 'Voir les 100 énigmes',
        endless: 'Parties infinies',
        progress: '{done} énigmes terminées sur {total}',
        sections: [
            {
                title: 'Un décor qu’aucun autre jeu n’utilise',
                body: 'Dans Reflow, aucune plateforme n’a de position absolue. Chacune est ancrée à un bord de la fenêtre : la largeur et la hauteur de votre navigateur entrent dans le calcul de sa place, image après image. Tirer sur un coin ne redimensionne pas une vue du jeu — ça déplace le décor, ouvre des passages, en referme d’autres, et peut vous écraser contre un mur.',
            },
            {
                title: 'Des mécaniques prises au navigateur',
                body: 'Le redimensionnement n’est que la première. Des blocs n’existent qu’en dessous d’une certaine largeur. D’autres n’existent que dans le thème clair, ou seulement dans le sombre — le bouton de thème devient une commande de jeu. Le zoom du navigateur change la taille de l’aire de jeu, le bouton Précédent rembobine le temps, et une fenêtre trop étroite tue.',
            },
            {
                title: 'Cent énigmes, puis l’infini',
                body: 'Les cent énigmes écrites à la main vont du premier saut à des enchaînements qui demandent de redimensionner en plein vol. Une fois terminées, le mode infini prend le relais : chaque partie est engendrée à partir d’une graine, aucune ne se répète, et la difficulté monte avec la série. Une graine tient dans un lien — la partie que vous venez de jouer se transmet telle quelle.',
            },
            {
                title: 'Aucun compte, aucune publicité',
                body: 'Reflow tourne entièrement dans votre navigateur. Il n’y a pas de serveur de jeu, pas de compte à créer, pas de publicité et aucun traqueur tiers. Votre progression reste dans votre navigateur et n’est envoyée nulle part.',
            },
        ],
        rulesLink: 'Lire les règles',
        mechanicsLink: 'Le détail des mécaniques',
    },
    game: {
        title: 'Aire de jeu',
        close: 'Quitter',
        restart: 'Recommencer',
        rewind: 'Rembobiner',
        pause: 'Pause',
        resume: 'Reprendre',
        attempts: 'Essai {count}',
        elapsed: 'Temps',
        orbs: 'Orbes',
        size: 'Fenêtre',
        won: 'Terminé',
        wonIn: 'Terminé en {time} s, {count} essais',
        wonInOne: 'Terminé en {time} s, du premier coup',
        deadSpike: 'Touché',
        deadFall: 'Tombé',
        deadCrush: 'Écrasé par la fenêtre',
        retry: 'Réessayer',
        next: 'Énigme suivante',
        nextRun: 'Partie suivante',
        backToCatalogue: 'Retour au catalogue',
        share: 'Copier le lien de la partie',
        copied: 'Lien copié',
        hintResize: 'Redimensionnez la fenêtre.',
        controlsTitle: 'Commandes',
        controlMove: 'Se déplacer',
        controlJump: 'Sauter',
        controlRewind: 'Rembobiner',
        controlRestart: 'Recommencer',
        controlQuit: 'Quitter',
        rewindArmed: 'Le bouton Précédent du navigateur rembobine cette énigme.',
        tooSmall: 'Fenêtre trop petite',
        tooSmallBody:
            'L’aire de jeu descend sous {w} × {h} pixels : il n’y a plus la place d’un niveau. Agrandissez la fenêtre.',
        touchTitle: 'Un clavier est nécessaire',
        touchBody:
            'Reflow se joue avec un clavier et une fenêtre redimensionnable. Sur un téléphone, ni l’un ni l’autre n’existe : le jeu vous attend sur un ordinateur.',
        touchAnyway: 'Essayer quand même',
    },
    tiers: {
        easy: 'Facile',
        medium: 'Moyenne',
        hard: 'Difficile',
        easyPlural: 'Faciles',
        mediumPlural: 'Moyennes',
        impossible: 'Impossible',
        impossiblePlural: 'Impossibles',
        hardPlural: 'Difficiles',
    },
    hints: {
        button: 'Indice',
        available: 'Un indice est disponible',
        heading: 'Indice {n} sur {total}',
        close: 'Fermer',
        more: 'Un indice de plus',
        step1: 'Cette énigme met en jeu :',
        step2: 'Ce que ça veut dire :',
        step3: 'Ce qu’il y a à essayer :',
        promise:
            'Aucun de ces indices ne donne la solution : l’énigme reste entière.',
        gestures: {
            resize:
                'La fenêtre est le seul levier. Rapproche-la de la cote affichée en haut à droite.',
            edge:
                'Tous les paliers ne sont pas accrochés au même bord. Tire sur un côté, et regarde lesquels bougent.',
            appear:
                'Il manque un morceau du chemin. Rétrécis franchement la fenêtre, et regarde ce qui apparaît.',
            motion:
                'Attendre est une action. Ne saute pas dès que tu peux.',
            theme:
                'Change de thème en pleine partie — la touche T, ou le bouton dans la barre du jeu.',
            rewind:
                'Maintiens R pour rembobiner six secondes. Sur cette énigme, le bouton Précédent du navigateur fait la même chose.',
            orbs:
                'La sortie reste fermée tant qu’il reste une orbe. Regarde le compteur, en haut à droite.',
            crush:
                'Rétrécir peut tuer. Regarde où tu te trouves avant de tirer sur un bord.',
            ice:
                'Sur la glace, freinez avant le bord. L\'élan se garde, et le vide aussi.',
            bounce:
                'Un palier élastique renvoie plus haut qu\'un saut. Laissez-vous tomber dessus.',
            conveyor:
                'Le tapis vous déplace : marchez à contresens pour tenir en place.',
            blink:
                'Comptez le rythme. Le sol revient toujours au même intervalle.',
            chase:
                'La lame se cale sur vous. Bougez, puis revenez : elle met un temps à redescendre.',
            wind:
                'Le vent change la portée de vos sauts. Décollez plus tôt, ou plus tard.',
            crumble:
                'Ne vous arrêtez pas sur un palier friable : traversez-le.',
            gravity:
                'Fais pivoter l’écran. Ce qui était un mur devient un sol.',
            screen:
                'L’écran de jeu se règle : tire ses poignées, tourne-le.',
        },
    },
    mechanics: {
        resize: {
            name: 'Redimensionner',
            body: 'La fenêtre est le niveau. Sa largeur et sa hauteur entrent dans le calcul de la position de chaque bloc, à chaque image.',
        },
        edge: {
            name: 'Les bords',
            body: 'Chaque bloc est accroché à un bord. Tirer sur un côté rapproche ce qui y pend et éloigne tout le reste : c’est ce qui rend un gouffre franchissable.',
        },
        appear: {
            name: 'Apparitions',
            body: 'Certains blocs n’existent qu’au-dessus, ou qu’en dessous, d’une certaine taille de fenêtre. Rien ne les annonce — on les découvre en tirant sur un bord.',
        },
        motion: {
            name: 'Mouvement',
            body: 'Des plateformes qui vont et viennent, des lames qui tombent du plafond. Attendre le bon moment est une action à part entière. Si votre système demande à réduire les animations, ces mouvements sont ralentis de moitié.',
        },
        theme: {
            name: 'Le thème',
            body: 'Des blocs qui n’existent que dans le thème clair, d’autres que dans le sombre. La bascule de thème, dans la barre du jeu ou la touche T, devient une commande au même titre que le saut.',
        },
        rewind: {
            name: 'Le rembobinage',
            body: 'Le temps revient en arrière de six secondes. Sur ces énigmes, le bouton Précédent du navigateur rembobine au lieu de quitter la page.',
        },
        orbs: {
            name: 'Les orbes',
            body: 'La sortie reste fermée tant qu’il en reste une à ramasser : le niveau se parcourt dans les deux sens.',
        },
        crush: {
            name: 'L’écrasement',
            body: 'Deux murs qui se rejoignent, et il n’y a plus de place pour vous. Rétrécir la fenêtre peut tuer.',
        },
        ice: {
            name: 'La glace',
            body: 'Un palier sans frottement : on y garde son élan, et freiner demande autant de place que démarrer.',
        },
        bounce: {
            name: 'Le rebond',
            body: 'Un palier élastique renvoie plus haut qu\'un saut. C\'est la seule façon d\'atteindre certains paliers — et de retomber sur des pointes.',
        },
        conveyor: {
            name: 'Le tapis',
            body: 'Un palier qui vous déplace tant que vous êtes dessus. Y rester immobile demande de marcher.',
        },
        blink: {
            name: 'Le clignotement',
            body: 'Des blocs qui n\'existent qu\'une partie du temps. Le sol sous vos pieds disparaît à intervalle fixe.',
        },
        chase: {
            name: 'La lame qui suit',
            body: 'Une lame accrochée au plafond qui se cale sur votre position horizontale. On ne la sème pas : on passe dessous au bon moment.',
        },
        wind: {
            name: 'Le vent',
            body: 'Une zone qui pousse en permanence. Elle change la portée de chaque saut qui la traverse, dans un sens ou dans l\'autre.',
        },
        crumble: {
            name: 'Les paliers friables',
            body: 'Ils cèdent moins d\'une demi-seconde après qu\'on s\'y est posé. Ils se traversent, ils ne se reposent pas.',
        },
        gravity: {
            name: 'La gravité',
            body: 'L’écran pivote par quarts de tour, et la chute suit. Un même niveau lu de côté n’est plus le même : les plateformes deviennent des murs, et le sol un plafond.',
        },
        screen: {
            name: 'L’écran intérieur',
            body: 'L’aire de jeu est un écran que vous réglez vous-même : ses poignées la redimensionnent, sa rotation change le sens de la chute. La fenêtre du navigateur en reste la limite.',
        },
    },
    puzzles: {
        seuil: {
            name: 'Le seuil',
            brief:
                'Rien à franchir : seulement comprendre que la sortie est accrochée au bord droit de la fenêtre, et qu’elle bouge avec lui.',
        },
        marche: {
            name: 'La marche',
            brief:
                'Une plateforme, un saut. De quoi apprendre que le sol est le bas de votre fenêtre, et rien d’autre.',
        },
        enjambee: {
            name: 'L’enjambée',
            brief:
                'Deux bandes de pointes à même le sol. La course d’élan y compte autant que le saut.',
        },
        corniche: {
            name: 'La corniche',
            brief:
                'Quatre paliers qui montent vers la droite. La première fois qu’on prend de la hauteur.',
        },
        descente: {
            name: 'La descente',
            brief:
                'Le chemin descend au lieu de monter : tomber devient une façon d’avancer.',
        },
        bordure: {
            name: 'La bordure',
            brief:
                'L’arrivée est ancrée à droite, le départ à gauche : l’écart entre les deux vaut la largeur de votre fenêtre.',
        },
        suspendu: {
            name: 'Le suspendu',
            brief:
                'Le chemin pend du plafond : il ne devient praticable qu’une fois l’écran retourné.',
        },
        lucarne: {
            name: 'La lucarne',
            brief:
                'Un pont manque au milieu. Il existe pourtant — mais seulement en dessous d’une certaine largeur.',
        },
        balancier: {
            name: 'Le balancier',
            brief:
                'Une plateforme qui monte et descend. Attendre y devient une action.',
        },
        navette: {
            name: 'La navette',
            brief:
                'La même idée à l’horizontale : une plateforme qui va et vient d’un bout à l’autre de son couloir.',
        },
        clairiere: {
            name: 'La clairière',
            brief:
                'Le chemin n’existe qu’en thème clair : en sombre, il n’y a ni plateforme ni sortie. La touche T est ici une commande de jeu.',
        },
        nocturne: {
            name: 'Nocturne',
            brief:
                'L’inverse, et en pire : en thème clair, les plateformes deviennent des pointes.',
        },
        collecte: {
            name: 'La collecte',
            brief:
                'Deux orbes à ramasser avant que la sortie ne consente à s’ouvrir.',
        },
        detour: {
            name: 'Le détour',
            brief:
                'Les orbes sont au bout du chemin, la sortie au point de départ. Il faut revenir sur ses pas.',
        },
        ecart: {
            name: 'L’écart',
            brief:
                'Les paliers alternent entre le bord gauche et le bord droit : la fenêtre les écarte deux par deux.',
        },
        rebord: {
            name: 'Le rebord',
            brief:
                'Quatre paliers de moins de cent pixels. La précision y remplace la portée.',
        },
        couloir: {
            name: 'Le couloir',
            brief:
                'Deux murets posés sur le sol, et un chemin qui passe juste au-dessus.',
        },
        vide: {
            name: 'Le vide',
            brief:
                'Première énigme sans sol : tomber ne coûte plus une bande de pointes, mais la tentative.',
        },
        pendule: {
            name: 'Le pendule',
            brief:
                'Deux plateformes mobiles au-dessus du vide, désynchronisées exprès.',
        },
        entonnoir: {
            name: 'L’entonnoir',
            brief:
                'Deux routes s’excluent : l’une au-dessus de 860 pixels de large, l’autre en dessous.',
        },
        etau: {
            name: 'L’étau',
            brief:
                'Deux murs, l’un ancré à gauche, l’autre à droite. Rétrécir les fait se rejoindre — sur vous.',
        },
        escalier: {
            name: 'L’escalier',
            brief:
                'Quatre paliers, et deux lames qui balaient l’escalier à contretemps.',
        },
        traverse: {
            name: 'La traverse',
            brief:
                'Presque tout est ancré au bord droit, au-dessus du vide. La fenêtre est le seul levier qui reste.',
        },
        alternance: {
            name: 'L’alternance',
            brief:
                'Une plateforme claire, une sombre, en alternance : il faut basculer le thème en pleine traversée.',
        },
        guillotine: {
            name: 'La guillotine',
            brief:
                'Trois lames tombent du plafond, chacune sur son propre tempo.',
        },
        serpentin: {
            name: 'Le serpentin',
            brief:
                'Le chemin fait deux demi-tours en montant. On repasse au-dessus de là où l’on était.',
        },
        bascule: {
            name: 'La bascule',
            brief:
                'Deux plateformes qui montent et descendent en opposition, au-dessus du vide.',
        },
        jachere: {
            name: 'La jachère',
            brief:
                'Un chemin qui n’existe qu’en clair — et une lame qui n’existe qu’en clair elle aussi.',
        },
        cordee: {
            name: 'La cordée',
            brief:
                'Trois orbes le long d’une montée continue. Aucune ne se ramasse en passant.',
        },
        grenier: {
            name: 'Le grenier',
            brief:
                'Tout est à l’envers, la sortie comprise. Retourner l’écran est la seule façon d’y poser un pied.',
        },
        passerelle: {
            name: 'La passerelle',
            brief:
                'La travée du milieu n’apparaît qu’en dessous de 800 pixels de large.',
        },
        tourniquet: {
            name: 'Le tourniquet',
            brief:
                'Les paliers alternent de bord et d’accroche verticale. Chaque côté tiré déplace la moitié du niveau.',
        },
        cascade: {
            name: 'La cascade',
            brief:
                'Une longue descente, dont un palier se dérobe latéralement au mauvais moment.',
        },
        sablier: {
            name: 'Le sablier',
            brief:
                'Un mur barre la route au-dessus de 780 pixels ; le passage ne s’ouvre qu’en dessous.',
        },
        relais: {
            name: 'Le relais',
            brief:
                'Deux orbes portées par des plateformes mobiles, au-dessus du vide.',
        },
        faille: {
            name: 'La faille',
            brief:
                'Trois écarts de cent dix pixels, à la limite exacte de la portée d’un saut.',
        },
        vertige: {
            name: 'Le vertige',
            brief:
                'Aucun sol, quatre plateformes mobiles, et un dernier palier collé au bord droit.',
        },
        dedale: {
            name: 'Le dédale',
            brief:
                'Le niveau a deux visages selon la largeur, et la sortie n’est pas au même endroit dans les deux.',
        },
        funambule: {
            name: 'Le funambule',
            brief:
                'Des paliers de soixante-dix pixels au-dessus du vide, et deux orbes à ne pas manquer.',
        },
        contrepoids: {
            name: 'Le contrepoids',
            brief:
                'Un chemin bâti tête en bas. Le lire à l’endroit ne mène nulle part.',
        },
        retour: {
            name: 'Le retour',
            brief:
                'Cinq sauts mobiles d’affilée, sans sol. Le rembobinage n’y est pas une aide : c’est la règle.',
        },
        metronome: {
            name: 'Le métronome',
            brief:
                'Trois lames à un tiers de temps d’écart. Le rythme est la seule solution.',
        },
        eclipse: {
            name: 'L’éclipse',
            brief:
                'Le chemin alterne les thèmes au-dessus du vide : basculer trop tard revient à sauter dans le néant.',
        },
        tenaille: {
            name: 'La tenaille',
            brief:
                'Un passage qui n’existe qu’en dessous de 900 pixels, entre deux murs qui se referment.',
        },
        verticale: {
            name: 'La verticale',
            brief:
                'Un puits couché : il faut faire pivoter l’écran d’un quart de tour pour que ses paliers deviennent un sol.',
        },
        gouffre: {
            name: 'Le gouffre',
            brief:
                'Quatre écarts de quatre-vingt-dix pixels, tous portés par des plateformes qui respirent.',
        },
        spirale: {
            name: 'La spirale',
            brief:
                'Le chemin s’enroule : bord gauche, bord droit, haut, bas, et retour.',
        },
        veilleuse: {
            name: 'La veilleuse',
            brief:
                'Un chemin qui n’existe qu’en sombre, dont une travée n’existe qu’en fenêtre étroite.',
        },
        horloge: {
            name: 'L’horloge',
            brief:
                'Trois plateformes de même période, décalées d’un tiers. Il faut entrer dans la mesure.',
        },
        cordon: {
            name: 'Le cordon',
            brief:
                'Trois orbes aux quatre coins de la fenêtre, et la sortie revenue au point de départ.',
        },
        abime: {
            name: 'L’abîme',
            brief:
                'Deux travées conditionnelles au-dessus du vide : réduire la fenêtre, ou tomber.',
        },
        charniere: {
            name: 'La charnière',
            brief:
                'Au-dessus de 760 pixels, deux murs ferment tout. En dessous, le chemin apparaît.',
        },
        souffle: {
            name: 'Le dernier souffle',
            brief:
                'Cinq paliers mobiles, deux orbes, aucun sol, et la sortie contre le bord droit.',
        },
        epilogue: {
            name: 'L’épilogue',
            brief:
                'Tout à la fois — les bords, le thème, le mouvement, les orbes et le vide.',
        },
        verglas: {
            name: 'Le verglas',
            brief:
                'Quatre paliers de glace au-dessus du vide. Freiner y demande autant de place que s’élancer, et il n’y en a pas.',
        },
        patinoire: {
            name: 'La patinoire',
            brief:
                'De larges paliers de glace, et des pointes qui attendent en bas. L’élan se garde bien après qu’on a lâché la touche.',
        },
        banquise: {
            name: 'La banquise',
            brief:
                'Un serpentin entièrement gelé, avec un demi-tour à mi-hauteur. C’est le demi-tour, le problème.',
        },
        derapage: {
            name: 'Le dérapage',
            brief:
                'Un tapis qui pousse à contresens, un palier de glace, puis un tapis qui pousse dans l’autre sens. Rien ne tient en place, vous compris.',
        },
        tremplin: {
            name: 'Le tremplin',
            brief:
                'Un palier élastique renvoie deux fois plus haut qu’un saut. C’est la seule façon d’atteindre le suivant.',
        },
        catapulte: {
            name: 'La catapulte',
            brief:
                'Le même rebond, mais l’arrivée oscille. Il faut partir au bon moment, pas au moment où l’on est prêt.',
        },
        ressac: {
            name: 'Le ressac',
            brief:
                'Un rebond, puis une rafale en plein vol. La portée de votre saut n’est plus celle que vous connaissez.',
        },
        soufflerie: {
            name: 'La soufflerie',
            brief:
                'Trois écarts qu’aucun saut ne franchit. Seul le vent les traverse, et il ne souffle pas partout.',
        },
        bourrasque: {
            name: 'La bourrasque',
            brief:
                'Deux rafales encadrant une plateforme mobile. Le vent vous porte, l’oscillation vous reprend.',
        },
        alize: {
            name: 'L’alizé',
            brief:
                'Le vent souffle à contresens, au-dessus de la glace. Il suffit à vous renvoyer dans le vide que vous venez de franchir.',
        },
        tapis: {
            name: 'Le tapis',
            brief:
                'Deux tapis roulants en sens contraires. Y rester immobile demande de marcher.',
        },
        contresens: {
            name: 'Le contresens',
            brief:
                'Deux tapis qui poussent tous les deux vers l’arrière, au-dessus du vide. On avance en reculant moins vite.',
        },
        laminoir: {
            name: 'Le laminoir',
            brief:
                'Deux tapis, deux murs qui se rejoignent quand la fenêtre rétrécit, et des pointes entre les deux.',
        },
        stroboscope: {
            name: 'Le stroboscope',
            brief:
                'Deux paliers qui clignotent en opposition. Il n’y a jamais les deux à la fois.',
        },
        intermittence: {
            name: 'L’intermittence',
            brief:
                'Le sol revient à intervalle fixe — mais pas au même intervalle des deux côtés.',
        },
        battement: {
            name: 'Le battement',
            brief:
                'Un palier qui clignote, un qui oscille, un qui clignote à contretemps. Trois horloges, aucune accordée.',
        },
        cendres: {
            name: 'Les cendres',
            brief:
                'Trois paliers qui cèdent moins d’une demi-seconde après qu’on s’y pose. On ne s’arrête plus.',
        },
        effondrement: {
            name: 'L’effondrement',
            brief:
                'Des paliers friables séparés par une plateforme mobile. Attendre est fatal, ne pas attendre aussi.',
        },
        poussiere: {
            name: 'La poussière',
            brief:
                'Deux orbes posées sur ce qui va tomber. Il faut y revenir, et il n’y aura plus rien.',
        },
        damocles: {
            name: 'Damoclès',
            brief:
                'Une lame accrochée au plafond se cale sur votre position, et retombe toutes les deux secondes et demie.',
        },
        traque: {
            name: 'La traque',
            brief:
                'La lame vous suit, et le sol cède derrière vous. On ne peut ni s’arrêter ni revenir.',
        },
        ombre: {
            name: 'L’ombre',
            brief:
                'Le chemin n’existe qu’en thème sombre, et la lame vous suit dans le noir.',
        },
        frimas: {
            name: 'Les frimas',
            brief:
                'De la glace, dont un palier mobile. On y arrive vite, on en repart trop vite.',
        },
        avalanche: {
            name: 'L’avalanche',
            brief:
                'Des paliers de glace qui cèdent. Freiner prend plus de temps qu’ils n’en accordent.',
        },
        congere: {
            name: 'La congère',
            brief:
                'Un palier de glace n’apparaît qu’en fenêtre étroite. Sans lui, le vide fait quatre-vingts pixels de trop.',
        },
        trebuchet: {
            name: 'Le trébuchet',
            brief:
                'Un rebond envoie droit dans un plafond de pointes. Il faut s’écarter en plein vol.',
        },
        mortier: {
            name: 'Le mortier',
            brief:
                'Deux orbes, dont une tout en haut. Seul le rebond y mène, et la sortie est en bas.',
        },
        rafale: {
            name: 'La rafale',
            brief:
                'Le vent porte au-dessus de deux écarts — mais l’un des deux paliers d’arrivée clignote.',
        },
        tourmente: {
            name: 'La tourmente',
            brief:
                'Une rafale, une lame qui vous suit, et un écart qu’aucun saut ne franchit.',
        },
        sirocco: {
            name: 'Le sirocco',
            brief:
                'Le vent porte, les paliers cèdent. Le second ne tient pas le temps de reprendre son élan.',
        },
        engrenage: {
            name: 'L’engrenage',
            brief:
                'Un tapis à contresens suivi d’un palier friable. L’élan qu’on n’a pas, on ne l’aura pas.',
        },
        moulin: {
            name: 'Le moulin',
            brief:
                'Deux tapis contraires, et une plateforme qui va et vient entre les deux.',
        },
        pilon: {
            name: 'Le pilon',
            brief:
                'Deux tapis, deux lames tombant à contretemps. C’est le tapis qui décide où vous êtes quand elles tombent.',
        },
        eclair: {
            name: 'L’éclair',
            brief:
                'Un clignotement deux fois plus rapide que d’ordinaire, et un palier sur deux seulement.',
        },
        syncope: {
            name: 'La syncope',
            brief:
                'Un tapis qui vous ramène en arrière, vers un palier qui n’est pas toujours là.',
        },
        arythmie: {
            name: 'L’arythmie',
            brief:
                'Trois paliers, trois périodes différentes, aucune qui retombe sur les autres.',
        },
        dislocation: {
            name: 'La dislocation',
            brief:
                'Un palier friable, un clignotant, un friable. Deux façons de disparaître, alternées.',
        },
        erosion: {
            name: 'L’érosion',
            brief:
                'De la glace, puis du friable, puis de la glace. On arrive trop vite sur ce qui ne tiendra pas.',
        },
        guet: {
            name: 'Le guet',
            brief:
                'La lame vous suit au-dessus de deux paliers clignotants. Attendre le sol, c’est attendre la lame.',
        },
        embuscade: {
            name: 'L’embuscade',
            brief:
                'Un palier n’existe qu’en fenêtre étroite, et la lame ne vous lâche pas pendant que vous cherchez.',
        },
        curee: {
            name: 'La curée',
            brief:
                'Deux orbes à ramasser avec une lame au-dessus de la tête. Le détour se paie.',
        },
        verrou: {
            name: 'Le verrou',
            brief:
                'De la glace entre deux murs qui se rejoignent. On y freine mal, et le passage se ferme.',
        },
        garrot: {
            name: 'Le garrot',
            brief:
                'Un tapis qui pousse vers le mur qui se referme. Rétrécir tue plus vite qu’ailleurs.',
        },
        'chausse-trappe': {
            name: 'La chausse-trappe',
            brief:
                'Le palier du milieu n’apparaît qu’en fenêtre étroite — et il cède comme les autres.',
        },
        apnee: {
            name: 'L’apnée',
            brief:
                'Cinq paliers d’affilée sans un endroit où souffler : glace, friable, clignotant, friable, et deux orbes.',
        },
        terminus: {
            name: 'Le terminus',
            brief:
                'Tout à la fois, et à l’envers : rebond, palier friable, rafale, lame qui suit — une fois l’écran retourné.',
        },
    },
    puzzlesPage: {
        title: 'Les énigmes',
        heading: 'Cent énigmes écrites à la main',
        lede: 'De la première marche aux enchaînements qui demandent de redimensionner en plein vol.',
        metaDescription:
            'Les 100 énigmes de Reflow, classées par difficulté. Chacune met en jeu une mécanique du navigateur : les bords de la fenêtre, les apparitions, le thème, le mouvement, le rembobinage.',
        done: '{done} sur {total} terminées',
        play: 'Jouer',
        statusDone: 'Terminée',
        statusNew: 'Jamais jouée',
        bestTime: 'Meilleur temps : {time} s',
        mechanicsLabel: 'Mécaniques',
        endlessTitle: 'Et après ?',
        endlessBody:
            'Quand les cent sont tombées, les parties infinies prennent le relais : engendrées à partir d’une graine, jamais deux fois les mêmes.',
        endlessCta: 'Passer aux parties infinies',
    },
    puzzlePage: {
        play: 'Jouer cette énigme',
        previewHeading: 'Aperçu',
        previewAlt: 'Aperçu du niveau {name}',
        previewNote:
            'Dessiné par le moteur du jeu, à la taille pour laquelle l’énigme a été conçue. En pointillés : les paliers friables, et ce qui n’existe que dans l’autre thème ou qu’à une autre taille de fenêtre.',
        briefHeading: 'Ce qu’il y a à comprendre',
        mechanicsHeading: 'Mécaniques mises en jeu',
        tierHeading: 'Difficulté',
        statsHeading: 'Votre passage',
        statusDone: 'Terminée en {time} s',
        statusNew: 'Pas encore terminée',
        previous: 'Énigme précédente',
        next: 'Énigme suivante',
        backToCatalogue: 'Toutes les énigmes',
        metaTitle: '{name} — énigme {tier} de Reflow',
        metaDescription: '{brief} Une énigme {tier} de Reflow, le jeu de plateforme dont le niveau est la fenêtre du navigateur.',
        breadcrumb: 'Énigmes',
    },
    endless: {
        title: 'Parties infinies',
        heading: 'Des parties engendrées, jamais deux fois les mêmes',
        lede: 'Chaque partie naît d’une graine. La difficulté monte avec la série, et une graine tient dans un lien.',
        metaDescription:
            'Le mode infini de Reflow : des niveaux engendrés à partir d’une graine, tous différents, de plus en plus durs. Aucun compte, et chaque partie se partage par un lien.',
        start: 'Lancer une partie',
        again: 'Une autre partie',
        seedLabel: 'Graine',
        seedHelp: 'Deux joueurs qui entrent la même graine reçoivent exactement le même niveau.',
        seedPlaceholder: 'un mot, un nombre…',
        seedApply: 'Jouer cette graine',
        depth: 'Palier {depth}',
        record: 'Meilleure série : {depth}',
        recordEmpty: 'Aucune série pour l’instant.',
        shareRun: 'Copier le lien de cette partie',
        sections: [
            {
                title: 'Ce que la graine décide',
                body: 'La graine fixe tout : le nombre de plateformes, leur largeur, leur écartement, le bord auquel chacune est accrochée, la présence de lames et d’orbes. À graine égale, deux joueurs à l’autre bout du monde reçoivent le même niveau, au pixel près, sans qu’aucun serveur n’ait à le leur envoyer.',
            },
            {
                title: 'Pourquoi une partie engendrée est toujours finissable',
                body: 'Le générateur ne tire pas des plateformes au hasard en espérant que ça passe : il construit le chemin. Chaque plateforme est posée à portée de saut de la précédente, hauteur et distance calculées à partir de la trajectoire réelle du personnage. La partie est donc terminable par construction, à la cote de référence affichée en haut de l’écran.',
            },
        ],
    },
    rules: {
        title: 'Règles',
        heading: 'Comment on joue',
        lede: 'Les flèches pour se déplacer, l’espace pour sauter, et la fenêtre pour tout le reste.',
        metaDescription:
            'Les règles de Reflow : déplacer le personnage, sauter, rembobiner, et surtout redimensionner la fenêtre du navigateur pour déplacer le décor lui-même.',
        steps: [
            {
                title: 'Se déplacer et sauter',
                body: 'Les flèches gauche et droite, ou Q et D. L’espace, la flèche du haut ou W pour sauter. Relâcher tôt donne un saut court : c’est la seule touche qui a deux hauteurs.',
            },
            {
                title: 'La fenêtre est le décor',
                body: 'Chaque plateforme est accrochée à un bord de la fenêtre. Tirer sur le coin de votre navigateur ne change pas l’échelle du jeu : ça déplace les plateformes les unes par rapport aux autres. C’est la commande la plus puissante du jeu, et elle n’est sur aucune touche.',
            },
            {
                title: 'Le zoom compte aussi',
                body: 'Ctrl et + réduisent l’aire de jeu en pixels CSS, Ctrl et − l’agrandissent. C’est une seconde façon de redimensionner, utile quand la fenêtre est déjà au maximum de l’écran.',
            },
            {
                title: 'Mourir ne coûte rien',
                body: 'Une pointe, une chute dans le vide ou un écrasement entre deux murs relancent la tentative sur-le-champ. R rembobine six secondes, et sur certaines énigmes le bouton Précédent du navigateur fait la même chose.',
            },
            {
                title: 'Les orbes ferment la sortie',
                body: 'Quand un niveau porte des orbes, la sortie reste close tant qu’il en reste une. Il faut alors traverser, ramasser, et revenir.',
            },
            {
                title: 'Rien n’est enregistré ailleurs que chez vous',
                body: 'Votre progression et vos meilleurs temps vivent dans le stockage local de votre navigateur. Aucun compte, aucun envoi, et vider ce stockage remet tout à zéro.',
            },
            {
                title: 'Un indice si tu bloques',
                body: 'Au bout d’un moment, ou de quelques morts, un bouton « Indice » s’allume dans la barre du jeu. Trois échelons, du plus vague au plus concret — et aucun ne donne la solution : ils nomment la mécanique en jeu et le geste à essayer, jamais où sauter ni à quelle taille.',
            },
        ],
        back: 'Jouer',
    },
    mechanicsPage: {
        browserHeading: 'Ce qui vient du navigateur',
        rulesHeading: 'Et les règles du jeu lui-même',
        title: 'Mécaniques',
        heading: 'Ce que Reflow détourne du navigateur',
        lede: 'Toutes prises à des interfaces que le navigateur expose déjà — et qu’aucun jeu n’utilise.',
        metaDescription:
            'Les mécaniques de Reflow, et ce qu’elles empruntent au navigateur : la taille de la fenêtre, les bords, le thème clair ou sombre, le zoom, l’historique de navigation.',
        intro: 'Un jeu de plateforme classique dessine son décor dans un canevas et se moque de la fenêtre qui l’entoure. Reflow fait le contraire : il n’a pas de décor à lui. Sa géométrie est une fonction de la taille de votre fenêtre, et tout ce que le navigateur laisse mesurer devient une commande.',
        outro: 'Une septième mécanique existe sur le papier — un même personnage traversant deux fenêtres côte à côte, synchronisées sans serveur. Elle attend une version suivante : elle dépend d’un bloqueur de fenêtres surgissantes, et une mécanique qui ne marche que chez la moitié des joueurs n’en est pas une.',
        back: 'Jouer',
    },
    about: {
        title: 'À propos',
        heading: 'À propos de Reflow',
        lede: 'Un jeu de plateforme sans compte, sans publicité et sans serveur de jeu.',
        metaDescription:
            'Reflow, jeu de plateforme gratuit joué avec la fenêtre du navigateur. Comment il est fait, ce qui n’est pas collecté, et qui est derrière le site.',
        sections: [
            {
                title: 'Comment c’est fait',
                body: 'Le site est entièrement statique : du HTML écrit une fois pour toutes, servi par nginx. Le moteur physique tourne dans votre navigateur, à pas fixe, et les niveaux engendrés naissent d’une graine plutôt que d’un serveur. Il n’y a donc rien à sauvegarder, rien qui puisse tomber en panne, et le jeu marche aussi bien hors ligne une fois la page chargée.',
            },
            {
                title: 'Les niveaux sont vérifiés par une machine',
                body: 'Une énigme injouable ne se voit pas à la lecture : rien ne plante, elle est simplement impossible. Chaque niveau est donc rejoué par un programme qui cherche une suite d’actions menant à la sortie, avec le moteur du jeu et ses vraies constantes. Aucun niveau n’est publié sans cette preuve.',
            },
            {
                title: 'Ce qui n’est pas collecté',
                body: 'Aucun compte, aucune publicité, aucun traqueur tiers. Votre progression est conservée dans votre navigateur et n’est jamais envoyée nulle part. La mesure d’audience est un Matomo auto-hébergé, configuré sans cookie.',
            },
            {
                title: 'Qui l’a fait',
                body: '{author}, développeur. Reflow rejoint Azimut, Push Your Luck et Loups-Garous, réunis sur un panneau commun.',
            },
        ],
        clearTitle: 'Effacer votre progression',
        clearBody:
            'Vos énigmes terminées, vos meilleurs temps, vos indices débloqués et votre meilleure série vivent dans ce navigateur, et nulle part ailleurs. Ce bouton les supprime, et c’est sans retour.',
        clearButton: 'Tout effacer',
        cleared: 'Effacé',
        contactTitle: 'Écrire',
        contactBody: 'Une énigme impossible, une traduction bancale, une idée :',
        back: 'Jouer',
    },
    legal: {
        title: 'Mentions légales',
        heading: 'Mentions légales',
        lede: 'Les informations exigées par la loi pour un site accessible au public.',
        metaDescription:
            'Éditeur, hébergeur et conditions d’utilisation de reflow.leoderoin.fr, le jeu de plateforme dont le niveau est la fenêtre du navigateur.',
        sections: [
            {
                title: 'Éditeur',
                body: 'Le site reflow.leoderoin.fr est édité par {author}, à titre personnel et non commercial. Le directeur de la publication est l’éditeur lui-même.',
            },
            {
                title: 'Hébergeur',
                body: 'Le site est hébergé par {host}, {address}. Téléphone : {phone}. SIREN {registration}.',
            },
            {
                title: 'Contenu',
                body: 'Les textes, les niveaux, le moteur et les illustrations de ce site sont l’œuvre de son éditeur. Le code source est publié sous licence MIT. Les polices Space Grotesk et JetBrains Mono sont distribuées sous licence SIL Open Font.',
            },
            {
                title: 'Liens sortants',
                body: 'Ce site ne renvoie que vers jeux.leoderoin.fr, le site personnel de son auteur et le dépôt public du code. Il n’affiche aucune publicité et ne comporte aucun lien commercial ni affilié.',
            },
        ],
        contactTitle: 'Contact',
        contactBody: 'Pour toute question relative à ces mentions :',
        back: 'Jouer',
    },
    privacy: {
        title: 'Confidentialité',
        heading: 'Confidentialité',
        lede: 'Ce qui est mesuré, ce qui ne l’est pas, et où ça reste.',
        metaDescription:
            'Ce qui est mesuré sur Reflow, ce qui ne l’est pas, et ce qui reste dans votre navigateur. Aucun compte, aucun traqueur tiers, aucun cookie de mesure.',
        sections: [
            {
                title: 'Votre progression',
                body: 'Les énigmes terminées, vos meilleurs temps, les indices débloqués et votre meilleure série en mode infini sont conservés dans le stockage local de votre navigateur. Ils ne sont JAMAIS envoyés à un serveur : il n’y en a pas. Vous pouvez tout effacer d’un bouton, depuis la page « à propos ».',
            },
            {
                title: 'Le jeu lui-même',
                body: 'Le moteur physique et la génération des niveaux s’exécutent entièrement dans votre navigateur. Une partie engendrée naît d’une graine calculée sur votre machine, et rien de ce que vous jouez n’est transmis nulle part.',
            },
            {
                title: 'Mesure d’audience',
                body: 'Le site utilise Matomo, installé sur le même serveur que lui. Sont enregistrés les pages consultées, la langue du navigateur, le type d’appareil et la page de provenance. Aucune donnée n’est transmise à un service tiers, et il n’y a ni régie publicitaire ni réseau social embarqué.',
            },
            {
                title: 'Cookies',
                body: 'Aucun. Matomo est configuré sans cookie, ce qui dispense ce site de bandeau de consentement. Votre choix de thème est conservé dans le stockage local, jamais envoyé au serveur.',
            },
            {
                title: 'Journaux du serveur',
                body: 'Comme tout serveur web, celui-ci conserve des journaux d’accès techniques : adresse IP, date, page demandée. Ils servent au diagnostic et à la sécurité, et ne sont exploités à aucune autre fin.',
            },
            {
                title: 'Vos droits',
                body: 'Vous pouvez demander l’accès aux données vous concernant, leur rectification ou leur effacement. La demande se fait par courriel et n’a pas besoin d’être motivée.',
            },
        ],
        contactTitle: 'Écrire',
        contactBody: 'Pour exercer vos droits ou poser une question :',
        back: 'Jouer',
    },
    footer: {
        madeBy: 'Créé par {author}',
        source: 'Code source',
        otherGames: 'Mes autres jeux',
        versionLabel: 'Version {version}',
    },
    notFound: {
        title: 'Page introuvable',
        body: 'Cette adresse ne correspond à rien sur ce site.',
        back: 'Retour au jeu',
    },
} as const;

// `as const` fige chaque chaîne en type littéral : sans élargissement, aucune
// traduction ne serait assignable. Widen ne conserve donc que la FORME.
type Widen<T> = T extends string
    ? string
    : T extends readonly (infer Item)[]
      ? readonly Widen<Item>[]
      : { [Key in keyof T]: Widen<T[Key]> };

export type Dictionary = Widen<typeof fr>;
