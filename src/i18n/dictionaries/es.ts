import type { Dictionary } from './fr';

export const es: Dictionary = {
    meta: {
        title: 'Reflow',
        titleTag: 'Reflow — el juego de plataformas cuyo nivel es tu ventana',
        description:
            'Un juego de plataformas donde el escenario es la ventana del navegador. Redimensiónala para mover las plataformas, cambia de tema para hacer aparecer otras. 100 enigmas y partidas infinitas, sin cuenta.',
        ogAlt: 'Reflow — un juego de plataformas jugado con la ventana del navegador',
        keywords:
            'juego de plataformas navegador, juego redimensionar ventana, juego web original, enigmas navegador, juego gratis sin cuenta, puzzle platformer',
        shortName: 'Reflow',
    },
    header: {
        skipToContent: 'Ir al contenido',
        brand: 'Reflow',
        tagline: 'el nivel es tu ventana',
        navLabel: 'Navegación',
        navPuzzles: 'Enigmas',
        navEndless: 'Infinito',
        navMechanics: 'Mecánicas',
        navRules: 'Reglas',
        navAbout: 'Acerca de',
        languageLabel: 'Idioma',
        themeLabel: 'Tema',
        themeToggle: 'Tema: {mode}',
        themeSystem: 'Sistema',
        themeLight: 'Claro',
        themeDark: 'Oscuro',
    },
    home: {
        kicker: 'Plataformas',
        title: 'El nivel es tu ventana',
        lede: 'Cada plataforma está anclada a un borde de la ventana. Encógela y vendrán hacia ti. Agrándala y el abismo se abre.',
        play: 'Jugar',
        playFirst: 'Empezar por el primer enigma',
        resume: 'Continuar',
        browse: 'Ver los 100 enigmas',
        endless: 'Partidas infinitas',
        progress: '{done} enigmas resueltos de {total}',
        sections: [
            {
                title: 'Un escenario que ningún otro juego usa',
                body: 'En Reflow ninguna plataforma tiene posición absoluta. Cada una está anclada a un borde de la ventana: el ancho y el alto de tu navegador entran en el cálculo de su sitio, fotograma tras fotograma. Arrastrar una esquina no redimensiona una vista del juego: mueve el escenario, abre pasos, cierra otros, y puede aplastarte contra un muro.',
            },
            {
                title: 'Mecánicas tomadas del navegador',
                body: 'Redimensionar es solo la primera. Hay bloques que solo existen por debajo de cierto ancho. Otros solo existen en el tema claro, o solo en el oscuro: el selector de tema se convierte en un mando del juego. El zoom del navegador cambia el tamaño del área de juego, el botón Atrás rebobina el tiempo, y una ventana demasiado estrecha mata.',
            },
            {
                title: 'Cien enigmas, y luego el infinito',
                body: 'Los cien enigmas escritos a mano van desde el primer salto hasta secuencias que exigen redimensionar en pleno vuelo. Una vez resueltos, el modo infinito toma el relevo: cada partida se genera a partir de una semilla, ninguna se repite, y la dificultad sube con la racha. Una semilla cabe en un enlace: la partida que acabas de jugar se transmite tal cual.',
            },
            {
                title: 'Sin cuenta y sin publicidad',
                body: 'Reflow funciona enteramente en tu navegador. No hay servidor de juego, ni cuenta que crear, ni publicidad, ni rastreadores de terceros. Tu progreso se queda en tu navegador y no se envía a ninguna parte.',
            },
        ],
        rulesLink: 'Leer las reglas',
        mechanicsLink: 'Las mecánicas en detalle',
    },
    game: {
        title: 'Área de juego',
        close: 'Salir',
        restart: 'Reiniciar',
        rewind: 'Rebobinar',
        pause: 'Pausa',
        resume: 'Continuar',
        attempts: 'Intento {count}',
        elapsed: 'Tiempo',
        orbs: 'Orbes',
        size: 'Ventana',
        won: 'Superado',
        wonIn: 'Superado en {time} s, {count} intentos',
        wonInOne: 'Superado en {time} s, al primer intento',
        deadSpike: 'Tocado',
        deadFall: 'Caído',
        deadCrush: 'Aplastado por la ventana',
        retry: 'Reintentar',
        next: 'Enigma siguiente',
        nextRun: 'Partida siguiente',
        backToCatalogue: 'Volver al catálogo',
        share: 'Copiar el enlace de la partida',
        copied: 'Enlace copiado',
        hintResize: 'Redimensiona la ventana.',
        controlsTitle: 'Controles',
        controlMove: 'Moverse',
        controlJump: 'Saltar',
        controlRewind: 'Rebobinar',
        controlRestart: 'Reiniciar',
        controlQuit: 'Salir',
        rewindArmed: 'El botón Atrás del navegador rebobina este enigma.',
        tooSmall: 'Ventana demasiado pequeña',
        tooSmallBody:
            'El área de juego baja de {w} × {h} píxeles: ya no cabe un nivel. Agranda la ventana.',
        touchTitle: 'Hace falta un teclado',
        touchBody:
            'Reflow se juega con teclado y con una ventana redimensionable. Un teléfono no tiene ni lo uno ni lo otro: el juego te espera en un ordenador.',
        touchAnyway: 'Probar de todos modos',
    },
    tiers: {
        easy: 'Fácil',
        medium: 'Media',
        hard: 'Difícil',
        easyPlural: 'Fáciles',
        mediumPlural: 'Medias',
        impossible: 'Imposible',
        impossiblePlural: 'Imposibles',
        hardPlural: 'Difíciles',
    },
    hints: {
        button: 'Pista',
        available: 'Hay una pista disponible',
        heading: 'Pista {n} de {total}',
        close: 'Cerrar',
        more: 'Una pista más',
        step1: 'Este enigma pone en juego:',
        step2: 'Lo que eso significa:',
        step3: 'Lo que hay que probar:',
        promise:
            'Ninguna de estas pistas da la solución: el enigma sigue entero.',
        gestures: {
            resize:
                'La ventana es la única palanca. Acércala a la cota que aparece arriba a la derecha.',
            edge:
                'No todos los rellanos están anclados al mismo borde. Tira de un lado y mira cuáles se mueven.',
            appear:
                'Falta un trozo del camino. Encoge la ventana con decisión y mira qué aparece.',
            motion:
                'Esperar es una acción. No saltes en cuanto puedas.',
            theme:
                'Cambia de tema en plena partida: la tecla T, o el botón de la barra del juego.',
            rewind:
                'Mantén R para rebobinar seis segundos. En este enigma el botón Atrás del navegador hace lo mismo.',
            orbs:
                'La salida sigue cerrada mientras quede un orbe. Mira el contador, arriba a la derecha.',
            crush:
                'Encoger puede matar. Fíjate en dónde estás antes de tirar de un borde.',
            ice:
                'Sobre el hielo, frena antes del borde. El impulso se conserva, y el vacío también.',
            bounce:
                'Un rellano elástico te lanza más alto que un salto. Déjate caer encima.',
            conveyor:
                'La cinta te desplaza: camina a contracorriente para no moverte.',
            blink:
                'Cuenta el ritmo. El suelo siempre vuelve al mismo intervalo.',
            chase:
                'La cuchilla se alinea contigo. Muévete y vuelve: tarda en bajar de nuevo.',
            wind:
                'El viento cambia el alcance de tus saltos. Salta antes, o después.',
            crumble:
                'No te pares en un rellano frágil: atraviésalo.',
            gravity:
                'Gira la pantalla. Lo que era un muro se vuelve suelo.',
            screen:
                'El área de juego se ajusta: tira de sus tiradores, gírala.',
        },
    },
    mechanics: {
        resize: {
            name: 'Redimensionar',
            body: 'La ventana es el nivel. Su ancho y su alto entran en el cálculo de la posición de cada bloque, en cada fotograma.',
        },
        edge: {
            name: 'Los bordes',
            body: 'Cada bloque está anclado a un borde. Tirar de un lado acerca lo que cuelga de él y aleja todo lo demás: eso es lo que hace franqueable un abismo.',
        },
        appear: {
            name: 'Apariciones',
            body: 'Algunos bloques solo existen por encima, o por debajo, de cierto tamaño de ventana. Nada los anuncia: se descubren tirando de un borde.',
        },
        motion: {
            name: 'Movimiento',
            body: 'Plataformas que van y vienen, cuchillas que caen del techo. Esperar el momento justo es una acción por derecho propio. Si tu sistema pide reducir las animaciones, estos movimientos van a media velocidad.',
        },
        theme: {
            name: 'El tema',
            body: 'Bloques que solo existen en el tema claro, otros solo en el oscuro. El conmutador de tema, en la barra del juego o la tecla T, se convierte en un mando como el salto.',
        },
        rewind: {
            name: 'El rebobinado',
            body: 'El tiempo retrocede seis segundos. En esos enigmas, el botón Atrás del navegador rebobina en lugar de abandonar la página.',
        },
        orbs: {
            name: 'Los orbes',
            body: 'La salida sigue cerrada mientras quede uno por recoger: el nivel se recorre en los dos sentidos.',
        },
        crush: {
            name: 'El aplastamiento',
            body: 'Dos muros que se juntan, y ya no queda sitio para ti. Encoger la ventana puede matar.',
        },
        ice: {
            name: 'El hielo',
            body: 'Un rellano sin rozamiento: conservas el impulso, y frenar exige tanto espacio como arrancar.',
        },
        bounce: {
            name: 'El rebote',
            body: 'Un rellano elástico te lanza más alto que un salto. Es la única forma de alcanzar ciertos rellanos, y de caer sobre los pinchos.',
        },
        conveyor: {
            name: 'La cinta',
            body: 'Un rellano que te desplaza mientras estás encima. Quedarse quieto exige caminar.',
        },
        blink: {
            name: 'El parpadeo',
            body: 'Bloques que solo existen parte del tiempo. El suelo bajo tus pies desaparece a intervalos fijos.',
        },
        chase: {
            name: 'La cuchilla que sigue',
            body: 'Una cuchilla colgada del techo que se alinea con tu posición horizontal. No se la despista: se pasa por debajo en el momento justo.',
        },
        wind: {
            name: 'El viento',
            body: 'Una zona que empuja sin parar. Cambia el alcance de cada salto que la cruza, en un sentido o en el otro.',
        },
        crumble: {
            name: 'Los rellanos frágiles',
            body: 'Ceden menos de medio segundo después de pisarlos. Se cruzan, no se descansa en ellos.',
        },
        gravity: {
            name: 'La gravedad',
            body: 'La pantalla gira por cuartos de vuelta, y la caída la sigue. El mismo nivel leído de lado ya no es el mismo: las plataformas se vuelven muros, y el suelo un techo.',
        },
        screen: {
            name: 'La pantalla interior',
            body: 'El área de juego es una pantalla que tú ajustas: sus tiradores la redimensionan, su rotación cambia el sentido de la caída. La ventana del navegador sigue siendo su límite.',
        },
    },
    puzzles: {
        seuil: { name: 'El umbral', brief: 'Nada que franquear: solo entender que la salida está anclada al borde derecho de la ventana, y que se mueve con él.' },
        marche: { name: 'El escalón', brief: 'Una plataforma, un salto. Lo justo para aprender que el suelo es la parte baja de tu ventana, y nada más.' },
        enjambee: { name: 'La zancada', brief: 'Dos franjas de pinchos a ras de suelo. La carrerilla cuenta tanto como el salto.' },
        corniche: { name: 'La cornisa', brief: 'Cuatro rellanos que suben hacia la derecha. La primera vez que se gana altura.' },
        descente: { name: 'El descenso', brief: 'El camino baja en lugar de subir: caer se convierte en una forma de avanzar.' },
        bordure: { name: 'El borde', brief: 'La llegada está anclada a la derecha y la salida a la izquierda: la distancia entre ambas es el ancho de tu ventana.' },
        suspendu: { name: 'El colgante', brief:
                'El camino cuelga del techo: solo es transitable una vez dada la vuelta a la pantalla.' },
        lucarne: { name: 'La claraboya', brief: 'Falta un puente en el centro. Existe, sin embargo, pero solo por debajo de cierto ancho.' },
        balancier: { name: 'El vaivén', brief: 'Una plataforma que sube y baja. Esperar se convierte en una acción.' },
        navette: { name: 'La lanzadera', brief: 'La misma idea en horizontal: una plataforma que va y viene de un extremo a otro de su pasillo.' },
        clairiere: { name: 'El claro', brief: 'El camino solo existe en el tema claro: en el oscuro no hay ni plataforma ni salida. La tecla T es aquí un mando del juego.' },
        nocturne: { name: 'Nocturno', brief: 'Lo contrario, y peor: en el tema claro las plataformas se vuelven pinchos.' },
        collecte: { name: 'La recogida', brief: 'Dos orbes que recoger antes de que la salida consienta en abrirse.' },
        detour: { name: 'El rodeo', brief: 'Los orbes están al final del camino, la salida en el punto de partida. Hay que volver sobre los pasos.' },
        ecart: { name: 'La distancia', brief: 'Los rellanos alternan entre el borde izquierdo y el derecho: la ventana los separa de dos en dos.' },
        rebord: { name: 'El alféizar', brief: 'Cuatro rellanos de menos de cien píxeles. La precisión sustituye al alcance.' },
        couloir: { name: 'El pasillo', brief: 'Dos muretes en el suelo y un camino que pasa justo por encima.' },
        vide: { name: 'El vacío', brief: 'Primer enigma sin suelo: caer ya no cuesta una franja de pinchos, sino el intento.' },
        pendule: { name: 'El péndulo', brief: 'Dos plataformas móviles sobre el vacío, desincronizadas a propósito.' },
        entonnoir: { name: 'El embudo', brief: 'Dos rutas se excluyen: una por encima de 860 píxeles de ancho, la otra por debajo.' },
        etau: { name: 'El torno', brief: 'Dos muros, uno anclado a la izquierda y otro a la derecha. Encoger hace que se junten: sobre ti.' },
        escalier: { name: 'La escalera', brief: 'Cuatro rellanos y dos cuchillas que barren la escalera a contratiempo.' },
        traverse: { name: 'La travesía', brief: 'Casi todo está anclado al borde derecho, sobre el vacío. La ventana es la única palanca que queda.' },
        alternance: { name: 'La alternancia', brief: 'Una plataforma clara, una oscura, alternando: hay que cambiar de tema en plena travesía.' },
        guillotine: { name: 'La guillotina', brief: 'Tres cuchillas caen del techo, cada una con su propio tempo.' },
        serpentin: { name: 'El serpentín', brief: 'El camino da dos medias vueltas mientras sube. Se vuelve a pasar por encima de donde se estaba.' },
        bascule: { name: 'El balancín', brief: 'Dos plataformas que suben y bajan en oposición, sobre el vacío.' },
        jachere: { name: 'El barbecho', brief: 'Un camino que solo existe en claro, y una cuchilla que solo existe en claro también.' },
        cordee: { name: 'La cordada', brief: 'Tres orbes a lo largo de una subida continua. Ninguno se recoge de paso.' },
        grenier: { name: 'El desván', brief:
                'Todo está del revés, la salida incluida. Dar la vuelta a la pantalla es la única forma de pisarlo.' },
        passerelle: { name: 'La pasarela', brief: 'El tramo central solo aparece por debajo de 800 píxeles de ancho.' },
        tourniquet: { name: 'El torniquete', brief: 'Los rellanos alternan de borde y de anclaje vertical. Cada lado del que tiras mueve medio nivel.' },
        cascade: { name: 'La cascada', brief: 'Un largo descenso, del que un rellano se escurre de lado en el peor momento.' },
        sablier: { name: 'El reloj de arena', brief: 'Un muro corta el paso por encima de 780 píxeles; el pasaje solo se abre por debajo.' },
        relais: { name: 'El relevo', brief: 'Dos orbes llevados por plataformas móviles, sobre el vacío.' },
        faille: { name: 'La falla', brief: 'Tres distancias de ciento diez píxeles, en el límite exacto del alcance de un salto.' },
        vertige: { name: 'El vértigo', brief: 'Ningún suelo, cuatro plataformas móviles y un último rellano pegado al borde derecho.' },
        dedale: { name: 'El dédalo', brief: 'El nivel tiene dos caras según el ancho, y la salida no está en el mismo sitio en cada una.' },
        funambule: { name: 'El funámbulo', brief: 'Rellanos de setenta píxeles sobre el vacío y dos orbes que no se pueden fallar.' },
        contrepoids: { name: 'El contrapeso', brief:
                'Un camino construido cabeza abajo. Leerlo del derecho no lleva a ninguna parte.' },
        retour: { name: 'El retorno', brief: 'Cinco saltos móviles seguidos, sin suelo. Rebobinar no es una ayuda aquí: es la regla.' },
        metronome: { name: 'El metrónomo', brief: 'Tres cuchillas a un tercio de tiempo de distancia. El ritmo es la única solución.' },
        eclipse: { name: 'El eclipse', brief: 'El camino alterna los temas sobre el vacío: cambiar demasiado tarde es saltar a la nada.' },
        tenaille: { name: 'La tenaza', brief: 'Un paso que solo existe por debajo de 900 píxeles, entre dos muros que se cierran.' },
        verticale: { name: 'La vertical', brief:
                'Un pozo tumbado: hay que girar la pantalla un cuarto de vuelta para que sus rellanos sean suelo.' },
        gouffre: { name: 'El abismo', brief: 'Cuatro distancias de noventa píxeles, todas sostenidas por plataformas que respiran.' },
        spirale: { name: 'La espiral', brief: 'El camino se enrolla: borde izquierdo, borde derecho, arriba, abajo y vuelta.' },
        veilleuse: { name: 'La luz de noche', brief: 'Un camino que solo existe en oscuro, y cuyo tramo central solo existe con la ventana estrecha.' },
        horloge: { name: 'El reloj', brief: 'Tres plataformas del mismo período, desfasadas un tercio. Hay que entrar en el compás.' },
        cordon: { name: 'El cordón', brief: 'Tres orbes en las cuatro esquinas de la ventana, y la salida de vuelta en el punto de partida.' },
        abime: { name: 'La sima', brief: 'Dos tramos condicionales sobre el vacío: reducir la ventana, o caer.' },
        charniere: { name: 'La bisagra', brief: 'Por encima de 760 píxeles, dos muros lo cierran todo. Por debajo, aparece el camino.' },
        souffle: { name: 'El último aliento', brief: 'Cinco rellanos móviles, dos orbes, ningún suelo y la salida contra el borde derecho.' },
        epilogue: { name: 'El epílogo', brief: 'Todo a la vez: los bordes, el tema, el movimiento, los orbes y el vacío.' },
        verglas: {
            name: 'El hielo negro',
            brief:
                'Cuatro rellanos de hielo sobre el vacío. Frenar exige tanto espacio como arrancar, y no lo hay.',
        },
        patinoire: {
            name: 'La pista',
            brief:
                'Anchas placas de hielo, y pinchos esperando abajo. El impulso dura mucho después de soltar la tecla.',
        },
        banquise: {
            name: 'El banco de hielo',
            brief:
                'Un serpentín helado de punta a punta, con una media vuelta a media altura. El problema es la media vuelta.',
        },
        derapage: {
            name: 'El derrape',
            brief:
                'Una cinta que empuja al revés, una placa de hielo, y otra cinta que empuja al contrario. Nada se queda quieto, tú incluido.',
        },
        tremplin: {
            name: 'El trampolín',
            brief:
                'Un rellano elástico te lanza el doble de alto que un salto. Es la única forma de alcanzar el siguiente.',
        },
        catapulte: {
            name: 'La catapulta',
            brief:
                'El mismo rebote, pero la llegada oscila. Hay que salir en el momento justo, no cuando uno se siente listo.',
        },
        ressac: {
            name: 'La resaca',
            brief:
                'Un rebote, y después una ráfaga en pleno vuelo. El alcance de tu salto ya no es el que conoces.',
        },
        soufflerie: {
            name: 'El túnel de viento',
            brief:
                'Tres distancias que ningún salto cruza. Solo el viento las atraviesa, y no sopla en todas partes.',
        },
        bourrasque: {
            name: 'La ráfaga',
            brief:
                'Dos ráfagas enmarcando una plataforma móvil. El viento te lleva, la oscilación te devuelve.',
        },
        alize: {
            name: 'El alisio',
            brief:
                'El viento sopla en contra, sobre el hielo. Basta para devolverte al vacío que acabas de cruzar.',
        },
        tapis: {
            name: 'La cinta',
            brief:
                'Dos cintas transportadoras en sentidos opuestos. Quedarse quieto encima exige caminar.',
        },
        contresens: {
            name: 'A contracorriente',
            brief:
                'Dos cintas que empujan hacia atrás, sobre el vacío. Se avanza retrocediendo más despacio.',
        },
        laminoir: {
            name: 'El laminador',
            brief:
                'Dos cintas, dos muros que se juntan al encoger la ventana, y pinchos en medio.',
        },
        stroboscope: {
            name: 'El estroboscopio',
            brief:
                'Dos rellanos que parpadean en oposición. Nunca están los dos a la vez.',
        },
        intermittence: {
            name: 'La intermitencia',
            brief:
                'El suelo vuelve a intervalos fijos, pero no al mismo intervalo en los dos lados.',
        },
        battement: {
            name: 'El latido',
            brief:
                'Un rellano que parpadea, otro que oscila, otro que parpadea a contratiempo. Tres relojes, ninguno afinado.',
        },
        cendres: {
            name: 'Las cenizas',
            brief:
                'Tres rellanos que ceden menos de medio segundo después de pisarlos. Ya no hay dónde pararse.',
        },
        effondrement: {
            name: 'El derrumbe',
            brief:
                'Rellanos frágiles separados por una plataforma móvil. Esperar es fatal, y no esperar también.',
        },
        poussiere: {
            name: 'El polvo',
            brief:
                'Dos orbes sobre lo que va a caerse. Hay que volver, y ya no quedará nada.',
        },
        damocles: {
            name: 'Damocles',
            brief:
                'Una cuchilla colgada del techo se alinea contigo y cae cada dos segundos y medio.',
        },
        traque: {
            name: 'La caza',
            brief:
                'La cuchilla te sigue y el suelo cede detrás de ti. No se puede parar ni volver.',
        },
        ombre: {
            name: 'La sombra',
            brief:
                'El camino solo existe en el tema oscuro, y la cuchilla te sigue en él.',
        },
        frimas: {
            name: 'La escarcha',
            brief:
                'Hielo, con un rellano móvil. Se llega deprisa, y se sale más deprisa aún.',
        },
        avalanche: {
            name: 'La avalancha',
            brief:
                'Rellanos de hielo que ceden. Frenar tarda más de lo que ellos permiten.',
        },
        congere: {
            name: 'El ventisquero',
            brief:
                'Un rellano de hielo solo aparece con la ventana estrecha. Sin él, el vacío mide ochenta píxeles de más.',
        },
        trebuchet: {
            name: 'El trabuquete',
            brief:
                'Un rebote te manda directo a un techo de pinchos. Hay que apartarse en pleno vuelo.',
        },
        mortier: {
            name: 'El mortero',
            brief:
                'Dos orbes, una de ellas arriba del todo. Solo el rebote llega, y la salida está abajo.',
        },
        rafale: {
            name: 'La racha',
            brief:
                'El viento te lleva sobre dos distancias, pero uno de los dos rellanos de llegada parpadea.',
        },
        tourmente: {
            name: 'La tormenta',
            brief:
                'Una ráfaga, una cuchilla que te sigue, y una distancia que ningún salto cruza.',
        },
        sirocco: {
            name: 'El siroco',
            brief:
                'El viento lleva, los rellanos ceden. El segundo no aguanta el tiempo de coger carrerilla.',
        },
        engrenage: {
            name: 'El engranaje',
            brief:
                'Una cinta en contra seguida de un rellano frágil. El impulso que no tienes, no lo tendrás.',
        },
        moulin: {
            name: 'El molino',
            brief:
                'Dos cintas opuestas, y una plataforma que va y viene entre ambas.',
        },
        pilon: {
            name: 'El pilón',
            brief:
                'Dos cintas, dos cuchillas cayendo a contratiempo. Es la cinta la que decide dónde estás cuando caen.',
        },
        eclair: {
            name: 'El relámpago',
            brief:
                'Un parpadeo el doble de rápido de lo normal, y solo un rellano de cada dos.',
        },
        syncope: {
            name: 'El síncope',
            brief:
                'Una cinta que te lleva hacia atrás, hacia un rellano que no siempre está.',
        },
        arythmie: {
            name: 'La arritmia',
            brief:
                'Tres rellanos, tres períodos distintos, ninguno que coincida con los otros.',
        },
        dislocation: {
            name: 'La dislocación',
            brief:
                'Un rellano frágil, uno que parpadea, otro frágil. Dos formas de desaparecer, alternadas.',
        },
        erosion: {
            name: 'La erosión',
            brief:
                'Hielo, luego frágil, luego hielo. Se llega demasiado rápido a lo que no va a aguantar.',
        },
        guet: {
            name: 'La guardia',
            brief:
                'La cuchilla te sigue sobre dos rellanos que parpadean. Esperar al suelo es esperar a la cuchilla.',
        },
        embuscade: {
            name: 'La emboscada',
            brief:
                'Un rellano solo existe con la ventana estrecha, y la cuchilla no te suelta mientras lo buscas.',
        },
        curee: {
            name: 'La montería',
            brief:
                'Dos orbes que recoger con una cuchilla encima de la cabeza. El rodeo se paga.',
        },
        verrou: {
            name: 'El cerrojo',
            brief:
                'Hielo entre dos muros que se juntan. Se frena mal, y el paso se cierra.',
        },
        garrot: {
            name: 'El torniquete',
            brief:
                'Una cinta que te empuja hacia el muro que se cierra. Encoger mata más rápido que en ningún otro sitio.',
        },
        'chausse-trappe': {
            name: 'La trampa',
            brief:
                'El rellano del medio solo aparece con la ventana estrecha, y cede como los demás.',
        },
        apnee: {
            name: 'La apnea',
            brief:
                'Cinco rellanos seguidos sin un sitio donde respirar: hielo, frágil, parpadeo, frágil, y dos orbes.',
        },
        terminus: {
            name: 'El término',
            brief:
                'Todo a la vez, y del revés: rebote, rellano frágil, ráfaga, cuchilla que sigue — tras dar la vuelta a la pantalla.',
        },
    },
    puzzlesPage: {
        title: 'Los enigmas',
        heading: 'Cien enigmas escritos a mano',
        lede: 'Desde el primer escalón hasta secuencias que exigen redimensionar en pleno vuelo.',
        metaDescription:
            'Los 100 enigmas de Reflow, ordenados por dificultad. Cada uno pone en juego una mecánica del navegador: los bordes de la ventana, las apariciones, el tema, el movimiento, el rebobinado.',
        done: '{done} de {total} resueltos',
        play: 'Jugar',
        statusDone: 'Resuelto',
        statusNew: 'Nunca jugado',
        bestTime: 'Mejor tiempo: {time} s',
        mechanicsLabel: 'Mecánicas',
        endlessTitle: '¿Y después?',
        endlessBody:
            'Cuando los cien hayan caído, las partidas infinitas toman el relevo: generadas a partir de una semilla, nunca dos veces iguales.',
        endlessCta: 'Pasar a las partidas infinitas',
    },
    puzzlePage: {
        play: 'Jugar este enigma',
        previewHeading: 'Vista previa',
        previewAlt: 'Vista previa del nivel {name}',
        previewNote:
            'Dibujado por el propio motor del juego, al tamaño para el que se diseñó el enigma. En línea discontinua: los rellanos frágiles, y lo que solo existe en el otro tema o a otro tamaño de ventana.',
        briefHeading: 'Lo que hay que entender',
        mechanicsHeading: 'Mecánicas en juego',
        tierHeading: 'Dificultad',
        statsHeading: 'Tu paso',
        statusDone: 'Resuelto en {time} s',
        statusNew: 'Aún sin resolver',
        previous: 'Enigma anterior',
        next: 'Enigma siguiente',
        backToCatalogue: 'Todos los enigmas',
        metaTitle: '{name} — enigma {tier} de Reflow',
        metaDescription: '{brief} Un enigma {tier} de Reflow, el juego de plataformas cuyo nivel es la ventana del navegador.',
        breadcrumb: 'Enigmas',
    },
    endless: {
        title: 'Partidas infinitas',
        heading: 'Partidas generadas, nunca dos veces iguales',
        lede: 'Cada partida nace de una semilla. La dificultad sube con la racha, y una semilla cabe en un enlace.',
        metaDescription:
            'El modo infinito de Reflow: niveles generados a partir de una semilla, todos distintos, cada vez más duros. Sin cuenta, y cada partida se comparte con un enlace.',
        start: 'Lanzar una partida',
        again: 'Otra partida',
        seedLabel: 'Semilla',
        seedHelp: 'Dos jugadores que introducen la misma semilla reciben exactamente el mismo nivel.',
        seedPlaceholder: 'una palabra, un número…',
        seedApply: 'Jugar esta semilla',
        depth: 'Ronda {depth}',
        record: 'Mejor racha: {depth}',
        recordEmpty: 'Ninguna racha por ahora.',
        shareRun: 'Copiar el enlace de esta partida',
        sections: [
            {
                title: 'Lo que decide la semilla',
                body: 'La semilla lo fija todo: el número de plataformas, su ancho, su separación, el borde al que está anclada cada una, la presencia de cuchillas y de orbes. Con la misma semilla, dos jugadores en extremos opuestos del mundo reciben el mismo nivel, píxel a píxel, sin que ningún servidor tenga que enviárselo.',
            },
            {
                title: 'Por qué una partida generada siempre se puede terminar',
                body: 'El generador no reparte plataformas al azar esperando que salga bien: construye el camino. Cada plataforma se coloca al alcance de un salto desde la anterior, con altura y distancia calculadas a partir de la trayectoria real del personaje. La partida es, por tanto, terminable por construcción, en la cota de referencia mostrada arriba.',
            },
        ],
    },
    rules: {
        title: 'Reglas',
        heading: 'Cómo se juega',
        lede: 'Las flechas para moverse, el espacio para saltar, y la ventana para todo lo demás.',
        metaDescription:
            'Las reglas de Reflow: mover al personaje, saltar, rebobinar y, sobre todo, redimensionar la ventana del navegador para mover el escenario mismo.',
        steps: [
            {
                title: 'Moverse y saltar',
                body: 'Flechas izquierda y derecha, o A y D. Espacio, flecha arriba o W para saltar. Soltar pronto da un salto corto: es la única tecla con dos alturas.',
            },
            {
                title: 'La ventana es el escenario',
                body: 'Cada plataforma está anclada a un borde de la ventana. Arrastrar la esquina del navegador no cambia la escala del juego: mueve las plataformas unas respecto a otras. Es el mando más potente del juego, y no está en ninguna tecla.',
            },
            {
                title: 'El zoom también cuenta',
                body: 'Ctrl y + reducen el área de juego en píxeles CSS, Ctrl y − la agrandan. Es una segunda forma de redimensionar, útil cuando la ventana ya ocupa toda la pantalla.',
            },
            {
                title: 'Morir no cuesta nada',
                body: 'Un pincho, una caída al vacío o un aplastamiento entre dos muros reinician el intento en el acto. R rebobina seis segundos, y en algunos enigmas el botón Atrás del navegador hace lo mismo.',
            },
            {
                title: 'Los orbes mantienen cerrada la salida',
                body: 'Cuando un nivel lleva orbes, la salida sigue cerrada mientras quede alguno. Hay entonces que atravesar, recoger y volver.',
            },
            {
                title: 'Nada se guarda fuera de tu equipo',
                body: 'Tu progreso y tus mejores tiempos viven en el almacenamiento local de tu navegador. Sin cuenta, sin envíos, y vaciar ese almacenamiento lo pone todo a cero.',
            },
            {
                title: 'Una pista si te atascas',
                body: 'Al cabo de un rato, o de unas cuantas muertes, se enciende un botón «Pista» en la barra del juego. Tres escalones, del más vago al más concreto, y ninguno da la solución: nombran la mecánica en juego y el gesto que probar, nunca dónde saltar ni a qué tamaño.',
            },
        ],
        back: 'Jugar',
    },
    mechanicsPage: {
        browserHeading: 'Lo que viene del navegador',
        rulesHeading: 'Y las reglas del propio juego',
        title: 'Mecánicas',
        heading: 'Lo que Reflow toma prestado del navegador',
        lede: 'Todas tomadas de interfaces que el navegador ya expone, y que ningún juego usa.',
        metaDescription:
            'Las mecánicas de Reflow y lo que toman del navegador: el tamaño de la ventana, los bordes, el tema claro u oscuro, el zoom, el historial de navegación.',
        intro: 'Un juego de plataformas clásico dibuja su escenario en un lienzo y se desentiende de la ventana que lo rodea. Reflow hace lo contrario: no tiene escenario propio. Su geometría es una función del tamaño de tu ventana, y todo lo que el navegador deja medir se convierte en un mando.',
        outro: 'Existe una séptima mecánica sobre el papel: un mismo personaje atravesando dos ventanas contiguas, sincronizadas sin servidor. Espera a una versión posterior: depende de un bloqueador de ventanas emergentes, y una mecánica que solo funciona para la mitad de los jugadores no es una mecánica.',
        back: 'Jugar',
    },
    about: {
        title: 'Acerca de',
        heading: 'Acerca de Reflow',
        lede: 'Un juego de plataformas sin cuenta, sin publicidad y sin servidor de juego.',
        metaDescription:
            'Reflow, juego de plataformas gratuito jugado con la ventana del navegador. Cómo está hecho, qué no se recoge y quién está detrás del sitio.',
        sections: [
            {
                title: 'Cómo está hecho',
                body: 'El sitio es enteramente estático: HTML escrito de una vez y servido por nginx. El motor físico funciona en tu navegador, a paso fijo, y los niveles generados nacen de una semilla y no de un servidor. No hay nada que respaldar, nada que pueda averiarse, y el juego funciona sin conexión una vez cargada la página.',
            },
            {
                title: 'Los niveles los verifica una máquina',
                body: 'Un enigma injugable no se ve al leerlo: nada falla, simplemente es imposible. Por eso cada nivel lo vuelve a jugar un programa que busca una secuencia de acciones que lleve a la salida, con el motor del juego y sus constantes reales. Ningún nivel se publica sin esa prueba.',
            },
            {
                title: 'Lo que no se recoge',
                body: 'Ninguna cuenta, ninguna publicidad, ningún rastreador de terceros. Tu progreso se guarda en tu navegador y no se envía a ninguna parte. La medición de audiencia es un Matomo autoalojado, configurado sin cookies.',
            },
            {
                title: 'Quién lo ha hecho',
                body: '{author}, desarrollador. Reflow se suma a Azimut, Push Your Luck y Loups-Garous, reunidos en un panel común.',
            },
        ],
        clearTitle: 'Borrar tu progreso',
        clearBody:
            'Tus enigmas resueltos, tus mejores tiempos, tus pistas desbloqueadas y tu mejor racha viven en este navegador y en ningún otro sitio. Este botón los elimina, y no hay vuelta atrás.',
        clearButton: 'Borrarlo todo',
        cleared: 'Borrado',
        contactTitle: 'Escribir',
        contactBody: 'Un enigma imposible, una traducción torpe, una idea:',
        back: 'Jugar',
    },
    legal: {
        title: 'Aviso legal',
        heading: 'Aviso legal',
        lede: 'La información que la ley exige a un sitio accesible al público.',
        metaDescription:
            'Editor, alojamiento y condiciones de uso de reflow.leoderoin.fr, el juego de plataformas cuyo nivel es la ventana del navegador.',
        sections: [
            {
                title: 'Editor',
                body: 'El sitio reflow.leoderoin.fr está editado por {author}, a título personal y no comercial. El director de la publicación es el propio editor.',
            },
            {
                title: 'Alojamiento',
                body: 'El sitio está alojado por {host}, {address}. Teléfono: {phone}. SIREN {registration}.',
            },
            {
                title: 'Contenido',
                body: 'Los textos, los niveles, el motor y las ilustraciones de este sitio son obra de su editor. El código fuente se publica bajo licencia MIT. Las tipografías Space Grotesk y JetBrains Mono se distribuyen bajo licencia SIL Open Font.',
            },
            {
                title: 'Enlaces salientes',
                body: 'Este sitio solo enlaza a jeux.leoderoin.fr, al sitio personal de su autor y al repositorio público del código. No muestra publicidad ni contiene ningún enlace comercial o de afiliación.',
            },
        ],
        contactTitle: 'Contacto',
        contactBody: 'Para cualquier pregunta sobre este aviso:',
        back: 'Jugar',
    },
    privacy: {
        title: 'Privacidad',
        heading: 'Privacidad',
        lede: 'Lo que se mide, lo que no, y dónde se queda.',
        metaDescription:
            'Lo que se mide en Reflow, lo que no, y lo que se queda en tu navegador. Sin cuenta, sin rastreadores de terceros, sin cookies de medición.',
        sections: [
            {
                title: 'Tu progreso',
                body: 'Los enigmas resueltos, tus mejores tiempos, las pistas desbloqueadas y tu mejor racha en modo infinito se guardan en el almacenamiento local de tu navegador. NUNCA se envían a un servidor: no lo hay. Puedes borrarlo todo con un botón, desde la página «acerca de».',
            },
            {
                title: 'El juego en sí',
                body: 'El motor físico y la generación de niveles se ejecutan enteramente en tu navegador. Una partida generada nace de una semilla calculada en tu máquina, y nada de lo que juegas se transmite a ninguna parte.',
            },
            {
                title: 'Medición de audiencia',
                body: 'El sitio usa Matomo, instalado en el mismo servidor. Se registran las páginas consultadas, el idioma del navegador, el tipo de dispositivo y la página de procedencia. Ningún dato se transmite a un servicio de terceros, y no hay red publicitaria ni widget social incrustado.',
            },
            {
                title: 'Cookies',
                body: 'Ninguna. Matomo está configurado sin cookies, lo que exime a este sitio del banner de consentimiento. Tu elección de tema se guarda en el almacenamiento local y nunca se envía al servidor.',
            },
            {
                title: 'Registros del servidor',
                body: 'Como todo servidor web, este conserva registros técnicos de acceso: dirección IP, fecha, página solicitada. Sirven para el diagnóstico y la seguridad, y no se usan para nada más.',
            },
            {
                title: 'Tus derechos',
                body: 'Puedes solicitar el acceso a los datos que te conciernen, su rectificación o su supresión. La solicitud se hace por correo y no necesita motivo.',
            },
        ],
        contactTitle: 'Escribir',
        contactBody: 'Para ejercer tus derechos o preguntar algo:',
        back: 'Jugar',
    },
    footer: {
        madeBy: 'Creado por {author}',
        source: 'Código fuente',
        otherGames: 'Mis otros juegos',
        versionLabel: 'Versión {version}',
    },
    notFound: {
        title: 'Página no encontrada',
        body: 'Esta dirección no corresponde a nada en este sitio.',
        back: 'Volver al juego',
    },
};
