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
alfa `/images/invitaciones/bodlauser/laura-sergio-monogram.png`. La fecha y los
nombres siguen saliendo del evento/invitación mediante el resolver compartido;
el monograma pertenece a esta tarjeta y no se impone a otras parejas. La actualización
local repetible es `backend-altezza/seeds/invitation_projects/bodlauser/configure-hero.js`.
`biblical_quote.config.passageText` guarda
“Celebramos nuestro amor y queremos compartirlo con nuestras personas favoritas.”
y passageReference queda vacío. La actualización local repetible es
`backend-altezza/seeds/invitation_projects/bodlauser/configure-envelope.js`: valida
identidad, guarda respaldo y no toca invitados, respuestas, lugares ni fechas.
Se sincronizaron los archivos de seed y preview; no se cambia el contrato compartido.

`welcome_message` sigue al Hero y guarda la misma frase del Word en `config.subtitle`.
`configure-welcome.js` del seed local agrega o actualiza ese módulo de forma
idempotente, con respaldo y sin cambiar el estado de publicación. Su letrero usa
texto HTML editable y conserva la personalización del contrato compartido.

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
- Los medios explícitos del sobre siguen admitidos mediante EnvelopeBackground;
  se respetan video, imagen, imagen desktop, envelopeSrc y monogramSrc. Esos medios
  se presentan con una apertura directa, pues no comparten la geometría del paisaje.
- Con movimiento reducido se muestra la llegada estática y se abre directamente.
  Si falla la carga de arte, la invitación sigue ofreciendo el botón y sus datos.
- El Hero ocupa la esquina superior izquierda. Todas las escenas avanzan
  horizontalmente: Hero en la columna 0, paseo de conexión en la 1, bienvenida
  en la 2 y los siguientes módulos en columnas sucesivas. Las flechas permiten
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
  El letrero de bienvenida está en primer plano con la frase del Word. Durante
  el recorrido se bloquean clics repetidos y al llegar se enfoca el módulo.
  Con movimiento reducido el cambio es inmediato. La frase bíblica conserva
  su estructura básica después de la bienvenida.
- El ancho máximo es 480 px. El fondo exterior plano de Lemoncello es una excepción
  de presentación ya definida para esta tarjeta; las otras plantillas no cambian.

## Recursos

Los originales PNG y sus derivados WebP (alfa en los sprites) están en
`components/invitaciones-publicas/templates/wedding-lemoncello/assets/images/`:
los activos son `landscape-open-alpha`, `vespa`, `door-left-arched`, `door-right-arched`,
`dog`, `vespa-basket-soft`, `majolica-plaque`, `hanging-abrir`, `hero-coast` y
`hero-balcony`, `vespa-wheel-front`, `vespa-wheel-rear`, `hero-bird-flight-v1`,
`welcome-panorama-v1`, `waiter-walk-v1`, `welcome-board-v1` y `scene-arrow-v1`.
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
3. Pulsar la flecha, seguir al mesero hasta la bienvenida, regresar y comprobar
   ausencia de barras/recortes; avanzar de nuevo hasta la frase.
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
11. Comprobar la bienvenida a 320×740, 390×844, 440×766 y 1440×900: el texto cabe
    dentro del letrero, la flecha no lleva etiqueta visible y las escenas se
    conectan horizontalmente. Verificado por Cloudflare el 20/09/2026, incluidas
    apertura, llegada, regreso y reducción de movimiento; sin imágenes rotas.

Capturas en `output/playwright/lemoncello-*.png`. Los avisos de desarrollo de
fetchPriority en LoadingScreen y de autoprefixer en Classic son preexistentes.

## Preferencia de entrega

El usuario solicita enlaces de revisión por túnel de Cloudflare, no únicamente
localhost. Comprobar el enlace público antes de cada entrega; los Quick Tunnels
cambian de dominio al reiniciarse. Usar scripts/lemoncello-preview-gateway.cjs
(puerto 3005) para exponer solo la invitación de prueba y sus recursos.
