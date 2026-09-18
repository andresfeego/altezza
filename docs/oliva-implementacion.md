# Oliva — primera versión local

Plantilla `wedding_oliva` conectada al evento `bodmys` (Mayra & Samuel).

- Invitación de prueba: http://localhost:3002/invitacion/mysprueba/910171
- Backend local: http://localhost:3022
- Fuente de contenido: `docs/tarjeta-mayra-y-samuel.md`.
- Configuración repetible: `backend-altezza/seeds/invitation_projects/bodmys/modules.json` y `seed.js`.
- Respaldo previo frontend: `f883a80`; backend: `1e4f35a`.

## Composición

### Salida elegida: elevar y retirar el sobre

La idea 1 fue elegida y está seleccionada con `ENVELOPE_EXIT_TRIAL = 'lift'` en `index.js`.
El sobre crece un 3,5 %, se eleva, gira suavemente y proyecta una sombra más larga;
después sube y se desvanece. El video de fondo desaparece gradualmente mientras
el hero se revela por debajo. Duración total: 2000 ms. Se conserva el mismo sobre
durante la transición, sin duplicar el video ni sus recursos.

El contenido del hero se pinta debajo pero permanece `inert` hasta terminar;
se conserva la activación de música en el gesto original, se evitan aperturas
duplicadas y se restaura el foco y scroll. Movimiento reducido abre directamente.
`EnvelopeLiftTrial` solo controla duración y bloqueo temporal de entrada; la
animación vive en el SCSS del sobre. No modifica la DB ni las otras plantillas.

La variante anterior sigue disponible como `'light'`. `false` restaura la
apertura inmediata. Todo sigue sin commit, posterior al respaldo indicado abajo.

Prueba manual: recargar, abrir el sobre y observar elevación, sombra y retirada;
al terminar debe quedar el hero enfocado, sin capas que bloqueen la tarjeta.

### Variante anterior: salida del sobre por luz

Respaldo previo a esta prueba: frontend `498f9a6`, backend `07d8f99`. La prueba
queda sin commit y solo afecta a Oliva. `ENVELOPE_EXIT_TRIAL = 'light'` en su
`index.js` permite volver a esta variante.

Al pulsar el sobre, una luz del tono `--oliva-paper` nace en su esquina superior
izquierda real y se expande a toda la ventana, incluyendo el exterior de la
tarjeta en escritorio. La capa usa un portal para evitar el recorte del
contenedor. El sobre se aclara y desaparece; a los 600 ms aparece el hero bajo
la luz opaca, y esta se desvanece hasta retirarse a los 1200 ms.

La señal de música conserva el gesto original del usuario. Se bloquean clicks
repetidos, se restaura el scroll al terminar o desmontar la transición y el foco
pasa al hero. Con movimiento reducido se abre directamente. No hay cambios en
DB, campos de módulos ni otras plantillas.

Validación: 18 pruebas de frontend aprobadas, incluidas apertura única, señal
de música, punto de cambio, limpieza al desmontar y movimiento reducido.
Prueba manual: recargar, tocar el sobre, observar la luz y verificar que al final
el hero queda visible y se puede desplazar la tarjeta; repetir con teclado.

### Secuencia de módulos

Sobre → hero → frase 1 (`biblical_quote`, sin referencia) → familia → ceremonia y frase 3 / recepción y frase 4 → cuenta regresiva → frase 2 y confirmación → cierre configurable.

Oliva usa sus propios componentes, estilos, fuentes locales y adornos botánicos. Los datos personales y los recursos personalizados viven en la configuración guardada. Reutiliza los preparadores de familia, detalles, cuenta regresiva y confirmación; las vistas de familia y celebración pertenecen a Oliva. Las imágenes del sobre y el PNG de fondo del hero se configuran por evento.

### Video de fondo del sobre (16 de septiembre de 2026)

El archivo recibido `Quiero_un_video_de_segundos.mp4` se renombró y movió a
`backend-altezza/_local_storage/invitations/bodmys/cover/fondo-sobre-loop.mp4`.
Conserva el archivo original: 720 × 1280, duración 10,005 s, 6,6 MB. La ruta pública
`/scrAppaltezza/invitations/bodmys/cover/fondo-sobre-loop.mp4` se guarda en
`envelop_intro.config.backgroundVideoSrc`, mediante la migración repetible
`seeds/invitation_projects/bodmys/configure-envelope-video.js`.

Oliva consume el nuevo componente transversal `EnvelopeBackground` con blur de
4 px (token `--envelope-blur`), recorte `cover` y sangrado exterior para evitar
bordes vacíos. La imagen portrait y la wide se conservan como respaldo. El sobre,
monograma, sello, fecha y etiqueta no cambian.

Validación: 17 pruebas de frontend y 6 de backend; reproducción real en navegador
a 440 × 956 y escritorio, sin desbordamiento. Video silenciado en bucle, retirada
del reproductor al abrir; respuestas HTTP 206 para solicitudes parciales. Las
configuraciones completas de Natalia/Andrés y Catalina/Andrés se compararon antes
y después y permanecen idénticas.

Prueba manual: recargar la tarjeta, observar el fondo en movimiento y el sobre
nítido, abrir pulsando el sobre y comprobar que continúa al hero. Con movimiento
reducido debe verse la imagen de respaldo. Un `backgroundVideoSrc` vacío vuelve
al fondo fotográfico sin cambiar la plantilla.

### Hero verde con repuje (16 de septiembre de 2026)

La iluminación ahora incluye un halo cálido derivado de `--oliva-envelope-paper-light`,
sin la mezcla beige del degradado base. Solo el halo recibe `sepia(.45) saturate(1.2)`.
Recorre un arco entre (0 %, 50 %) y (50 %, 0 %) del hero: mitad del borde izquierdo
y mitad del borde superior. Tarda 12 s en cada sentido (24 s por ciclo), con
cambios de dirección suaves. Una capa radial localizada al 70 % en modo `screen`
ilumina papel y flores, por debajo del grano, texto y monograma. No cambia el
color base ni reemplaza la textura. Se redujo la capa de 160 × 140 % a 100 × 100 %
del hero y se intensificó su núcleo: la primera versión al 34 % se confundía con
el degradado fijo. Las sombras del relieve y del monograma
cambian suavemente de derecha a abajo para acompañar el recorrido.

El movimiento solo se activa con `prefers-reduced-motion: no-preference`.
Con movimiento reducido el brillo queda fijo arriba a la izquierda; en alto
contraste se omite. Es presentación de Oliva, sin campos nuevos ni cambios de DB.
Prueba manual: abrir, observar el brillo al menos 12 segundos y comprobar su
retorno; textos nítidos, flores visibles y ningún desbordamiento en móvil.

`HeroOliva.js` consume el contrato existente de `hero_image_1`. El PNG de
`backgroundImage` se utiliza como máscara alfa con superficie verde, luz arriba
a la izquierda y sombra abajo a la derecha. La composición floral se genera como
recurso de esta tarjeta y su ruta se guarda en DB; no se importa desde la plantilla.
Se conserva el relieve elevado original, con la luz clara reducida de 52 % a 48 %.

El fondo aproxima el papel mate del sobre con capas independientes en
`HeroOliva.module.scss`: tono oliva, iluminación suave mediante degradados,
fibras y grano fino. `--hero-paper-*` controla color, intensidad y escala.
Los dos SVG de `assets/images/paper-{fibers,grain}.svg` generan ruido monocromo
con `feTurbulence`; son decoración de la plantilla, sin datos del evento.
Las fibras se mezclan al 28 % y el grano al 24 % mediante `soft-light`.
El color usa muestras medias de zonas del PNG del sobre: base `#5b6531`,
luz `#606b33` y sombra `#515a2b`, declaradas como tokens `--oliva-envelope-paper*`.
Reemplazan la mezcla inicial del verde del interior con luz beige, que resultó
demasiado clara y grisácea. Los filtros SVG trabajan en `sRGB` para que su ruido
neutral no aclare el papel por la conversión desde el espacio lineal predeterminado.
El grano también cubre las flores para unificar el material; texto y monograma
quedan por encima, nítidos. En alto contraste se omiten las capas decorativas.

Validación de esta textura: Sass compilado, revisión visual a 440 px en el
navegador integrado y a 1920 px en Chrome por el túnel, sin desbordamiento.
Ambos SVG responden HTTP 200 localmente y por el enlace público. Este ajuste
no modifica datos, contratos, orden ni el módulo del sobre.

`text1` sigue mostrando la frase configurada, a 20 px en móvil y 24 px desde
768 px mediante tokens, en beige. `logoImage` ocupa el lugar de los nombres visibles, conservando el nombre
del evento como texto alternativo del encabezado. Sin logo, los nombres siguen
disponibles como texto visible. La fecha conserva su formato y Cormorant, a 24 px en beige.
Se quitaron las guirnaldas superiores e inferiores de esta vista. El sobre no cambió.

La tarjeta conserva un ancho máximo de 480 px, centrado desde 768 px, como
Classic y Terracota. `paper` llena ese contenedor sin padding ni margen: los
fondos de los módulos llegan a los bordes de la tarjeta, no a los de la pantalla
de escritorio. En móvil ocupa el ancho disponible. La ruta pública siempre
envuelve todas las plantillas en `AnimatedDesktopBackground`; se retiró la
excepción que lo omitía para Oliva. El fondo animado compartido queda visible
fuera de la tarjeta en escritorio.

El sobre responde al ancho del contenedor `oliva-card` mediante container
queries y `cqw`, evitando que los tamaños de escritorio superpongan su etiqueta
y sello dentro de la tarjeta estrecha. Conserva recursos, paleta y apertura.

El hero agrupa frase, monograma y fecha con alineación central y separaciones
de 32 px (40 px desde 768 px). El monograma crece hasta 288 px; una compensación
óptica de -2 % en horizontal y +4 % en vertical equilibra la distribución del
dibujo sin girarlo. Su sombra cae 3 px a la derecha y 4 px abajo, con 3 px de
desenfoque y verde casi negro al 45 %, derivada del token de borde. El fondo
usa un degradado diagonal de 135° entre el tono claro del sobre, el medio y el
oscuro, coherente con esa dirección de luz. El grano conserva su escala reducida
al 50 %: mosaicos de 64 px y 96 px para grano y fibras.

Validación del encuadre: revisión visual a 320, 440, 1280 y 1920 px, sin
desbordamiento horizontal. Límites de los siete módulos coincidentes con los
bordes de la tarjeta; sin padding exterior superior o inferior. Comprobar
manualmente la tarjeta centrada de 480 px en escritorio, el fondo común a ambos
lados, la apertura del sobre y la continuidad de las secciones sin borde beige.

El archivo del evento es `bodmys/hero/floral-relief-v1.png`, PNG RGBA 1024 × 1536.
La migración local repetible es `seeds/invitation_projects/bodmys/configure-hero.js`
en backend; actualiza únicamente las rutas `backgroundImage` y `logoImage` y guarda
un respaldo del JSON anterior. El prompt y la ruta completa del recurso están en
`seeds/invitation_projects/bodmys/HERO-ASSETS.md`.

Verificación: 14 pruebas de contratos aprobadas, ESLint de las vistas modificadas
sin errores y recursos HTTP 200. Revisión visual a 320 px, 440 px y escritorio:
PNG con repuje, monograma sin nombres duplicados, fecha legible, sin imágenes rotas
ni desbordamiento horizontal. La apertura mantiene el foco en el encabezado.

La fecha límite es exclusiva: `2026-11-19T00:00:00-05:00`. Se muestra el último día permitido, 18 de noviembre. Las horas de ceremonia y recepción son respectivamente `2026-11-28T15:00:00-05:00` y `2026-11-28T16:30:00-05:00`.

## Contratos compatibles

Se mantienen las rutas existentes de configuración y lectura pública. La auditoría
identificó campos exclusivos de Oliva que no eran compatibles con las otras
plantillas. Se corrigieron y documentaron en [Contratos compartidos](invitaciones-contratos-compartidos.md).

- `hero_image_1` usa `text1`, `backgroundImage` y `logoImage`, con nombre y fecha del evento. No incluye introducción ni foto editorial. Los nombres completos se conservan en el documento de contenido.
- La frase 1 está en `biblical_quote.passageText`, con `passageReference: ""`; reemplaza a `welcome_message` en la posición 3. La frase 2 está en `attendance_confirm.helperText`, junto con las instrucciones.
- `couple_family` utiliza `coupleLabel` y las listas existentes; la frase 3 pasó a `event_details.ceremonyMessage`.
- `event_details` comparte direcciones, enlaces y frases opcionales con Classic y Terracota. Las coordenadas del lugar tienen prioridad; los enlaces del config son respaldo cuando faltan coordenadas. Cada actividad muestra fecha y hora.
- `closing_message` controla el cierre mediante `enabled` y `order`; su marco es opcional en todas las plantillas.
- `envelop_intro` conserva sus recursos visuales y sus datos básicos sin cambios. Las rutas de imágenes siguen en config; `invitationLabel` conserva su prioridad sobre el label de la invitación.

La respuesta pública añade `invitacion.confirmationClosed`. La confirmación devuelve HTTP 409 si el plazo ya venció; 400 si la respuesta está vacía, tiene opciones inválidas o integrantes repetidos; 404 si hay integrantes ajenos. Valida todo el lote antes de escribir y guarda en transacción. Eventos sin fecha límite siguen abiertos. El reloj del servidor es la autoridad; el navegador también desactiva los controles al vencer el plazo y ante un 409.

La conexión MySQL sincroniza su zona de sesión con el decodificador mysql2 (`ALTEZZA_DB_TIMEZONE`, por defecto `-05:00`). Esto evita interpretar TIMESTAMP con cinco horas adicionales respecto de DATETIME. Los lugares sin coordenadas usan el enlace de respaldo del módulo si existe; si no hay coordenadas ni enlace, devuelven null, sin inventar un punto 0,0.

### Sustitución de bienvenida por frase

El texto de la frase se aumentó un 20 % solo en Oliva: 16 → 19,2 px, mediante
`interior.module.scss`. Se conservan los márgenes y el ancho del estilo común
usando composición de clases. Los textos del hero mantienen su tamaño original.

`seeds/invitation_projects/bodmys/replace-welcome-with-quote.js` traslada la frase
guardada de la bienvenida al módulo `biblical_quote`, conservando su posición y
activación. La referencia queda vacía y la vista compartida ya la omite; no se
modifican los resolvers ni las vistas de ninguna plantilla. La migración local
respalda el JSON y actualiza únicamente la configuración de este evento.

Verificación: 15 pruebas frontend y 5 backend aprobadas, incluida referencia vacía
en las tres plantillas, referencia presente conservada y migración repetible.
API y seed coinciden; otras tarjetas, módulos, datos del evento e invitados y
respuestas comparados antes/después sin diferencias. Revisar debajo del hero que
aparezca únicamente la frase y no un título, destinatario o referencia.

## Recursos pendientes

Música y galería están desactivadas. Para incorporarlas se completan sus recursos y configuración; no necesitan otro evento. La foto editorial se configura en `simple_image` o `hero_image_2`. Vestuario, regalos, solo adultos y los demás módulos del catálogo ya tienen vista en Oliva; permanecen fuera de esta tarjeta hasta contar con contenido.

La vista previa para compartir usa `public/invitations/oliva/mayra-samuel-cover.png` (1200 × 630). No se envió ninguna invitación ni se desplegó a LAB/producción. El campo `published` permanece falso; la ruta pública existente no aplica ese campo como control de acceso. La prueba está limitada al entorno local.

## Revisión de textos pendiente

Se conservaron todos los textos enviados. Observaciones para confirmar con el usuario:

- Frase 4: falta `¡` antes de “prepara”; conviene separar la primera oración con punto.
- Frases 2 y 3: las oraciones unidas por coma admiten un punto o punto y coma para mejorar lectura.
- “Lucia”, “Maria” y “Rodriguez” normalmente llevan tilde: Lucía, María, Rodríguez. Confirmar escritura de nombres antes de cambiarlos.
- “hagas parte de celebrar nuestro amor” puede simplificarse a “celebres nuestro amor con nosotros”, solo si se autoriza una revisión de estilo.

## Verificación manual

### Límites de módulos para depuración visual

Al igual que Clásica y Terracota, Oliva dispone de `TEMPLATE_DEBUG` al principio de `components/invitaciones-publicas/templates/wedding-oliva/index.js`:

- `true`: muestra el nombre técnico y un contorno rojo sobre el contenedor exterior de cada módulo.
- `false`: oculta nombres y contornos.

Se deja activado durante la revisión visual. No cambia datos, orden, contratos ni respuestas de asistencia. `ModuleFrame` delimita el sobre, cada módulo del interior y el cierre `footer`. La música permanece fuera del flujo de secciones, igual que en las otras plantillas. Los nombres tienen `aria-hidden` y tanto las etiquetas como los contornos dejan pasar los clics.

Los estilos están aislados en `debug.module.scss`. El contorno se dibuja en una capa superpuesta, también visible sobre el fondo del sobre, sin añadir tamaño o espaciado. Al apagarlo se conservan los mismos contenedores. Verificado el encendido/apagado y las dimensiones de los seis bloques del interior: no cambian respecto a la composición anterior.

Para probar: abrir el sobre, recorrer los módulos y comprobar sus límites; cambiar la constante a `false` para volver a la vista sin marcas. No se necesita modificar la base de datos.

### Flujo de la invitación

1. Abrir la URL, pulsar Abrir invitación y comprobar foco en los nombres.
2. Revisar a 390 px y en escritorio: nombres, fechas, familia y ausencia de scroll horizontal.
3. Comprobar ambos enlaces y que se muestran las 3:00 p. m. / 4:30 p. m.
4. Confirmar un integrante de prueba, recargar y verificar persistencia. Un fallo restaura solo la respuesta de ese integrante.
5. Verificar que no hay audio ni fotos rotas mientras los módulos están desactivados.
6. Revisar imagen OG, título, navegación por teclado y movimiento reducido.

Pruebas automatizadas backend: `RUN_ALTEZZA_INTEGRATION=1 node --test tests/invitation-attendance.test.js tests/invitation-public.integration.test.js`. La integración crea datos temporales locales y los elimina; no modifica el evento real.

## Resultado de validación (14 de septiembre de 2026)

- Compilación completa Next.js: aprobada. Se corrigió un retorno anticipado anterior a hooks en el calendario compartido que bloqueaba la compilación; no cambia su composición visual.
- Backend: cuatro pruebas aprobadas, incluyendo integración real de guardado, rechazo atómico de lotes inválidos, 409 por vencimiento y conversión correcta de TIMESTAMP.
- Navegador: confirmación persistente tras recarga, restauración de respuesta ante HTTP 500, bloqueo ante HTTP 409, enlaces de mapas correctos, móvil sin desbordamiento e imágenes sin errores.
- Clásica y terracota: rutas existentes cargadas con HTTP 200 y sin excepciones JavaScript de página.
- Seed ejecutado dos veces: conserva los mismos IDs y dos integrantes de prueba, sin duplicarlos.
- Quedan advertencias preexistentes de lint/estilos y de `fetchPriority` en el LoadingScreen compartido; no bloquean la compilación.

### Corrección de compatibilidad con iPhone

El iPhone formateaba el período como `p.m.` mientras Node generaba `p. m.`, provocando un error de hidratación. Oliva ahora usa `formatTimeInColombiaStable`: obtiene hora y minuto numéricos en America/Bogota y compone explícitamente el texto. No se oculta el error ni se desactiva SSR.

Validación: siete casos de hora (ceremonia, recepción, medianoche, mediodía, minutos y entradas vacías/inválidas), lint de los archivos cambiados y carga del enlace público en WebKit con emulación de iPhone 15 sin errores de página; ambas horas coinciden al abrir la invitación.

### Prueba de repujado en el hero (15 de septiembre de 2026)

Los nombres y el ampersand del hero usan un acabado marfil del mismo tono que el papel, un contorno fino y tres sombras que forman luz, contacto y profundidad. El efecto está limitado a `.coupleNames` en la hoja de Oliva; mantiene el texto HTML, las fuentes y la composición actuales. Los parámetros `--oliva-emboss-*` permiten ajustar la intensidad. En modos de mayor contraste o colores forzados vuelve al texto sólido.

Revisión manual: abrir la invitación y comprobar los nombres en escritorio y a 390 y 320 px, con atención a los bordes y a posibles desbordamientos. Las tres vistas se revisaron en Chrome; no se detectó desbordamiento horizontal en móvil. Permanece el aviso preexistente de `fetchPriority` en LoadingScreen.

### Allura local para los nombres

La fuente y su licencia se movieron desde `backend-altezza/_local_storage/invitations/bodmys/fonts/Allura/` a `components/invitaciones-publicas/templates/wedding-oliva/assets/fonts/Allura/`. El `@font-face` de Oliva usa una ruta relativa: Next empaqueta el TTF en `/_next/static/media/`, disponible también por el túnel.

Allura se aplica al hero mediante `--oliva-script`, conserva el repujado, usa espaciado natural y evita cursivas artificiales. El tamaño del título se escala respecto al token existente para compensar la menor altura de las letras de Allura. Para revisar: recargar, abrir la invitación y comprobar los nombres y el ampersand en móvil y escritorio.

### Corrección de Safari y repujado móvil reforzado

Se reprodujo en Safari de macOS el problema de la captura del iPhone: `paint-order: stroke fill` con un contorno fino semitransparente dejaba las sombras casi invisibles. Al cambiar únicamente a `paint-order: normal`, Safari volvió a dibujar el relieve sobre la forma completa de las letras.

En anchos inferiores a 768 px, el relieve usa profundidad de 1.215 px, sombra de contacto al 55.8 %, sombra difusa al 21.6 % y contorno al 28.8 %. La cara de las letras mezcla un 92.8 % de papel con un 7.2 % de tinta para conservar legibilidad. Estos valores reducen un 10 % la profundidad y la intensidad oscura de la primera versión reforzada. Escritorio mantiene los parámetros de intensidad anteriores; los modos de alto contraste mantienen texto sólido.

Validación manual: reproducción y corrección visual en Safari de macOS; carga de Allura y revisión del enlace público en Chrome a 440 × 763 y a 320 × 740, sin desbordamiento horizontal. El ancho de 440 px corresponde al perfil de iPhone 16 Pro Max en los [descriptores de Playwright](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json). La comprobación no sustituye la revisión en el iPhone físico del usuario.

### Sobre con recursos del evento

`EnvelopeOliva` compone el fondo `fondo01portrait.png` con desenfoque gaussiano CSS de 6 px (reducido desde 8 px), el sobre verde y el monograma con repujado. Las tres rutas se reciben desde `envelop_intro.config` mediante `backgroundSrc`, `envelopeSrc` y `monogramSrc`; los originales permanecen en `_local_storage/invitations/bodmys/cover/` del backend. El seed de `bodmys` conserva esta configuración. El PNG del sobre se encuadra mediante CSS para que su margen transparente no reduzca el área visible ni la zona de clic.

En escritorio (desde 1024 px), un elemento `picture` selecciona `fondo01wide.png` mediante `backgroundDesktopSrc`. Pantallas menores usan `fondo01portrait.png` (941 × 1672) mediante `backgroundSrc`; sustituye el fondo cuadrado sin cambiar el componente. Ambos mantienen el desenfoque de 6 px y el encuadre `cover`. Validado en Chrome a 1440 y 440 px: `currentSrc` selecciona la imagen correspondiente, ambas cargan correctamente y no hay desbordamiento horizontal. El archivo portrait también responde HTTP 200 por el túnel público.

El monograma ocupa la zona superior de la solapa y «Abrir» queda cerca de su punta. La etiqueta real de la invitación aparece sobre la fecha, con mayor tamaño. Todo el sobre es un botón nativo: admite clic, toque, Enter y espacio; conserva la apertura existente y el foco posterior en el título del hero. El movimiento de hover respeta la preferencia de movimiento reducido.

La etiqueta y la fecha del sobre usan el beige secundario `--invitation-beige` (`#f3f0eb`), compartido con el interior. La etiqueta usa Allura regular y la fecha Montserrat Light (300), ajustable mediante `--envelope-date-weight`. El repujado del monograma mantiene sus propios colores y tamaño.

`assets/images/sello-lacre-abrir-v1.png` reemplaza el texto Abrir: sello dorado de 1254 × 1254 con fondo alfa transparente, ramas en relieve y ABRIR en el arco superior. Su centro está al 64 % de la altura en móvil y al 67 % desde 768 px. Su ancho base es el 18 % del sobre, limitado por el token de 96 px; `--envelope-seal-scale: 1.2075` aplica los aumentos sucesivos del 15 % y del 5 % sobre ambos límites. Por debajo de 375 px la base es 16 % y se compacta el espacio entre etiqueta y fecha para evitar cruces. El sello no intercepta eventos: todo el sobre sigue siendo un botón con nombre accesible y foco en el hero al abrir. El prompt original está en `assets/images/GENERACION.md`.

En móvil (menos de 768 px), el sello se reduce un 10 % adicional mediante `--envelope-seal-scale: 1.08675`. Desde 768 px conserva `1.2075`. Se comprobó a 440 px un ancho de 79.8 px; escritorio mantiene 115.92 px de ancho máximo.

La etiqueta del sobre tiene un ajuste óptico hacia abajo solo en móvil: 0.3 veces su tamaño de fuente (aproximadamente 5 px a 320 px y 6 px a 440 px), para equilibrar el espacio visible entre el borde inferior del sello y la fecha. Se mantiene fija la posición del sello y la fecha; escritorio conserva su composición.

Las tres familias de Oliva son ahora Cormorant, Montserrat y Allura. Cormorant y Montserrat se copiaron de los assets locales del evento a `assets/fonts/`, conservando originales y licencias OFL. Se usan versiones variables normales y cursivas con carga local; sustituyen Libre Baskerville y Caviar Dreams mediante los tokens serif/sans de esta plantilla. Allura conserva su archivo y uso. Las demás plantillas no cambian.

Validación del sello y fuentes: lint del componente sin errores; vistas a 320, 440 y 1440 px sin desbordamiento ni cruce del sello con etiqueta/fecha; apertura correcta con foco posterior en los nombres. Estilos computados y carga de Cormorant/Montserrat confirmados en el navegador. El sello y ambas fuentes normales responden HTTP 200 desde el túnel público. Prueba manual: recargar el enlace, comprobar el sello, la etiqueta Cormorant y la fecha Montserrat; pulsar cualquier punto del sobre para abrir.

La sombra exterior simula elevación con luz desde arriba a la izquierda: desplazamiento de 16 px a la derecha y 32 px hacia abajo, desenfoque de 24 px y expansión negativa de 8 px. La contracción evita el halo alrededor de toda la silueta. Usa `--oliva-shadow-ink` (`#111911`, verde casi negro) al 64 % y dimensiones derivadas de los tokens de espaciado. Esta intensidad refuerza la primera versión, que resultaba demasiado tenue.

Validación: lint de los tres archivos JavaScript aprobada; imágenes cargadas desde el enlace público; revisión visual en escritorio y a 440 y 320 px en Chrome. Se ajustó el tamaño mínimo de la etiqueta para evitar que se superponga a «Abrir» a 320 px. Se comprobó apertura desde una esquina del sobre y con teclado, foco visible y ausencia de desbordamiento horizontal.

También se revisó la composición y la apertura del enlace público en Safari de macOS, con foco en el título al abrir. Una pestaña local anterior quedó en blanco al recargar; la comprobación en una pestaña nueva con el enlace público cargó correctamente.

### Interior botánico de referencia (16 de septiembre de 2026)

El interior adopta beige `#f3f0eb` y verde oliva `#767c5a`, tomados de la referencia entregada. La apertura, los lugares y el cierre usan papel beige; la familia, la cuenta regresiva y la confirmación usan bloques verdes continuos. Los arreglos botánicos enlazan las superficies. Se conservan los datos, el orden de los módulos, las ubicaciones, la apertura y la lógica compartida de asistencia.

`interior.module.scss` contiene esta presentación y limita la nueva paleta al interior abierto. Allura permanece en los nombres y títulos, ahora en oliva sobre beige y beige sobre verde. La fecha presenta el día entre mes y año, y los lugares usan iconos de ceremonia y recepción. Las imágenes de pareja y la música siguen dependiendo de los recursos reales del evento y su configuración.

Se generaron tres recursos con la herramienta integrada `image_gen`: `floral-garland-v1.png`, `floral-sprig-v1.png` y `cotton-paper-v1.png`. Se guardaron en `components/invitaciones-publicas/templates/wedding-oliva/assets/images/`, junto con los prompts completos en `GENERACION.md`. Las flores conservan transparencia; la textura se aplica con opacidad reducida. `BotanicalArt.js` consume las rutas de imagen del cargador `next-images` de este proyecto y declara sus dimensiones para reservar espacio antes de la carga.

El componente del sobre, su hoja de estilos y la hoja raíz anterior se mantuvieron sin cambios; se verificó su identidad con los archivos previos mediante SHA-256 y comparación directa. No hubo cambios de backend para esta revisión visual.

Validación: lint de los dos archivos JavaScript sin errores; revisión visual en el navegador integrado a 320, 440 y 1440 px, sin desbordamiento horizontal. A 320 px se ajustaron títulos, fecha y espacio de la cuenta regresiva. El enlace público responde HTTP 200 y carga las flores, Allura y la textura; el botón del sobre abre el interior y lleva el foco a los nombres. Se comprobaron los dos enlaces de Maps sin modificar respuestas de asistencia. Permanece la advertencia preexistente de `fetchPriority` en el LoadingScreen compartido. Esta revisión responsive no sustituye una prueba en un iPhone físico.

### Repujado del monograma

El PNG transparente original sirve como máscara alfa de tres capas: sombra inferior derecha, luz superior izquierda y cara del relieve. La cara reutiliza la misma imagen y coordenadas del sobre, con brillo al 109 %, para conservar el grano alineado del papel. Las capas de luz y sombra se suavizan desde sus contenedores, después de aplicar la máscara, y no reciben eventos del puntero.

El monograma ocupa el 22 % del ancho del sobre (antes 18 %), conserva su posición superior del 8 % y usa profundidad de 1 px en móvil y 1.2 px desde 768 px. Los parámetros `--monogram-*` son independientes del repujado del hero. Se incluyen las propiedades `-webkit-mask-*`; el PNG blanco queda como alternativa si faltan las máscaras o la textura, y en modos de mayor contraste o colores forzados.

Validación: lint del componente aprobada; revisión visual en Chrome a 1440, 440 y 320 px; imágenes cargadas, ausencia de desbordamiento a 320 px y apertura con Enter desde el botón enfocado. En Safari de macOS, una ventana nueva mostró el relieve y permitió abrir el sobre con foco posterior en el hero; algunas pestañas anteriores permanecieron en blanco al recargar. La textura y la máscara usan los recursos existentes, sin modificar archivos de imagen ni la configuración del evento.

## Verificación de la alineación (16 de septiembre de 2026)

- Checkpoint previo: frontend `aa84754`, backend `c280f70`.
- Configuración local migrada con `align-data.js`; se respaldó el JSON previo en una carpeta temporal. Se compararon antes/después el sobre, el evento, los invitados y sus respuestas: sin diferencias.
- 11 pruebas de contratos/render SSR del frontend y 2 pruebas del backend aprobadas. Cubren campos de heroes, catálogo de módulos, contenido, mapas, fechas diferentes, cierre desactivado/reordenado y migración idempotente.
- Lint y compilación Sass aprobados. API y página responden 200, invitación inexistente 404. Los enlaces de Maps llegan en los campos canónicos y el payload coincide con `modules.json`.
- Revisión de Oliva en navegador a 320, 440 y 1440 px, sin desbordamiento horizontal. Apertura del sobre, frases en sus módulos, fechas y cierre verificados. Sin modificaciones al componente, estilos ni recursos del sobre. Permanece el aviso anterior de `fetchPriority` en `LoadingScreen`.

Comprobación manual: abrir el sobre, revisar la separación entre hero y bienvenida,
comprobar ambas ubicaciones y sus frases, y revisar el cierre. Las pruebas de
compatibilidad renderizan la misma configuración con Classic, Terracota y Oliva;
no cambian la plantilla de ningún evento guardado.

## Corrección de fondo y textos fijos

La captura de textos superpuestos coincidía con la imagen SEO que ya contiene
los nombres y la fecha dibujados. Se eliminó el respaldo automático desde esa
imagen en ambos heroes. La invitación actual usa su fondo limpio explícito.

Los títulos de familia/lugares y los mensajes de cuenta regresiva ahora están
guardados en la configuración de `bodmys`. Se retiró el encabezado fijo
«Nos encantará verte»; el título e instrucciones de asistencia ya vienen de DB.
Los textos editoriales de las otras vistas compartidas también son opcionales,
con el mismo contrato para las tres plantillas. Ver contratos compartidos.

Validación: 13 pruebas frontend y 4 backend aprobadas, incluyendo ausencia de
respaldo SEO, fondos vacíos, textos personalizados/vacíos y migración idempotente.
Lint sin errores; permanecen dos advertencias anteriores en cleanup del sobre de
Classic/Terracota. La migración preservó evento, invitados, respuestas, hero,
confirmación y sobre; solo agregó cuatro campos de texto ausentes.

## Foto vertical entre el hero y la frase

La foto aprobada usa `simple_image`, con su ruta y descripción en la configuración
de `bodmys`, ordenada después del hero y antes de la frase bíblica. En Oliva se
presenta sin margen ni padding, ocupando todo el ancho
del contenedor de la tarjeta y con encuadre vertical 4:5. El recorte centrado usa
`object-fit: cover` en CSS; conserva el archivo de 6000 × 4000 y no modifica los
datos del módulo ni las otras plantillas. El ancho máximo de la tarjeta en
escritorio se conserva.

Comprobación manual: abrir el sobre y verificar la secuencia hero, foto y frase;
comprobar
que ambos rostros estén completos, que la foto llegue a los bordes de la tarjeta
y que no haya desbordamiento horizontal en móvil y escritorio.

## Jerarquía visual de la familia

Los títulos de grupo usan Montserrat de 12 px y peso 600, en mayúsculas; los
nombres usan Cormorant de 24 px y peso 400. Se separan por 16 px, con 8 px entre
personas y 48 px entre grupos. Los tamaños y espacios utilizan tokens del
proyecto. Los grupos conservan una columna también en escritorio, porque el
ancho de la tarjeta es estrecho y dividirlo cortaba los nombres en demasiadas
líneas. Allura mantiene el título principal de la sección.

Es una mejora visual exclusiva de Oliva, sin cambios en campos, textos guardados
ni comportamiento del módulo. Comprobación manual: revisar los tres grupos en
móvil y escritorio, con nombres legibles y sin desbordamiento horizontal.

## Módulo independiente de nombres

`couple_names` aparece después de la familia y antes de `countdown`, con los nombres en `config.brideName`
y `config.groomName` de la base de datos. Solo presenta los dos nombres y `&`;
no incorpora frases o fechas de la referencia. Comparte contrato y vista base
con Classic y Terracota. Oliva añade la caligrafía WindSong local, texto blanco y
el paisaje fotográfico de `config.sectionBackground`. El velo beige con textura
es `coupleNamesModule::before` y recibe `overlayOpacity` mediante
`--module-background-opacity` (valor actual de `bodmys`: `0.1`). Este módulo
desactiva el velo adicional de `ModuleSurface` para que la opacidad se aplique
una sola vez. Sin fondo configurado, la textura conserva su opacidad original
de `0.35`. Las dos ramas se retiraron de este módulo; sus archivos se conservan.

Fuente y licencia: `assets/fonts/WindSong/`. Recursos y prompts completos:
`assets/images/COUPLE-NAMES-GENERACION.md`. Se generaron con `image_gen` integrado
y sus PNG finales viven junto a los otros recursos de la plantilla.

Validación manual: abrir el sobre, revisar el orden familia → nombres → lugares,
la carga de la fuente y el fondo, y que los nombres se lean completos en móvil
y escritorio. Las pruebas de contrato cubren las tres plantillas, nombres vacíos,
un solo nombre, desactivación, escape de HTML y migración idempotente.

## Fecha opcional y calendario después de los nombres

El orden de `bodmys` es `couple_names` → `countdown` → `save_the_date_calendar`
→ `event_details`. La fecha se muestra con `countdown.config.showDate: true`;
si falta o es falso, desaparece solo la composición de fecha. La cuenta sigue
funcionando. Es una opción compartida por Classic, Terracota y Oliva; las
configuraciones anteriores mantienen su aspecto sin activarla.

La fecha del contador usa su `target` (ceremonia o recepción). El calendario
existente usa la ceremonia. Ambos coinciden en esta tarjeta. Día, mes, año y
día de la semana se derivan en `America/Bogota`, sin fechas duplicadas en config.
`Faltan` es el título guardado en DB; `El gran día` es el `message` del calendario.
El mensaje del contador y su mensaje final conservan el contenido configurado.

Oliva compone los dos módulos sobre papel verde continuo con grano fino, texto
beige, Cormorant y el número del día en Allura. El calendario conserva la vista
compartida; Oliva selecciona abreviaturas de tres letras, corazón de contorno y
números estáticos. Classic/Terracota conservan su animación y sus etiquetas.
El estilo específico está en `DateModulesOliva.module.scss`.

Validación: activar/desactivar `showDate` en las tres plantillas; fecha inválida
sin error de render; fecha próxima a medianoche respetando Colombia; cambio al
mensaje final solo cuando llega la hora real; calendario con el 28/11/2026 en
sábado; orden desde API y conservación del JSON de otras tarjetas; lectura sin
desbordamiento en móvil y escritorio.

## Jerarquía visual de lugares y horarios

El módulo `event_details` conserva datos, orden y enlaces. Su título editorial
usa Allura; las categorías Ceremonia/Recepción usan Montserrat 12/600 en
mayúsculas, y los lugares Cormorant 24/400. La hora queda en 20/500, la fecha en
Montserrat 12/400, la dirección en cursiva 14 y los mensajes en 16 con mayor
interlineado. Los botones usan Montserrat 12/500. Los cambios viven únicamente
en `interior.module.scss`, con selectores propios de Oliva.

Validación manual: revisar la jerarquía de ambos lugares en escritorio y móvil,
comprobar ausencia de desbordamiento a 320 px y conservar los dos enlaces de
Google Maps. Sass compila sin errores.

## Apertura del sobre sin frenadas intermedias

La salida mantiene 2000 ms. El movimiento usa una sola interpolación de inicio
a fin con `cubic-bezier(.55, .02, .75, .35)`, en lugar de reiniciar la curva en
los pasos del 24 % y 40 %. El desvanecimiento tiene una animación independiente;
no introduce puntos de frenado en la transformación. Durante la apertura se
anula la transición del hover. Se conservan la sombra, la inclinación, el
bloqueo temporal de interacción y la apertura inmediata con movimiento reducido.

Verificación: Sass, prueba existente de apertura única/limpieza de temporizadores,
apertura completa en escritorio y móvil, duración computada de 2 s y recuperación
del scroll al mostrar el hero.

## Detalles sin flores y asistencia con relieve botánico

Se retiraron las dos decoraciones florales de `event_details`; se conserva la
jerarquía de ceremonia, recepción, lugares y enlaces. Su espacio inferior pasa
a ser relleno de sección, sin una imagen vacía.

En asistencia, `AttendanceFlowerOliva` sustituye al calendario con corazón.
Usa `rsvp-flower-mask-v1.png`, blanco con alfa real de 1254 × 1254, como máscara
decorativa. Las capas CSS producen luz superior izquierda, sombra inferior
derecha y una cara verde ligeramente aclarada. Mide 96 px y no contiene texto
ni datos del evento. El prompt y las referencias están en
`assets/images/RSVP-FLOWER-GENERACION.md`.

El título usa Allura 48 px (40 px en pantallas menores de 375 px), los nombres
Cormorant 24 px y las opciones Montserrat 12/500. Los controles tienen un alto
mínimo visible de 32 px con `border-box` y relleno de 4 px; el área táctil se
extiende hasta 48 px mediante un pseudo-elemento transparente. El grupo tiene
un ancho máximo de 288 px, distribuido en tres columnas, con foco
visible y estado seleccionado beige. Se elimina el relleno duplicado de la
vista compartida dentro de esta sección. La fecha límite aparece después de
las instrucciones mediante el slot visual opcional `introFooter`; las otras
plantillas conservan su disposición. El título, instrucciones, fecha, nombres
y respuestas conservan sus fuentes de datos anteriores.

Validación: 23 pruebas de contrato e interacción pasan, incluidas selección,
callback, guardado pendiente, plazo cerrado y error en las tres plantillas.
Sass y ESLint de los archivos modificados pasan. Revisión visual en escritorio,
440 px y 320 px: sin desbordamiento, PNG cargado y nombres completos. No se
modificaron confirmaciones reales durante la comprobación.

## Vestimenta con ilustración y muestras de tela

`bodmys` incluye `dresscode` después de `event_details` y antes de asistencia.
Su configuración completa está en DB: título, vestimenta formal, ilustración,
texto alternativo, títulos de paleta y muestras. Se muestran ocho telas de la
referencia aportada y solamente el blanco en la lista a evitar. Los recortes
circulares se hacen al presentar la imagen original, sin modificar sus píxeles.

La ilustración representa nueve mujeres con ramos en acuarela y fondo
transparente, con la novia blanca al centro. Se generó con `image_gen` integrado.
Ambos PNG son recursos del evento en
`backend-altezza/_local_storage/invitations/bodmys/dresscode/`; el prompt, las
rutas y las instrucciones de traslado están en
`backend-altezza/seeds/invitation_projects/bodmys/DRESSCODE-ASSETS.md`.

Oliva aplica papel beige, título Allura, categoría Montserrat y subtítulos
Cormorant. La imagen ocupa el ancho interior y las muestras se distribuyen en
dos filas de cuatro círculos; el blanco se muestra aparte con una cruz. Los
círculos miden entre 48 y 64 px según la pantalla.

La migración `configure-dresscode.js` agrega el módulo una vez, respalda el JSON
previo y respeta las configuraciones posteriores. Classic y Terracota conservan
sus configuraciones guardadas y sus muestras sólidas. Comprobar en móvil y
escritorio la carga de las diez imágenes (ilustración y nueve muestras), que
las muestras no incluyan bordes blancos de la foto, que la cruz quede encima
del blanco y que no haya desplazamiento horizontal.

El túnel público pasa por `scripts/oliva-preview-gateway.cjs` en el puerto 3003,
que permite únicamente la invitación de prueba, su API y recursos autorizados.
Los dos PNG de dresscode están incluidos explícitamente. El script se conserva
en el repositorio para que el permiso de estos recursos no dependa de una copia
temporal. Al incorporar nuevos archivos del evento, comprobar tanto localhost
como el enlace del túnel: que un recurso responda 200 en 3002 no garantiza que
esté permitido en el proxy público.

## Lluvia de sobres antes de vestimenta

`gift_envelopes` queda entre `event_details` y `dresscode`, con título
`Lluvia de sobres` y texto adicional en `leadText`. La imagen y su texto alternativo
provienen de su configuración en DB. Se usa la vista compartida existente;
Oliva define un fondo verde, título beige en Cormorant de 32 px y un icono de 128 px de ancho.

El PNG muestra un sobre beige con sello botánico verde y transparencia real.
Se generó mediante `image_gen` integrado y está en
`backend-altezza/_local_storage/invitations/bodmys/gift_envelopes/sobre-botanico-v1.png`.
El prompt y las instrucciones de traslado están en
`backend-altezza/seeds/invitation_projects/bodmys/GIFT-ENVELOPES-ASSET.md`.

`configure-gift-envelopes.js` inserta el módulo una vez, conserva los demás datos
y hace respaldo antes de actualizar. La ruta del icono está autorizada en el
proxy público. Verificar el orden Detalles → Lluvia de sobres → Dresscode,
fondo verde, icono transparente, título completo en móvil y carga del PNG tanto
en localhost como desde el túnel.

## Ajustes de texto y lectura (17 de septiembre de 2026)

La frase bíblica usa el verde primario `--oliva-green` del interior (`#767c5a`),
en lugar del verde oscuro de texto. Las direcciones de detalles pasan de 14 a
28 px, conservando Cormorant italic. El título de familia acepta la frase larga
configurada en DB, con Cormorant de 20 px, saltos de línea y 80 px de separación
antes de los grupos familiares (el doble de los 40 px previos); `coupleLabel` queda
vacío para ocultar «Con quienes nos han acompañado». El título de lluvia
de sobres usa Cormorant y su campo existente `leadText` contiene el mensaje del
regalo. No se añadieron campos ni textos de evento a la plantilla.

Los títulos de padres y padrinos usan Allura 42/400, con caja y espaciado naturales y
bajo relieve suave: cara verde ligeramente oscurecida, profundidad de 0.65 px,
sombra verde al 95% arriba a la izquierda y luz beige al 30% abajo a la derecha,
con bordes difuminados para evitar el contorno duro. En contraste aumentado
se restaura el texto beige sin sombras. Los nombres conservan Cormorant 24 px.

Aplicar el texto local con `node seeds/invitation_projects/bodmys/update-family-gift-copy.js`
desde el backend. Verificar color, direcciones, ambos textos completos y ausencia
de desbordamiento en móvil y escritorio; recargar tras actualizar datos.
