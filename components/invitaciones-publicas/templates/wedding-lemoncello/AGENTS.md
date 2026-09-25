# Regla visual de Lemoncello

Esta regla recoge la instrucción explícita del usuario para todas las imágenes
nuevas o editadas de esta tarjeta. Aplica solamente a `wedding-lemoncello`.

## Referencias obligatorias

Antes de generar o editar una ilustración, inspeccionar y adjuntar al generador:

1. `assets/references/watercolor-style-master.jpg`: referencia principal original
   del usuario (botella y limones). Define técnica pictórica y gama cromática.
2. `assets/images/landscape-proportioned.png`: escena aprobada. Define cómo debe
   integrarse visualmente el recurso en la tarjeta existente.

Las referencias adicionales definen únicamente forma, composición, objeto o
identidad. No deben sustituir estas referencias de estilo. Una generación reciente
no se convierte automáticamente en referencia maestra. La antigua canastilla
`vespa-basket.png` fue rechazada por su estilo: puede guiar formas, nunca acabado.

## Técnica y paleta

- Acuarela tradicional suave: veladuras translúcidas, pigmento y papel visibles
  dentro de la pintura, bordes orgánicos, pinceladas sueltas y luces de papel.
- Color diluido y luminoso: azul cielo/pastel, amarillo mantequilla, crema/marfil;
  azul marino como acento moderado. Vegetación oliva/salvia desaturada y mimbre
  en ocre/paja claro. Las flores pueden usar azul muy pálido con un toque de lavanda.
- Contraste moderado; evitar contornos negros o marrones marcados, trama de mimbre
  hiperdefinida, colores estridentes, naranja intenso y violeta saturado.
- No introducir aspecto vectorial, caricatura con contornos, sticker digital,
  render 3D, acabado fotográfico, plástico brillante ni interfaces de aplicación.
- Suavidad no significa desenfoque: conservar formas legibles y textura de pincel.

## Generación e integración

- En cada prompt, nombrar el rol de cada referencia y repetir estas restricciones.
  Guardar prompt y procedencia en `assets/prompts.json`.
- Verificar estilo a tamaño original Y dentro de la escena móvil antes de darlo
  por terminado. Si no coincide, corregir el recurso; no cambiar la escena aprobada
  para acomodar un estilo nuevo.
- Conservar proporciones naturales. Escalar uniformemente, con altura automática;
  nunca estirar un eje para llenar un contenedor.
- Dirección vigente para fecha (2026-09-23): fondo blanco, fecha/mensaje/contador/
  calendario centrados, cenefas de azulejos azules arriba y abajo y rama de limones
  independiente animada abajo a la derecha. Reemplaza el caballete y sus zooms.
  Fotos ↔ fecha ↔ iglesia usan sombrillas mantequilla/marfil vistas desde arriba:
  entran desde los cuatro bordes girando en su centro, cubren toda la pantalla,
  se cambia la escena debajo y salen girando. Posiciones y tamaños irregulares;
  atraviesan el centro sin detenerse ni formar filas/columnas. No cambiar el fondo antes de la
  cobertura completa. Mantener la escala del paisaje de iglesia, con cielo/datos
  arriba (60%) e iglesia/jardines abajo (40%).
- Sprites con alfa real. Mantener capas independientes para animación y conservar
  los originales. Usar nombres versionados para sustituciones.
- Ceremonia y recepción son dos pasos visuales del mismo `event_details`, según
  sus banderas de visibilidad, sin duplicar ni modificar datos/configuración.
  Primero ceremonia centrada con el halo del monograma. Después, una sola chispa
  suave sube desde la vegetación y, al finalizar, aparece recepción sobre la misma
  imagen de cielo claro. En ceremonia → recepción no cambiar a noche ni oscurecer el
  paisaje. Ambos textos conservan azul marino y halo, con la cámara fija. Sin flashes
  de pantalla, fuegos repetidos ni sonido añadido. Respetar movimiento reducido.
- La arquitectura vigente de la capilla se basa en el dibujo del Hero de Natalia
  y Andrés, guardado en `assets/references/chapel-natalia-andres-line.webp`.
  Conservar cúpula con cruz, óculo, puerta de madera, escalinata y cipreses;
  usar la acuarela de Lemoncello, no el acabado de líneas doradas de esa referencia.
  Hay una canastilla de limones junto a los cipreses a cada lado del acceso.
  El fondo activo es `chapel-reference-day-v1`, centrado en la fachada para ambos
  eventos. La ilustración nocturna se precarga si está presente `gift_envelopes` o `recommendations`.
  Los cipreses tienen un viento muy suave y localizado, con sus bases fijas;
  conservar su continuidad entre eventos y dejar quietas capilla y canastillas.
- Recepción → `gift_envelopes`: ocultar recepción y, simultáneamente, ascender la
  cámara hacia el cielo y fundir a `chapel-reference-night-v1` en 4.8 s. El encuadre
  final termina sobre la cruz, mostrando solo cielo, luna y estrellas. Regresar
  revierte ambas cosas y restaura recepción diurna. Cuatro reflectores suaves
  desde el borde inferior, silueta de novios bailando abajo, mensaje `leadText`,
  icono `imageSrc` y título `title` encima, de abajo hacia arriba. Textos editables
  del contrato común; acuarela y alfa real, sin datos horneados. Movimiento reducido
  omite viaje, fundido, baile y barrido de luces.
- `gift_envelopes` → `recommendations`: descender desde el cielo al hotel en 4.8 s,
  conservando noche, luna y estrellas en la misma capa y coordenadas del mundo.
  El hotel se revela por debajo de y=416 del panorama; ocultar datos en movimiento
  y revelarlos al terminar. Regresar asciende al mismo cielo, sin cambiar a día.
  La ilustración conceptual de hotel viene de `config.imageSrc`; título, dos textos
  y enlace usan el contrato común. Movimiento reducido omite el recorrido.
- `recommendations` → `dresscode`: diez fuegos discretos y escalonados suben desde
  abajo del hotel a puntos distintos alrededor del centro del cielo. Al terminar
  el último, un único resplandor cálido cubre de blanco la pantalla; cambiar el
  fondo solamente debajo de cobertura total (4.5 s), terminar en 5.6 s. Cámara
  fija. Regreso con fundido blanco de 1.2 s; movimiento reducido omite efectos.
  Vestuario reutiliza fondo blanco, azulejos arriba/abajo y rama de fecha.
  Tres mujeres a la izquierda y tres hombres a la derecha, sin novia, en acuarela.
  Dirección aprobada 2026-09-25: conservar los vestidos rosa, salvia y durazno de
  las mujeres; hombres con trajes convencionales de paño gris, gris oscuro y negro,
  en las poses originales. Recurso `dresscode-guests-formal-v2.webp`. Sin título
  ni paleta de colores sugeridos; mantequilla, cielo y blanco siguen reservados.
  Todo texto, ilustración y paletas proviene del contrato compartido `dresscode`.
  Vestuario no tiene scroll interno: sus dos cenefas miden la mitad de las de
  fecha y su ilustración de personas es un 10% menor. Ajustar la densidad en móviles
  cortos para mostrar título, mensaje y paleta reservada completos; nunca esconderlos
  debajo de cenefas o de la rama. El calendario conserva sus medidas actuales.
- `dresscode` → `attendance_confirm`: desplazamiento vertical sencillo de 900 ms,
  regreso hacia arriba con la misma duración. Asistencia usa fondo azul cielo,
  ondas/líneas en azul más claro únicamente arriba y abajo, sin plantas ni azulejos.
  Contenedor interno con scroll vertical y overscroll contenido para listas largas.
  Reutilizar `AttendanceConfirmView` y `attendanceState` compartidos: respuestas,
  guardado, cierre por fecha y errores no se duplican dentro de la plantilla.
  Foco al llegar, bloqueo durante el movimiento y paso inmediato con movimiento
  reducido. Las flechas siempre indican izquierda/derecha, incluso en este tramo
  vertical, por la corrección explícita del usuario del 2026-09-24.
- Navegación vigente: círculos pequeños de 48 px en acuarela marfil/beige con borde
  algo más oscuro y flecha azul corta centrada, sin limones. Recurso
  `scene-arrow-round-v1.webp`; no reutilizar las flechas largas anteriores ni girar
  los controles hacia arriba/abajo. Conservar sus fades, estados y nombres accesibles.
- Cierre: `closing_message` después de asistencia, con costa italiana vista de
  lejos de noche, sin balcón ni primer plano, cielo estrellado y la misma clase
  de luna creciente de la noche aprobada. Paisaje `closing-coast-night-v1.webp`.
  Monograma `imageSrc` arriba a la derecha, mantequilla con halo centrado algo más
  oscuro; `message` debajo. Son datos del contrato común, no texto horneado.
  Asistencia ↔ cierre se desplaza horizontalmente en 900 ms; movimiento reducido
  omite la animación. No cambiar el descenso de vestuario a asistencia.
  El agua del cierre tiene oleaje suave y reflejos sobre los pigmentos existentes,
  localizados debajo de costa/barcos. Mantener cielo, luna, pueblo y monograma
  inmóviles. Pausar fuera de la escena y con pestaña oculta; con movimiento reducido
  o sin WebGL conservar la ilustración estática original.
- Vespa: recorrido de 6 s (antes 6.8 s), con curva
  `cubic-bezier(.45, 0, .55, 1)` común para cámara, moto y ruedas: inicio lento,
  centro más rápido, llegada lenta. Conservar posiciones, escala y apertura de 3.6 s.
- Música: módulo compartido `music_player`, MP3 propio del evento en Storage
  `bodlauser/music`. Al retirarse el cargador, la moto espera estática con la
  flecha circular habitual abajo a la derecha. Ese clic inicia sonido y recorrido
  simultáneamente, y retira la flecha. No reproducir antes de ese gesto. El control
  de sonido se muestra a partir del arranque. Al llegar, el letrero Abrir hace un
  vaivén breve cada 3 s; omitirlo con movimiento reducido. Respetar
  el silencio elegido por el invitado al abrir puertas o navegar; no reiniciar la
  canción entre escenas. No copiar la canción a assets de plantilla.
- Sobre: usar `landscape-open-clear-v3.webp`. El limonero debe quedar pegado al
  marco izquierdo y visible en el encuadre móvil; no desplazarlo fuera del cuadro
  ni dejar una franja amplia de pared entre copa y puerta. Copa natural compacta,
  tronco y maceta proporcionados. Toda la abertura arqueada conserva alfa real,
  incluidas las zonas que antes tenían hojas. No cambiar cámara ni otros objetos.
- Dirección actual: los paseos entre paisajes son horizontales, salvo el descenso
  explícito de vestuario a asistencia. La transición
  de fotos a fecha y de fecha a `event_details` es una excepción: las sombrillas
  cubren el cambio de presentación también al regresar.
  Ceremonia y paisaje se revelan juntos debajo de la cobertura de sombrillas;
  no esperar a que salgan para mostrar los datos. Frase bíblica ↔ fotos dura
  3 s con inicio lento, aceleración central y frenado suave; conservar el pájaro
  guía en la ida y el paseo del mesero sin cambios.
  El usuario retiró la exigencia de bordes exteriores difuminados. Los paisajes
  pueden llenar un rectángulo, pero deben conectar visualmente mediante costa,
  cielo, vegetación y suelo continuos; no mostrar un corte entre módulos.
  Los objetos animados independientes siguen necesitando transparencia real.
- Antes de generar el paisaje siguiente, inspeccionar y adjuntar la última franja
  derecha del paisaje anterior y la primera franja del destino, si ya existe.
  Continuar horizonte, perspectiva, suelo, arquitectura y escala. Preferir un
  panorama continuo para las escenas y el paseo intermedio. Esta continuidad
  aplica a los recorridos visibles; la presentación blanca de fecha usa el cambio
  cubierto por sombrillas aprobado por el usuario.
- Hero → frase: cuando ambos son las primeras escenas y el Hero no tiene fondo
  personalizado, usar `hero-quote-continuous-v2.webp` como paisaje único del Hero
  y del paseo. No superponer `hero-coast` encima: reintroduciría la división vertical.
  Conservar el balcón, la rama animada, el pájaro, el monograma, el letrero y sus
  textos en sus capas actuales. La terraza enlaza con `quote-photo-panorama-v2`
  mediante un solape estrecho; evitar fundidos anchos que dupliquen las sombrillas.
  Un fondo de Hero configurado por el evento conserva prioridad y su composición.
- En elementos abiertos (balcones, barandas, follaje), los huecos deben conservar
  alfa efectivo y mostrar las capas posteriores. Reservar capas independientes
  para paisaje, primer plano y futuras animaciones.
- La Vespa aprobada permanece intacta. Sus añadidos se superponen como capas;
  no se redibuja ni se altera su color, tamaño o geometría al cambiar la canastilla.
- Label, fecha y demás contenido variable vienen del contrato compartido de la
  tarjeta. No hornear esos datos en las ilustraciones.
- Las fuentes propias de Lemoncello residen en `assets/fonts`. El mensaje del
  letrero bíblico usa Cormorant (cursiva, 500) en azul marino; conservar
  Cormorant normal para la referencia opcional y los demás usos actuales. Mantener el
  texto y el adorno inferior completos dentro del papel también en móvil pequeño.
  En detalles, solo los títulos «Ceremonia» y «Recepción» usan Khalifah Script
  (normal, 400); fechas, horarios, lugares, mensajes y enlaces mantienen Cormorant.
  También usan Khalifah los títulos de lluvia de sobres, hospedaje, vestuario,
  confirmación y el mensaje del cierre. Sus cuerpos usan Cormorant; el mensaje de
  adultos va en frase normal, no en mayúsculas. La fuente se registra en el SCSS
  principal de la plantilla y permanece local.
- El monograma de Laura y Sergio pertenece al Storage del evento, en
  `invitations/bodlauser/cover/`. Hero (`logoImage`) y cierre (`imageSrc`) comparten
  `laura-sergio-monogram.png`; no guardar copias del monograma en la plantilla
  ni en `public/images`. Mantener también su original JPG en esa carpeta `cover`.

Esta regla permanece vigente para futuras iteraciones salvo cambio explícito
de dirección visual solicitado por el usuario.
