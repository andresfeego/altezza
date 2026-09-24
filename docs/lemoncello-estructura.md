# Lemoncello — sobre animado y lienzo interior

Plantilla `wedding_lemoncello`, evento local `bodlauser` (Laura y Sergio).
Enlace real de prueba: `/invitacion/lausprueba/910175`. La vista de desarrollo
`/invitacion/preview/lemoncello` usa el mismo renderer y devuelve 404 en producción.

## Contratos y datos

Se revisaron Classic, Terracota y Oliva antes de implementar el sobre. Lemoncello
incorpora COMMON_MODULE_VIEWS, ambos resolvers de Hero y ModuleSurface. No filtra
el catálogo común a los tres módulos iniciales: respeta enabled, order y los datos
resueltos, incluido attendanceState. No se añaden campos de módulo ni endpoints.

El letrero consume `EnvelopIntroModule.data.invitationLabel` y `eventDate`:
label explícito del config si existe, de lo contrario `invitacion.label`; fecha
corta derivada de `invitacion.fechaHoraCeremonia`, en Colombia. No hay copias de
estos datos en CSS, ilustraciones o código de plantilla.

`hero_image_1.config.text1` contiene «Nos casamos» y `logoImage` apunta al PNG con
alfa `/scrAppaltezza/invitations/bodlauser/cover/laura-sergio-monogram.png`. La fecha y los
nombres siguen saliendo del evento/invitación mediante el resolver compartido;
el monograma pertenece a esta tarjeta y no se impone a otras parejas. La actualización
local repetible es `backend-altezza/seeds/invitation_projects/bodlauser/configure-hero.js`.
`biblical_quote.config.passageText` guarda
“Celebramos nuestro amor y queremos compartirlo con nuestras personas favoritas.”
y passageReference queda vacío. La actualización local repetible es
`backend-altezza/seeds/invitation_projects/bodlauser/configure-envelope.js`: valida
identidad, guarda respaldo y no toca invitados, respuestas, lugares ni fechas.
Se sincronizaron los archivos de seed y preview; no se cambia el contrato compartido.

La escena de sombrillas usa `biblical_quote`, después del Hero y antes de las fotos.
`configure-quote-scene.js` retira el `welcome_message` agregado por error y mueve
la frase existente a ese lugar, con respaldo y sin cambiar la publicación.
`configure-welcome.js` ahora delega al corrector. El letrero presenta exclusivamente
`passageText` y la referencia opcional; no muestra «Para», invitado ni mensaje personalizado.

## Regla visual permanente

Antes de generar o editar cualquier imagen de Lemoncello, aplicar
`components/invitaciones-publicas/templates/wedding-lemoncello/AGENTS.md`.
Se deben adjuntar como referencias la acuarela original de botella y limones
(copia estable en `assets/references/watercolor-style-master.jpg`) y el paisaje
aprobado `assets/images/landscape-proportioned.png`. Se exige acuarela tradicional
suave, veladuras, pinceladas orgánicas y colores tenues: cielo/pastel, mantequilla,
marfil, oliva/salvia y ocre claro, con marino moderado. No usar una generación nueva
como sustituto automático de las referencias originales; la canastilla anterior
fue rechazada por su acabado y no sirve como guía de estilo.

## Escenas y comportamiento

- El sobre es una escena de entrada separada del lienzo interior. Tras cargar los
  recursos y quitar el loader global, la cámara recorre el paisaje durante 8 s.
  `presentationReady` es una señal de presentación del renderer, no un campo de DB.
- La ruta real y la vista previa usan el mismo LoadingScreen «Cargando invitación…».
  Las capas necesarias del sobre y el Hero llevan `data-invitation-preload`: se
  esperan aunque estén inicialmente fuera de cámara o no tengan altura intrínseca
  hasta descargarse. Lemoncello usa una espera máxima de 10 s, coherente con su
  alternativa por fallo; las demás plantillas conservan su límite de 3 s. Las
  imágenes lazy/hidden no marcadas siguen sin bloquear. Una descarga tardía tras
  agotar el plazo no reinicia el recorrido ni sustituye de repente el estado de fallo.
- La Vespa amarilla, sin personas, se anima independientemente sobre el camino.
  Al llegar se detiene; árbol a la izquierda, letrero a la derecha y perro abajo.
- Las ruedas completas son sprites separados `vespa-wheel-front` y `vespa-wheel-rear`,
  generados desde la Vespa aprobada. El bitmap original de la Vespa permanece intacto:
  `assets/masks/vespa-body-mask.svg` oculta sus neumáticos y conserva carrocería,
  guardabarros, escape, soportes y horquilla. El canasto sigue en el mismo grupo fijo.
  Las ruedas giran por debajo de esas piezas; el ángulo deriva de distancia recorrida
  en el paisaje / circunferencia, con el mismo easing y los mismos 8 s del avance.
  Se pausan bajo el cargador y quedan detenidas al llegar. Los PNG completos se
  conservan y los WebP de entrega miden 512×512 para no recargar la descarga móvil.
- La canastilla de limones y flores se dibuja como una capa independiente apoyada
  sobre la zona de portaequipajes trasera, dentro del mismo grupo animado de la Vespa.
  La versión `vespa-basket-soft` rehace el acabado en acuarela suave y menos contrastada.
  Mide 27% del ancho de la Vespa (antes 30%: reducción del 10%). Se mueve 15 puntos
  porcentuales del ancho de la moto hacia la cola (left 15% → 0%); la base acompaña
  el apoyo más bajo del portaequipajes. El encuadre aprobado sigue recortando la
  parte más trasera del conjunto al finalizar, sin mover la cámara ni la moto.
  Los PNG/WebP originales de la Vespa no se modificaron (verificados por SHA-256).
- La distancia revisada es la mitad de la versión ORIGINAL, conservando 8 s.
  Se toma el desplazamiento inicial de cámara (`alto * 3 * .832 - ancho * .48`)
  y el desplazamiento original de la Vespa en pantalla (`-.14 * ancho`); ambos
  se reducen a la mitad. No se usa como base la versión intermedia de recorrido corto.
- El encuadre final se desplaza un 9% del ancho visible hacia la derecha respecto
  a esa versión, siguiendo la línea roja de la referencia. La salida se conserva;
  la cámara y la Vespa terminan ese mismo desplazamiento más a la izquierda en
  pantalla, conservando la distancia física de la Vespa y los ocho segundos.
- Toda la escena usa una única unidad (`alto visible / 724`) sobre el panorama
  original de 2172 × 724. Las imágenes conservan su relación de aspecto mediante
  altura automática: nunca se estiran sus ejes por separado. La puerta mide
  174 × 354 unidades (relación .492, cercana a la referencia); la Vespa visible
  tiene aproximadamente .82 veces la altura de la puerta de largo, y el perro
  sentado aproximadamente .39 veces la altura de la puerta. Las diferencias
  transparentes de los sprites se consideran al comprobar estos tamaños.
- El limonero izquierdo conserva copa y maceta naturales. La pared derecha queda
  libre para un letrero vertical de azulejos pintados en acuarela. Su ancho se
  calcula desde el límite del marco de piedra hasta 10 px antes del borde derecho
  visible. Mantiene la proporción original de la ilustración; label y fecha siguen
  siendo texto dinámico centrado dentro del área clara, sin superponerse a la puerta.
- El control Abrir conserva su semántica de botón y acceso por teclado, pero se
  presenta como un letrero ilustrado con puntilla e hilo, en el tercio superior de
  la puerta. Está anclado al paisaje y acompaña a la puerta durante todo el recorrido,
  visible desde que la puerta entra en cámara, sin aparecer de golpe al llegar.
  Se habilita al detenerse, desaparece al iniciar la apertura y conserva el foco
  visible al navegar con teclado. Si falla el arte, se ofrece una alternativa textual accesible.
- La fachada y ambas hojas tienen un arco redondo. Las hojas siguen siendo
  imágenes independientes. El conjunto de hojas escala uniformemente a 1.02 desde
  su centro para tapar las pequeñas fugas en el borde del hueco. El fondo azul de la abertura se eliminó por código:
  PNG y WebP tienen alfa real en esa zona, respetando marco y hojas del limonero.
  El sobre tampoco pinta un fondo sólido al abrir: deja ver el primer módulo real,
  que ya está montado debajo, desde la primera separación entre las hojas.
- Abrir emite el evento compartido `envelopIntro:open` (o usa el control de música
  existente) dentro del gesto. Cada hoja gira desde su bisagra exterior; el zoom
  dura 3.6 s (el doble de los 1.8 s anteriores), sincronizada con las dos hojas,
  y revela el Hero. Se ignoran clics repetidos, se mueve el foco al
  contenido y se limpian temporizadores/observadores al desmontar.
- La música utiliza `music_player` compartido, fuera del recorrido de escenas.
  En `bodlauser`, `configure-music.js` configura «Eres tú · Carla Morrison» con
  `autoplay: true` e `initiallyMuted: false`. El MP3 pertenece al evento en
  `/scrAppaltezza/invitations/bodlauser/music/carla-morrison-eres-tu.mp3`;
  se conserva el original recibido en `muisc`. Tras `presentationReady` espera
  la flecha inicial con la Vespa quieta. Ese clic inicia reproducción y recorrido
  simultáneamente y retira la flecha; el audio no responde a otros gestos antes
  del arranque. Al llegar, Abrir hace un vaivén breve cada tres segundos salvo
  con movimiento reducido. El botón circular de sonido aparece al arrancar y permite
  silenciar/reactivar sin reiniciar la pista y abrir no anula un silencio elegido.
  DB, seed y preview contienen el mismo módulo; el script es idempotente y respalda
  la configuración antes de actualizar la base local.
- Frase bíblica ↔ fotos: recorrido de 3 s con `cubic-bezier(.45, 0, .55, 1)`:
  salida lenta, aceleración y llegada suave. Conserva el pájaro en la ida. En
  fecha → ceremonia, los textos se muestran junto a la capilla bajo las sombrillas
  al cambiar el fondo, sin esperar a que termine su salida; la interacción sigue
  bloqueada hasta completar la transición.
- Los medios explícitos del sobre siguen admitidos mediante EnvelopeBackground;
  se respetan video, imagen, imagen desktop, envelopeSrc y monogramSrc. Esos medios
  se presentan con una apertura directa, pues no comparten la geometría del paisaje.
- Con movimiento reducido se muestra la llegada estática y se abre directamente.
  Si falla la carga de arte, la invitación sigue ofreciendo el botón y sus datos.
- El Hero ocupa la esquina superior izquierda. Todas las escenas avanzan
  horizontalmente: Hero en la columna 0, paseo en la 1, frase bíblica
  en la 2, edificio completo en la 3, fotos en la 4 y fecha/calendario en la 5.
  Ceremonia/recepción comparte la columna 5, revelada en profundidad. Las flechas permiten
  avanzar y regresar; los módulos altos conservan desplazamiento vertical interno.
- El Hero usa `HeroLemoncello`: paisaje de cielo/mar/montañas/ciudad al fondo,
  pajarito animado en un plano intermedio y primer plano con
  limonero, balcón y vaso de la referencia, sin bolso. Las dos ilustraciones tienen
  alfa real y proporción 4:7; se escalan juntas uniformemente. Los huecos entre las
  columnas muestran el mar. Los extremos terminan en pinceladas irregulares con
  transparencia y el contenedor del Hero no pinta un rectángulo opaco.
- En el cielo se presentan `text1`, `logoImage` y `text2` del contrato compartido.
  El PNG del monograma se extrae por código del original, sin regenerar sus letras.
  La máscara CSS permite cambiar `--hero-monogram-color`; un halo azul marino
  centrado (desplazamiento cero en ambos ejes) rodea la silueta completa. El nombre
  del evento sigue siendo accesible y se muestra si no hay logo o falla su carga.
- El bloque de textos queda en el área libre de cielo, desplazado ligeramente a
  la izquierda y con tamaño máximo de monograma ligado a la altura visible. Se
  verificó que sus cajas no intersectan píxeles del primer plano en móvil/escritorio.
  El orden real de capas es paisaje → texto → primer plano. La rama superior derecha
  se separa visualmente del mismo bitmap mediante clip-path, aprovechando su zona
  central transparente; oscila de −2° a 2.5° cada 4.5 s desde su punto de sujeción.
  No se repintan hojas ni se mueve el balcón. Con movimiento reducido no hay balanceo.
- El pajarito tiene ocho fotogramas, aleteo de 560 ms y flotación de 4.8 s.
  Su tamaño se aumentó un 10%; con movimiento reducido se presenta estático.
- La flecha inferior derecha del Hero, ilustrada como cerámica, inicia el recorrido
  de 6.4 s: un mesero entra por la izquierda, camina con una bandeja y la cámara
  lo sigue hasta la terraza de sombrillas amarillas. El panorama conecta ambas
  escenas con costa, baranda y pavimento; la nueva dirección permite bordes rectos.
  El letrero de `biblical_quote` está en primer plano con la frase del Word. Durante
  el recorrido se bloquean clics repetidos y al llegar se enfoca el módulo.
  Con movimiento reducido el cambio es inmediato.
- El letrero bíblico usa un caballete marfil con borde ocre fino y dos canastillas
  de limones, una junto a cada pata (`quote-ivory-easel-v2`). El adorno independiente
  `quote-lemon-ornament-v1` queda debajo del mensaje y de la referencia opcional,
  dentro de la misma composición. Ambos recursos conservan alfa real y se precargan.
  Texto y referencia siguen procediendo exclusivamente de `biblical_quote`.
  La fuente Cormorant, normal/cursiva con licencia OFL incluida, vive en los assets
  locales de Lemoncello. La tinta ocre y tipografía tienen tokens de plantilla;
  el estilo está en `QuoteLemoncello.module.scss`, separado del módulo de bienvenida.
  Validación manual: revisar frase y adorno dentro del papel, ambas canastillas
  visibles, flechas libres y continuidad del paseo en 320, 390 y 440 px y escritorio.
  Revisión del 23 de septiembre de 2026: 50 pruebas de contratos/carga aprobadas;
  WebKit comprobó esos anchos y 1440 px, sin desbordamiento del texto de Laura y
  Sergio. El túnel cargó ambas imágenes y Cormorant, y permitió avanzar a fotos
  y regresar con la animación normal. Diseño disponible para revisión del usuario.
- De frase a fotos, el mismo pájaro del Hero entra por la izquierda y acompaña
  a la cámara durante 6.4 s a través del edificio completo. La cámara llega al
  86% del recorrido y el pájaro continúa hacia la derecha hasta salir del encuadre.
  Reutiliza los ocho fotogramas y el aleteo de 560 ms. La rama superior de la
  frase es una capa con alfa real que oscila de −2° a 2.5° cada 4.5 s.
- El ancho máximo es 480 px. El fondo exterior plano de Lemoncello es una excepción
  de presentación ya definida para esta tarjeta; las otras plantillas no cambian.

## Recursos

### Escena de fecha

Después de las fotos se guardan los módulos compartidos `countdown` y
`save_the_date_calendar`; `sceneModules.js` agrupa solamente esa pareja adyacente
en una parada visual. Los resolvers, fechas, textos, `enabled` y fondos opcionales
siguen siendo independientes. Un cambio de plantilla no requiere transformar datos.

La presentación blanca muestra fecha → mensaje → título/contador → calendario. Se reutilizan
`CountdownView`, `CountdownDate` y `SaveTheDateCalendarView`, con tipografías de
Oliva, valores de dos dígitos y corazón delineado en el día del evento. La frase
es «Cada instante nos acerca a compartir este día contigo.». La ceremonia de
Laura y Sergio determina sábado 19 de diciembre de 2026 y el 19 marcado.

La dirección aprobada el 2026-09-23 reemplaza el caballete por fondo blanco con
cenefas azules `date-maiolica-v1` arriba y abajo. `date-lemon-branch-v1`, con alfa
real, se ancla abajo a la derecha y oscila de −2° a 2.5° cada 4.5 s. El contenido
se pinta a resolución final, sin ancestros escalados, y reserva espacio para las
decoraciones y las flechas. En pantallas bajas se reducen márgenes y tamaño del día
para conservar completo el calendario. Los datos siguen siendo texto editable.

La capilla interpreta en acuarela el dibujo del Hero de Natalia y Andrés
(`bodnatyand`, `hero_image_1.config.backgroundImage`): fachada con óculo, puerta
de madera, pequeña cúpula con cruz, escalinata frontal y acceso entre cipreses.
Se agregaron dos canastillas de limones junto a los cipreses. La referencia se
conserva en `assets/references/chapel-natalia-andres-line.webp`; la tarjeta de
Natalia y Andrés permanece intacta.
`event_details` sigue al calendario y conserva el contrato compartido. Usa los
lugares/horarios del evento, direcciones/mapas del resolver, mensajes opcionales y
`showCeremony`/`showReception`. Los datos no están dibujados en la ilustración.

`chapel-reference-day-v1` sustituye `photo-church-continuous-v2`, conservando el
panorama y su relación 1897×829. `gardenCamera.js` centra la nueva fachada mediante
`gardenComposition.landscape.chapelCenterX`, sin usar el anclaje del caballete retirado.
`ChapelWind.js` aplica un desplazamiento horizontal localizado a las copas de seis
cipreses del paisaje aprobado. Dos ciclos suaves de 7.6/9.1 s, con fases distintas,
reducen el movimiento hasta cero en la base; el máximo ronda 3.6 px de la pintura.
Una capa acelerada conserva el viento entre ceremonia y recepción, sin regenerar
imágenes ni mover capilla, escalinata o canastillas. La pintura original permanece
como respaldo si no hay aceleración gráfica. Solo se activa con la iglesia visible,
se pausa en pestañas ocultas y se retira con movimiento reducido o al salir de la escena.
La escena de fecha es una capa independiente del viewport.

Fotos ↔ fecha ↔ iglesia duran unos 3.66 s en ambas direcciones. Quince sombrillas
`parasol-overhead-v1` entran desde los cuatro bordes girando sobre su centro;
su distribución irregular y tamaños variados cubren toda la pantalla al pasar
por el centro. A los 1.83 s se cambia la presentación debajo, sin desplazar ni ampliar
el fondo a la vista. Continúan hacia el borde opuesto sin detenerse; se eliminó
la espera central y la velocidad de entrada/salida se redujo un 30%. Un disco opaco dentro de cada tela
evita filtraciones entre píxeles translúcidos de acuarela. La distribución se
recalcula con el viewport, incluyendo sus esquinas.
El texto de ceremonia espera a que salgan las sombrillas y aparece en 300 ms,
con datos sobre el cielo superior y la iglesia/jardines abajo (aprox. 60/40).
Las flechas aparecen con opacidad de 0 a 1 en 300 ms al abrir o llegar a cada
escena; desaparecen también en 300 ms al comenzar el recorrido y quedan
deshabilitadas inmediatamente. El fundido se aplica al contenedor estable de
navegación para conservar continuidad al insertar o retirar una flecha.
Con movimiento reducido, las flechas se muestran sin fundido y cámara y textos
cambian inmediatamente, sin dejar un texto superpuesto sobre el otro módulo.

Se respetan bloqueo de navegación durante la transición, foco después de retirar
`inert`, teclado y limpieza de temporizadores. El enlace de recepción usa la URL
existente de Villa Germana; no se inventa una ubicación para la capilla sin mapa.
El Word confirma ceremonia a las 14:30 y pide puntualidad. La recepción a las
16:00 es provisional: `receptionMessage` la marca «RECEPTION TIME TO REPLACE».

`event_details` se presenta ahora en dos pasos, respetando `showCeremony` y
`showReception`: ceremonia y recepción sobre la misma imagen de cielo claro. No se añaden módulos a
la DB ni se duplican contratos; `sceneModules.js` crea los pasos de presentación
con los mismos datos resueltos. Ambos usan exactamente la misma pose de cámara.
El texto queda más grande y centrado en el 60% superior, con el halo azul sin
desplazamiento del monograma (mismo color, opacidad y radio compartidos).

Al pulsar la flecha de ceremonia: el texto se desvanece en 200 ms; una sola chispa
sube desde la vegetación y se abre suavemente a los 1.6 s. Al completar la secuencia
de 4 s, aparece recepción en 300 ms. El paisaje de día permanece visible todo el
tiempo y ambos eventos usan texto azul marino con el mismo halo. El recurso nocturno
`chapel-reference-night-v1.webp` se precarga para la siguiente escena de sobres y
permanece invisible durante ceremonia y recepción.
No se añade sonido. Volver presenta ceremonia en 2.2 s, sobre el mismo fondo. Con movimiento
reducido, ambos cambios son inmediatos y no se representa la chispa.

Configuración local repetible, con respaldo: `configure-date-scene.js` del seed
`bodlauser`. Conserva invitados, fechas, respuestas y estado de publicación.
`configure-event-details.js` añade el módulo de detalles después del calendario,
también de forma idempotente y con respaldo; conserva configuraciones existentes.

### Lluvia de sobres y cielo nocturno

El octavo módulo canónico es `gift_envelopes`, después de `event_details`. Consume
`title: "Lluvia de sobres"`, `leadText: "AMAMOS LOS NIÑOS, PERO ESTE EVENTO ES EXCLUSIVO ADULTOS"`,
`imageSrc` y `imageAlt` del contrato común. La presentación es específica de Lemoncello;
los mismos datos siguen funcionando en Classic, Oliva y Terracota.

Recepción desaparece al avanzar. Cámara y fundido a noche arrancan juntos y duran
4.8 s. El recorte del paisaje termina en y=416, justo sobre la cruz de la capilla,
sin deformar la pintura. Al llegar aparecen título, icono y mensaje, y debajo una
silueta de novios que se balancea suavemente. Cuatro haces tenues y difuminados
salen desde el borde inferior con barridos desfasados. La luna conserva su posición
dentro del paisaje. Regresar invierte cámara/iluminación y restaura recepción diurna.
Se mantienen foco, bloqueo de doble clic y flechas con fundido. Movimiento reducido
omite ascenso, fundido, baile y barrido.

Recursos generados con `image_gen` integrado, originales PNG y derivados WebP con
alfa: `assets/images/gift-dancing-silhouette-v1` y
`public/images/invitaciones/bodlauser/gift-envelope-watercolor-v1`.
La silueta usa la máscara alfa de la ilustración para omitir los detalles interiores.
Prompts y referencias: `assets/prompts.json` → `giftSkyIllustration` y
`output/imagegen/gift-sky-prompts.json`.

Configuración idempotente local y con respaldo:
`backend-altezza/seeds/invitation_projects/bodlauser/configure-gift-envelopes.js`.
Actualiza solo el JSON de módulos de Laura y Sergio; conserva datos, invitados,
respuestas, publicación y configuración de los demás módulos.

Prueba manual: avanzar desde recepción, comprobar ascenso/fundido simultáneos,
los cuatro haces, separación luna/título y mensaje/silueta; volver a recepción;
repetir con movimiento reducido. Validado con WebKit en 320×568, 390×844, 440×766
y 1440×900, con separación entre mensaje y silueta. Pruebas: 51 frontend y 2 de
configuración backend. Capturas `output/playwright/lemon-gifts-*.png`.
El túnel público también llega a sobres con ambos recursos cargados y sin
desbordamiento horizontal; captura `lemon-gifts-public.png`. La primera carga
del paquete de desarrollo fue lenta (unos cinco minutos en WebKit); los recursos
nuevos respondieron HTTP 200. Este coste previo de desarrollo no cambia el flujo.

### Pila de fotografías

Después de la frase bíblica, `image_slider_1` presenta siete fotos reales en marcos
Polaroid sobre el extremo derecho de `quote-photo-panorama-v2`: una sola acuarela
continua cubre la terraza de sombrillas, el edificio completo y la terraza de fotos.
`photo-garden-v1` se conserva como respaldo para sliders fuera de este recorrido.
Las fotos son datos del módulo; el paisaje es decoración propia de Lemoncello.
Los originales locales se conservan numerados en una sola carpeta `photos`.

Un gesto en cualquier dirección desplaza la foto superior y la devuelve al fondo
de la pila, en bucle. Basta soltar tras 16 px de recorrido; el umbral es fijo y
no crece con el tamaño de la foto. Movimientos menores regresan a su sitio; una cancelación
no pasa la foto. También admite clic, Enter, espacio y flechas del teclado. El foco
acompaña la nueva foto superior; los clics repetidos se bloquean durante la salida.
«Desliza» está en el margen inferior de la primera foto y desaparece al primer
arrastre deliberado o avance. La preferencia se conserva en sessionStorage para
esa colección durante la visita, incluidas recargas y regreso entre escenas.
Con movimiento reducido se cambia la foto directamente. Cada marco mantiene
proporción 4:5, ventana de imagen cuadrada y márgenes iguales arriba y a los lados;
el margen inferior es más amplio. Las siete imágenes rellenan esa ventana con
`object-fit: cover`, centradas por defecto y recortadas sin deformar su proporción.
Se conservan los ajustes opcionales del contrato y no se añade filtro sepia.

Comprobaciones: arrastrar en ocho direcciones y completar una vuelta de siete;
comprobar teclado, cancelación, foco, movimiento reducido, imágenes cargadas y
desaparición del aviso al regresar. Revisar 320, 390, 440 y 480 px de ancho de tarjeta.

Validado el 20/09/2026: 46 pruebas frontend y 10 backend; Playwright con ratón en
ocho direcciones, un gesto táctil, ciclo completo, teclado, reducción de movimiento
y regreso entre escenas. Captura pública: `output/playwright/lemoncello-photos-public.png`.
Las siete fotos cargaron por Cloudflare; los 22 originales conservaron su SHA-256.
El slider Terracota existente conserva nueve imágenes y su intervalo de 4 s.

Los originales PNG y sus derivados WebP (alfa en los sprites) están en
`components/invitaciones-publicas/templates/wedding-lemoncello/assets/images/`:
los activos son `landscape-open-alpha`, `vespa`, `door-left-arched`, `door-right-arched`,
`dog`, `vespa-basket-soft`, `majolica-plaque`, `hanging-abrir`, `hero-coast` y
`hero-balcony`, `vespa-wheel-front`, `vespa-wheel-rear`, `hero-bird-flight-v1`,
`welcome-panorama-v1`, `waiter-walk-v1`, `welcome-board-v1`, `scene-arrow-v1`,
`quote-photo-panorama-v2`, `quote-lemon-canopy-v1`, `photo-countdown-panorama-v1`
y `countdown-arched-board-v2`.
Se conservan también los
originales de la primera versión. Son decoración de esta plantilla, nunca se
importan desde una vista compartida. El único texto ilustrado es la acción fija
«Abrir»; la placa cerámica no incluye los datos del evento ni de la invitación.

Generados con la herramienta integrada ImageGen, usando botella/limones como
referencia de estilo, paisaje/Vespa y entrada como referencias de composición y
perrito como referencia de identidad. Los prompts exactos y la procedencia están
en `components/invitaciones-publicas/templates/wedding-lemoncello/assets/prompts.json`.
Los PNG originales se conservaron; los WebP optimizan la entrega sin alterar alfa.
`node scripts/lemoncello-prepare-hero.cjs` deriva los WebP del Hero y el monograma:
convierte la luminancia de la tinta original en alfa suavizado, quita el papel
casi blanco y conserva las dimensiones 1280 × 758. No se usó croma: los huecos del
balcón ya tienen alfa efectivo en la generación. Las fuentes del Hero y del
monograma se conservan en `assets/references/` y su procedencia en `prompts.json`.
La derivación `landscape-open-alpha` se reproduce con
`node scripts/lemoncello-cut-door-alpha.cjs`. Usa Node.js y Sharp por solicitud
explícita del usuario. Elimina 55 405 píxeles de fondo azul mediante selección
conectada acotada; conserva dimensiones, RGB original y alfa fuera de la puerta.

## Validación

`node --test tests/invitation-contracts.test.cjs tests/invitation-loading.test.cjs`
comprueba cuatro plantillas, contenido compartido, ocho segundos, clic único,
movimiento reducido, limpieza, fallos de arte y posiciones de diez módulos.

Revisión manual mínima:
1. Recargar el enlace real; ver el paisaje y la Vespa durante ocho segundos visibles.
2. Comprobar label y fecha del letrero; abrir y ver las dos hojas y el zoom al Hero.
3. Pulsar la flecha, seguir al mesero hasta la frase bíblica, regresar y comprobar
   ausencia de barras/recortes; avanzar de nuevo hasta las fotos con el pájaro.
4. Probar móvil, escritorio, teclado y movimiento reducido.
5. Comparar ancho/alto renderizado de cada imagen con sus dimensiones originales;
   comprobar que moto y perro mantienen su escala respecto a la puerta y que la
   distancia recorrida, incluyendo el movimiento de cámara, es el 50% inicial.
6. Observar el Hero entre las puertas durante la apertura (antes de retirar el
   sobre); verificar el encuadre desplazado y ausencia del fondo azul oscuro.
7. Comprobar canastilla apoyada sobre el asiento durante todo el recorrido,
   letrero colgante en el tercio superior y cuadro de azulejos sin solapamientos,
   con margen derecho de 10 px. Se comprobaron 440×766, 393×684, 390×844,
   320×740 y escritorio 1440×900; también la apertura con Enter.
8. Abrir hasta el Hero: «Nos casamos», monograma original en marino, fecha real,
   paisaje detrás del balcón y mar visible entre columnas. Comprobar proporciones
   en 320×740, 390×844, 440×766 y escritorio; regresar desde la frase y probar
   movimiento reducido. Verificar flotación y aleteo del pajarito.
9. Retener por red una hoja de la puerta durante más de 3 s: el cargador sigue
   visible, `presentationReady` permanece falso y el viaje no empieza. Liberar
   el recurso; comprobar después ocho segundos completos de recorrido.
10. Observar las ruedas girar durante el avance, detenerse al llegar y mantener
    escape/horquilla fijos. La apertura sigue presente a los 1.8 s y finaliza a
    los 3.6 s. Verificar que la rama se balancea y que el texto no invade hojas/flores.
11. Comprobar la frase bíblica a 320×740, 390×844, 440×766 y 1440×900: el texto cabe
    dentro del letrero, la flecha no lleva etiqueta visible y las escenas se
    conectan horizontalmente. Verificado por Cloudflare el 20/09/2026, incluidas
    apertura, llegada, regreso y reducción de movimiento; sin imágenes rotas.
12. Desde la frase avanzar a las fotos: recorrer dos anchos de pantalla, mostrar
    el edificio completo y mantener un único suelo/horizonte. El pájaro aletea
    durante el recorrido y sale por la derecha una vez llega la cámara. La rama
    superior oscila sin mover el fondo. Con movimiento reducido no se anima.
13. En el Hero comprobar la luz azul pastel localizada detrás de la flecha derecha:
    se difumina desde la esquina y no se aplica a las otras escenas. En las fotos,
    arrastrar unos 20 px horizontal, vertical y diagonalmente y soltar: avanza una
    sola foto con la transición de 300 ms. Un arrastre de 12 px vuelve a su sitio.
14. En las Polaroids comprobar a 320 y 440 px y en escritorio: marco 4:5, ventana
    cuadrada llena de imagen, márgenes iguales arriba/laterales y margen inferior
    mayor. Pasar las siete fotos; el marco debe permanecer idéntico y el recorte
    centrado, sin bandas vacías ni estiramiento.
15. Avanzar desde las fotos a la presentación blanca. Ver fecha, frase, contador vivo y
    calendario en una sola parada, con el 19 de diciembre de 2026 marcado. Revisar
    320, 390, 440 y 1440 px, regresar a fotos y repetir con movimiento reducido;
    comprobar que no se duplique una segunda escena de calendario.
16. Desde fecha, pulsar la flecha: comprobar sombrillas, iglesia/jardines
    abajo y detalles en el cielo; ceremonia 2:30 p. m., puntualidad y recepción
    4:00 p. m. marcada como provisional. Probar enlace de recepción, volver al
    panel blanco, teclado y movimiento reducido. Revisar 320, 390, 440 y 1440 px.
17. Fotos ↔ fecha ↔ iglesia: comprobar sombrillas desde los cuatro bordes,
    giro sobre su propio centro y cobertura completa antes de cambiar el fondo.
    La ida y el regreso duran unos 3.66 s, sin zoom ni pausa central. Comprobar posiciones
    irregulares, azulejos arriba/abajo,
    rama abajo a la derecha y calendario completo incluso a 320×568.

Presentación blanca y sombrillas verificadas el 23/09/2026: 51 pruebas frontend
aprobadas. Incluyen cobertura del viewport, cambio del fondo solo bajo cobertura,
bloqueo de clics, regreso, foco y limpieza de ambos temporizadores al desmontar o
activar movimiento reducido. WebKit: 320×568, 390×844, 440×766 y 1440×900 con
calendario completo, sin desbordamiento del contenido. Capturas de cobertura,
ceremonia y noche en `output/playwright/lemon-umbrella-covered.png`,
`lemon-church-after-umbrellas.png` y `lemon-night-preserved.png`. La presentación
de 390 px y todos los recursos nuevos también se comprobaron por Cloudflare.

Historial de verificaciones (las referencias al caballete y sus zooms corresponden
a la versión anterior, sustituida por la presentación blanca el 23/09/2026):

Capilla de referencia actualizada el 23/09/2026: 51 pruebas frontend aprobadas.
WebKit comprobó 320×740, 390×844 y 440×766, la separación entre texto y cruz,
las dos canastillas, y el fundido a la versión nocturna. El túnel público carga
ambos recursos nuevos correctamente. Capturas `output/playwright/lemon-chapel-*.png`.
Prueba manual: llegar a ceremonia, revisar la fachada/escala y ambas canastillas;
avanzar a recepción y volver, comprobando que la composición no salta.
Viento suave verificado en WebKit: comparación entre fotogramas con cambios solo
en los cipreses, sin diferencias en capilla, canastillas o cielo. Ambas capas usan
la misma fase durante el fundido y se retiran con movimiento reducido. 51 pruebas
frontend aprobadas; capturas `output/playwright/chapel-wind-gpu-*.png`.
Prueba manual de viento: permanecer unos ocho segundos en ceremonia y recepción,
observar las copas y comprobar que las bases permanecen en su sitio.

Corrección de frase/recorrido validada el 20/09/2026: 47 pruebas frontend y tres
pruebas backend de renombre/configuración, incluido orden idempotente y conservación
de datos. Playwright: sin texto cortado ni desbordamiento a 320, 390, 440 y 1440 px;
regreso, bloqueo de clics repetidos, llegada y preferencia de movimiento reducido.

Escena de fecha validada el 20/09/2026: 48 pruebas frontend y dos pruebas backend
de configuración idempotente. Por Cloudflare, Playwright comprobó contador vivo,
fecha y día seleccionado correctos, una sola parada compartida, regreso/foco,
movimiento reducido y ausencia de recortes/desbordamientos en 320, 390, 440 y
1440 px. Cero imágenes rotas; capturas `output/playwright/date-public-*.png`.

Capturas en `output/playwright/lemoncello-*.png`. Los avisos de desarrollo de
fetchPriority en LoadingScreen y de autoprefixer en Classic son preexistentes.

Detalles de ceremonia/recepción validados el 20/09/2026: 49 pruebas frontend y
dos pruebas backend de configuración, incluida idempotencia/rechazo de duplicados.
Playwright por Cloudflare: 320×740, 390×844, 440×766 y 1440×900 sin imágenes rotas,
texto fuera del cielo ni desbordamiento; zoom de ida/regreso, foco en el destino,
Tab al mapa de recepción y movimiento reducido. Capturas `output/playwright/events-public-*.png`.

Revisión de cámara y letrero: 50 pruebas frontend. Playwright verificó 320×740,
390×844, 440×766 y 1440×900 sin recortes de escritura ni desbordamiento. Margen
medido 15.98–16.00 px. Proporción letrero/paisaje 0.0342646 y posición normalizada
constantes al inicio, mitad y final del zoom (variación inferior a 0.000001).
Capturas `output/playwright/fixed-camera-*`, `fixed-date-*` y `fixed-wide-*`.

Corrección de nitidez y recorrido simultáneo (20/09/2026): 50 pruebas frontend
aprobadas, incluyendo la equivalencia entre la proyección directa del letrero y
la cámara del paisaje en todo el recorrido. WebKit con emulación iPhone 16 Pro Max
y túnel público: texto sin recortes en 320, 390 y 440 px, ningún ancestro del
letrero escalado/enmascarado, margen abierto de 15.998 px y foco correcto al volver.
En el 10% inicial ya cambian desplazamiento y zoom; la proporción letrero/paisaje
permanece constante (0.0342646). Capturas `output/playwright/sign-public-webkit-*`.

Comprobación manual histórica de la corrección de zoom (ya sustituida):
1. Desde fotos, avanzar: el paisaje se desplaza y amplía desde el mismo inicio.
2. Al llegar, revisar nitidez del día, contador y calendario.
3. Alejar a iglesia y regresar: conservar anclaje, proporciones y texto nítido.
4. Comprobar aparición y desaparición gradual de ambas flechas, e ida/regreso
   entre fotos y letrero de 5.2 s; con movimiento reducido, sin fundidos.
5. Al alejar a iglesia, verificar que el cielo permanece sin texto durante el
   recorrido y que el texto empieza a aparecer al terminar el zoom out.
6. Confirmar que solo se ve ceremonia. Avanzar: ceremonia desaparece, sube una
   chispa y recepción aparece al terminar sobre el mismo cielo claro. Volver a ceremonia,
   probar el mapa de recepción y verificar movimiento reducido.
7. Revisar que paisaje, cámara y cielo claro permanecen iguales al avanzar y volver;
   ambos textos deben ser azul marino con halo y el viento debe continuar sin reiniciarse.

Validación histórica del efecto nocturno anterior (sustituido por cielo claro):
Ceremonia → noche → recepción verificado en WebKit y Chrome: 50 pruebas frontend
aprobadas, incluidos pasos independientes, banderas de visibilidad, bloqueo de
doble clic, regreso y movimiento reducido. Capturas en 320×740, 390×844, 440×766
y 1440×900: sin desbordamiento del texto ni invasión del paisaje; las capas de
día y noche tienen diferencia de posición/tamaño de 0 px. En el túnel público,
la noche comenzó a los 1.67 s, recepción a los 4.03 s, permaneció oculta durante
toda la transición y la cámara mantuvo una sola matriz. Foco correcto al llegar
y regresar, mapa conservado y ningún recurso roto. Capturas
`output/playwright/lemon-public-reception.png`, `lemon-public-ceremony-return.png`
y `lemon-night-chrome.png`.

## Preferencia de entrega

Cambio vigente a cielo claro validado en WebKit con viewport de iPhone 16 Pro Max:
ceremonia → chispa → recepción y regreso conservan la pintura diurna, viento y
cámara. Recepción mantiene tinta azul marino y halo. 51 pruebas frontend aprobadas,
incluidos bloqueo durante la transición, foco y movimiento reducido. Capturas:
`output/playwright/lemon-daylight-ceremony.png`, `lemon-daylight-spark.png` y
`lemon-daylight-reception.png`.

El usuario solicita enlaces de revisión por túnel de Cloudflare, no únicamente
localhost. Comprobar el enlace público antes de cada entrega; los Quick Tunnels
cambian de dominio al reiniciarse. Usar scripts/lemoncello-preview-gateway.cjs
(puerto 3005) para exponer solo la invitación de prueba y sus recursos.

## Hospedaje y descenso desde el cielo — 2026-09-24

Se añade `recommendations` después de `gift_envelopes` (nueve módulos canónicos).
La cámara desciende en 4.8 s desde el cielo nocturno al hotel italiano; el regreso
invierte el viaje y ambos respetan movimiento reducido. El texto se oculta durante
el recorrido y aparece al terminar. La luna, el cielo y una capa adicional de
estrellas conservan las mismas coordenadas del mundo. El hotel aparece solamente
debajo de y=416 del panorama 1897×829, mediante máscara CSS; no se funde a día.

`recommendations-hotel-night-v1` es una ilustración conceptual italiana en acuarela,
no una fotografía ni representación del hotel recomendado. El paisaje se guarda
en `public/images/invitaciones/bodlauser/`; prompts, referencias y procedencia en
`output/imagegen/hotel-recommendations-prompts.json` y `assets/prompts.json`.

Los datos locales usan Casa Hotel Descanso Real y WhatsApp 318 393 1186, publicados
en https://hoteldescansoreal.com/ (consultado 2026-09-24). El enlace tiene prefijo
57 y mensaje preparado sobre hospedaje para la boda de Laura y Sergio; no se envía
ningún mensaje automáticamente. No se recibió imagen de contacto en esta petición.

Validación: 52 pruebas frontend, incluidos contrato en las cuatro plantillas,
enlaces seguros, ida/regreso, foco, bloqueo de clics y movimiento reducido.
El configurador local tiene pruebas de idempotencia y preservación de datos.

Revisión WebKit en 320×568, iPhone 16 Pro Max (440×763) y desktop 1440×900:
contenido sin desbordamiento ni solapamiento con el hotel. Túnel público probado
en navegador: descenso a hospedaje y regreso a sobres conservan noche, sin imágenes
rotas. Capturas: `output/playwright/lemon-hotel-public.png`,
`lemon-hotel-descent.png`, `lemon-hotel-small.png` y `lemon-hotel-desktop.png`.
52 pruebas frontend y 4 pruebas backend (sobres/recomendaciones) aprobadas.

## Vestuario — 2026-09-24

`dresscode` es el décimo módulo canónico, después de recomendaciones. Conserva el
contrato compartido (`title`, `message`, `imageSrc`, `suggestedColors`,
`avoidedColors` y sus títulos). Título «VESTUARIO · ELEGANCIA FRESCA» y los tres
párrafos del usuario completos. Seis figuras en acuarela, tres mujeres a la
izquierda y tres hombres a la derecha, sin novia ni detalles faciales.

Telas sugeridas: salvia, rosa empolvado, durazno, lavanda suave, verde agua y arena
rosada. Reservados: amarillo mantequilla y azul cielo. Las ocho muestras usan el
contrato existente de recortes porcentuales sobre un atlas de telas con pliegues.
Originales PNG con alfa y derivados WebP en `public/images/invitaciones/bodlauser/`
(`dresscode-guests-v1`, `dresscode-fabrics-v1`); procedencia y prompts en
`output/imagegen/dresscode-prompts.json` y `assets/prompts.json`.

Hotel → vestuario: se oculta el texto, diez fuegos escalonados salen de la parte
inferior del hotel y estallan en distintos puntos alrededor del centro superior.
Última explosión termina a 3.79 s; un único resplandor cálido se expande desde
3.8 s, cubre toda la pantalla a 4.5 s y permite cambiar el fondo debajo. A 5.6 s
termina y aparece el texto sobre fondo blanco, los mismos azulejos y la rama de
limones de fecha. La cámara permanece fija. Regreso con fundido blanco de 1.2 s.
Con movimiento reducido, paso inmediato sin fuegos, resplandor ni balanceo.

Validación: 52 pruebas frontend (contratos, cobertura antes del cambio, bloqueo
de doble clic, ida/regreso, foco y movimiento reducido) y 2 pruebas del configurador
local de vestuario (idempotencia, preservación y rechazo de configuración ambigua).
WebKit: 440×763, 390×844 y 1440×900 completos sin scroll; 320×568 permite desplazamiento
vertical interno de 78 px sin desbordamiento horizontal ni barras. Capturas en
`output/playwright/lemon-dress-iphone.png`, `lemon-dress-fireworks.png`,
`lemon-dress-covered.png`, `lemon-dress-320-bottom.png`, `lemon-dress-390.png`
y `lemon-dress-1440.png`.

Prueba manual mínima: avanzar desde hotel, comprobar diez salidas distintas y
cambio cubierto; leer los tres párrafos y comparar las seis telas sugeridas con
las dos reservadas; regresar al hotel y repetir con movimiento reducido.

Túnel verificado en WebKit: llegada a vestuario, seis muestras sugeridas, dos
reservadas, cero imágenes rotas y regreso a hospedaje. Captura pública:
`output/playwright/lemon-dress-public.png`.

## Asistencia después de vestuario (2026-09-24)

`attendance_confirm` es el módulo compartido, orden 11 en seed, preview y DB local.
Título e instrucciones iniciales de Oliva; datos personales y respuestas se leen
de la invitación. No se modifica el contrato ni se crean invitados de relleno.
`configure-attendance.js` valida identidad, respalda y configura de forma
transaccional e idempotente, conservando los demás módulos y las respuestas.

Vestuario y asistencia ocupan dos alturas consecutivas de un contenedor. Siguiente
lo desplaza hacia arriba en 900 ms para entrar al módulo inferior; atrás invierte
el recorrido. Sin fuegos ni fundidos. Foco al destino, doble clic bloqueado y paso
inmediato con movimiento reducido. Flechas abajo/arriba en este tramo.

Asistencia: cielo sólido, adornos suaves en un azul más claro solo en los extremos,
sin azulejos ni plantas. El formulario conserva `AttendanceConfirmView`, con región
interna desplazable, teclado, touch pan-y y overscroll contenido. Tres opciones por
persona y feedback/errores/cierre compartidos. La fecha límite aparece si existe.

Validación: 52 pruebas frontend y 2 del configurador local. WebKit 440×763, 320×568,
390×844 y 1440×900; fixture visual de 24 filas solo en el navegador, llegada hasta
la última, sin scroll del documento ni desbordamiento horizontal. Éxito y rollback
de error comprobados con respuestas HTTP simuladas; no se alteraron confirmaciones
en DB. Túnel verificado hasta asistencia, incluida la validación real HTTP 400 de
un cuerpo vacío. El gateway permite PUT únicamente a la confirmación de
`lausprueba`; otras invitaciones continúan bloqueadas.

Capturas: `output/playwright/lemon-rsvp-iphone.png`, `lemon-rsvp-public.png`,
`lemon-rsvp-scroll-midpoint.png` y `lemon-rsvp-long-320.png`.
Prueba manual: bajar desde Vestuario, recorrer una lista larga, seleccionar una
respuesta y volver con la flecha superior; comprobar la misma ruta con movimiento
reducido. Funcional verificado; aprobación visual del usuario pendiente.

## Cierre, controles circulares y viaje de Vespa (2026-09-24)

El contrato compartido `closing_message` admitía mensaje y marco decorativo.
Ahora admite además `imageSrc`/`imageAlt` opcionales e independientes del marco,
compatibles con Classic, Terracota, Oliva y Lemoncello. Los campos anteriores y
los módulos sin imagen conservan su comportamiento. Configurado al final de
`bodlauser`, orden 12, con el monograma existente, «Te esperamos» y sin marco.
`configure-closing.js` aplica seed/DB local con respaldo, identidad, transacción
e idempotencia; no cambia datos del evento ni confirmaciones.

Lemoncello presenta costa y pueblo italiano lejanos de noche, sin balcón, con
cielo azul marino, estrellas y luna creciente basada en la noche aprobada.
Monograma en el cielo superior derecho, máscara mantequilla con halo centrado
algo más oscuro y texto debajo. Asistencia → cierre avanza horizontalmente
900 ms, con regreso, foco, bloqueo de doble clic y movimiento reducido.

Todos los controles usan `scene-arrow-round-v1`: disco acuarelado beige/marfil,
borde más oscuro y flecha azul corta. Tamaño táctil 48×48; atrás izquierda y
siguiente derecha también en asistencia. Esta indicación reemplaza la orientación
arriba/abajo documentada anteriormente, sin cambiar el recorrido vertical de RSVP.

Vespa 6.8 s con `cubic-bezier(.45,0,.55,1)` compartida por mundo, moto y llantas.
Conserva la distancia y proporciones; inicio/final más lentos que el tramo central.
La apertura sigue durando 3.6 s. La precarga no consume tiempo del recorrido.

Arte generado con la herramienta integrada ImageGen; originales PNG y WebP
en `assets/images/closing-coast-night-v1.*` y `scene-arrow-round-v1.*`. El control
tiene alfa real. Prompts y referencias en `assets/prompts.json` y
`output/imagegen/closing-navigation-prompts.json`.

Validación: 53 pruebas frontend y 10 backend; contratos en las cuatro plantillas,
temporizadores, cierre opcional, navegación de ida/regreso, foco y movimiento
reducido. WebKit en móvil y escritorio; monograma/mensaje dentro del cielo y sin
desbordamientos. Capturas en `output/playwright/lemon-closing-iphone.png`,
`lemon-closing-rsvp-arrows.png`, `lemon-closing-320.png`, `lemon-closing-390.png`,
`lemon-closing-1440.png` y `lemon-closing-public.png`.
Prueba manual: observar la aceleración y frenada del sobre, recorrer hasta RSVP,
comprobar círculos izquierda/derecha y pasar al cierre; regresar y repetir con
movimiento reducido. Funcional verificado; aprobación visual del usuario pendiente.

### Oleaje del cierre (2026-09-24)

`ClosingWater` anima únicamente el mar de la ilustración existente mediante
desplazamiento suave y variación tenue de sus reflejos. La máscara usa coordenadas
del recurso original para conservar costa y barcos al escalar la vista. No cambia
la luna, el cielo, el pueblo ni el monograma. Render a 30 fps, solo en el cierre
visible y detenido al ocultar la pestaña; movimiento reducido conserva la imagen
estática. El original permanece debajo como respaldo si WebGL no está disponible.

Validación: 53 pruebas frontend, navegación/reducción de movimiento y WebKit en
iPhone 16 Pro Max. Dos capturas (`lemon-water-frame-a.png` y
`lemon-water-frame-b.png` en `output/playwright/`) tienen cielo idéntico y cambios
localizados en el agua, sin desbordamiento ni recursos rotos. Túnel HTTP 200.
Estado funcional verificado; aprobación visual del usuario pendiente.

Monograma (2026-09-24): Hero y cierre comparten
`/scrAppaltezza/invitations/bodlauser/cover/laura-sergio-monogram.png`, servido
por el Storage local del backend. El PNG y su original JPG se trasladaron sin
alterar los bytes a `bodlauser/cover`; se retiraron las copias de `public` y de
referencias de plantilla. Seed, preview, script de preparación y ambas referencias
en DB actualizados. El gateway permite este PNG exacto; carga local y por túnel
verificada por hash. No cambia la presentación ni los demás módulos.

### Ajustes editoriales y árbol del sobre (2026-09-24)

Khalifah Script local se registra en el SCSS principal; aplica también a los
títulos de sobres, hospedaje, vestuario, asistencia y al mensaje del cierre.
Cuerpos Cormorant, mensaje de adultos en frase normal y blanco reservado junto
a mantequilla/cielo. El script local `configure-editorial-copy.js` mantiene DB,
seed y preview alineados, con respaldo e idempotencia. Vespa: 6 s, misma curva,
distancia y escala; apertura: 3.6 s.

El desplazamiento anterior del árbol lo dejaba fuera de la cámara. La corrección
activa usa `assets/images/envelope-tree-close-edit-v2.png`: árbol compacto junto
al marco, tronco y maceta visibles en móvil. `scripts/lemoncello-prepare-envelope-tree.cjs`
integra solo la región del árbol y vacía toda la abertura registrada, incluidas
las hojas que antes quedaban dentro. Panorama activo `landscape-open-clear-v3.webp`,
PNG conservado; 2172×724, abertura x1455–1629, y138–492, radio87. Ningún cambio a
cámara, puertas, letrero, Vespa o perro. Prompt de la herramienta integrada ImageGen
en `output/imagegen/lemoncello-tree-close-prompt.json` y procedencia en `assets/prompts.json`.

Verificación: 53 pruebas frontend, alfa interior vacío y píxeles fuera de la zona
editada idénticos en el PNG. WebKit: sobre cerrado/abierto, títulos, colores y
recursos cargados; sin overflow horizontal. Capturas `output/playwright/lemon-tree-close-*.png`
y `lemon-polish-*.png`. Funcional verificado; aprobación visual pendiente.

Vestuario sin scroll (2026-09-24): sustituye la dirección anterior de scroll
interno para este módulo. Sus cenefas superior/inferior usan el 50% de la altura
original; ilustración al 90% de ancho y altura máxima, conservando proporciones.
El contenido queda completo mediante tipografía/paletas compactas en pantallas
cortas. La rama no tapa las muestras. `--stationery-overflow-y` permite a vestuario
usar `clip` mientras fecha conserva su `auto` original. Verificado que el contenido
cabe, sin depender del recorte para ocultar excedentes. Capturas WebKit en
`output/playwright/lemon-dress-fit-*.png`; aprobación visual pendiente.
