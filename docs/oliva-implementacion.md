# Oliva — primera versión local

Plantilla `wedding_oliva` conectada al evento `bodmys` (Mayra & Samuel).

- Invitación de prueba: http://localhost:3002/invitacion/mysprueba/910171
- Backend local: http://localhost:3022
- Fuente de contenido: `docs/tarjeta-mayra-y-samuel.md`.
- Configuración repetible: `backend-altezza/seeds/invitation_projects/bodmys/modules.json` y `seed.js`.
- Respaldo previo frontend: `f883a80`; backend: `1e4f35a`.

## Composición

Sobre → portada y frase 1 → familia y frase 3 → ceremonia/recepción y frase 4 → cuenta regresiva → frase 2 y confirmación.

Oliva usa su propio componente, estilos, fuentes locales y botánica vectorial. Los datos personales viven en la configuración. Reutiliza los preparadores de familia, detalles, cuenta regresiva y confirmación; las vistas de familia y celebración pertenecen a Oliva. El fondo de escritorio también pertenece a esta plantilla.

La fecha límite es exclusiva: `2026-11-19T00:00:00-05:00`. Se muestra el último día permitido, 18 de noviembre. Las horas de ceremonia y recepción son respectivamente `2026-11-28T15:00:00-05:00` y `2026-11-28T16:30:00-05:00`.

## Contratos compatibles

Se mantienen las rutas existentes de configuración y lectura pública. Campos nuevos opcionales en `modules[].config`:

- `hero_image_1` de Oliva: `brideName`, `groomName`, `message`, `imageSrc`, `imageAlt`. No requiere foto para renderizar. Los nombres completos se conservan en la configuración del proyecto.
- `couple_family`: `message`, presentado por Oliva después de los familiares.
- `event_details`: `ceremonyMessage`, `receptionMessage`, `ceremonyAddress`, `receptionAddress`, `ceremonyMapUrl`, `receptionMapUrl`. Los enlaces explícitos tienen prioridad en Oliva sobre las coordenadas del catálogo.
- `attendance_confirm`: `introMessage`.
- `envelop_intro`: `backgroundSrc`, `backgroundDesktopSrc`, `envelopeSrc` y `monogramSrc`, rutas opcionales de las imágenes que utiliza el sobre de Oliva. `backgroundDesktopSrc` sustituye el fondo desde 1024 px; si falta, se mantiene `backgroundSrc`. `invitationLabel` conserva su prioridad sobre el label de la invitación.

Las vistas de clásica y terracota no cambian su composición por estos campos opcionales.

La respuesta pública añade `invitacion.confirmationClosed`. La confirmación devuelve HTTP 409 si el plazo ya venció; 400 si la respuesta está vacía, tiene opciones inválidas o integrantes repetidos; 404 si hay integrantes ajenos. Valida todo el lote antes de escribir y guarda en transacción. Eventos sin fecha límite siguen abiertos. El reloj del servidor es la autoridad; el navegador también desactiva los controles al vencer el plazo y ante un 409.

La conexión MySQL sincroniza su zona de sesión con el decodificador mysql2 (`ALTEZZA_DB_TIMEZONE`, por defecto `-05:00`). Esto evita interpretar TIMESTAMP con cinco horas adicionales respecto de DATETIME. Los lugares sin coordenadas devuelven enlace nulo, en lugar de apuntar a 0,0.

## Recursos pendientes

Música y galería están desactivadas. Para incorporarlas se completan sus recursos y configuración; no necesitan otro evento. Foto principal opcional en `hero_image_1.config.imageSrc`. Vestuario, regalos, solo adultos y otros módulos todavía no están registrados en Oliva: incorporarlos al registro visual cuando se defina su contenido. No habilitarlos antes.

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
