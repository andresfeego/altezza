# Alineación de contratos de invitaciones

Una plantilla puede cambiar composición, tipografía y recursos decorativos. No
puede cambiar el significado de los campos de un mismo `type`, ni descartar un
módulo habilitado que pertenece al catálogo común. Los resolvers normalizan los
datos antes de pasarlos a las vistas.

## Campos alineados

| Módulo | Configuración / fuente | Data que consume la vista |
| --- | --- | --- |
| `envelop_intro` | `backgroundSrc`, `backgroundDesktopSrc` (imágenes), `backgroundVideoSrc` (video opcional), además de sus campos de identidad existentes | Los mismos campos en Classic, Terracota y Oliva |
| `hero_image_1` | `text1`, `backgroundImage`, `logoImage`; nombre y fecha del evento | `text1`, `text2` (fecha formateada), `text3` (nombre), `backgroundImage`, `logoImage` |
| `hero_image_2` | `backgroundImage`, `logoImage`, `imageSrc`, `imageAlt`, `coupleNames` opcional | Esos mismos campos; nombre del evento como respaldo |
| `welcome_message` | `title`, `subtitle`; invitado y mensaje personalizado | `title`, `subtitle`, `inviteeName`, `personalizedMessage` |
| `couple_family` | `title`, `coupleLabel`, `parentsBride`, `parentsGroom`, `godparents` | Mismos campos; cada persona tiene `name` e `isDeceased` |
| `event_details` | `title` opcional, flags existentes, `backgroundVideo`, frases opcionales `ceremonyMessage` / `receptionMessage`; lugares y fechas de `invitacion` | Fechas/lugares en `invitacion`; enlaces, direcciones y frases resueltos en campos comunes del módulo |
| `attendance_confirm` | `title`, `helperText`, opciones existentes y datos de invitación | Contrato compartido de confirmación; sin `introMessage` exclusivo de Oliva |
| `closing_message` | `message`, `frameImage` y `frameImageAlt` opcionales | Los mismos campos. Un cierre de texto no requiere un marco |

El hero no contiene una introducción, foto editorial independiente ni nombres
completos exclusivos. Las introducciones van a `welcome_message`, las fotos a
`simple_image` / `hero_image_2` y los textos de cada actividad a `event_details`.
La configuración histórica de `bodmys` se migra mediante `align-data.js`, sin
reescribir eventos, lugares, invitados ni respuestas. Los nombres completos
permanecen documentados en `tarjeta-mayra-y-samuel.md`.

## Ubicaciones

El backend publica `invitacion.ceremonyMapUrl`, `receptionMapUrl`,
`ceremonyAddress` y `receptionAddress`, con independencia de `templateKey`.
Las coordenadas del lugar tienen prioridad para construir el enlace. Si no
existen, se conservan los enlaces proporcionados en `event_details.config`.
Las direcciones siguen almacenadas en ese config (sin cambios de esquema).
El resolver común mantiene el mismo respaldo para payloads anteriores.
Todas las vistas leen los campos resueltos del módulo, incluidas las frases;
ninguna plantilla introduce una prioridad diferente. Cada actividad muestra
su propia fecha además de la hora.

## Compatibilidad y límites

Las tres plantillas incorporan las vistas del registro común. Hero y sobre
conservan vistas propias; los heroes comparten la normalización y los nombres
de campos. Un fondo decorativo predeterminado puede variar entre plantillas,
pero una imagen explícita del config tiene prioridad.

El cierre se controla con `enabled` y `order`, como los demás módulos. No hay
footer de contenido agregado fuera de `resolvedModules` en Oliva.
Flores, sello, fuentes y texturas siguen siendo recursos visuales de plantilla.

Esta alineación no añade validación exhaustiva por schema al backend. Esa
validación sigue pendiente; las pruebas de compatibilidad verifican los
contratos compartidos, los módulos soportados y la conservación de contenido.

## Fondo multimedia del sobre

`EnvelopeBackground` comparte la reproducción y el respaldo entre las tres
plantillas. `backgroundVideoSrc` tiene prioridad cuando hay video; si está vacío,
se conserva el fondo de imagen. `backgroundSrc` funciona también como respaldo
durante la carga, ante un error o bloqueo de autoplay y con movimiento reducido.
`backgroundDesktopSrc` selecciona la imagen de escritorio desde 1024 px.

El video se reproduce silenciado, automáticamente, en bucle y dentro de la página
(`autoPlay`, `muted`, `loop`, `playsInline`), sin controles. Solo aparece cuando
empieza a reproducirse. Se retira al ocultar/abrir el sobre y respeta cambios de
`prefers-reduced-motion`. Comportamiento de atributos: [HTML video en MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video).

Cada plantilla conserva su presentación. Oliva aplica desenfoque suave a esta
capa; Classic y Terracota dejan 16 px alrededor de sus piezas de sobre únicamente
si se configura un fondo multimedia, para que este sea visible. Sin esos campos,
conservan sus imágenes, geometría y animaciones anteriores. El fondo exterior
compartido de escritorio sigue siendo independiente de esta capa del módulo.

La ruta de video es un dato de `evento_invitacion_publica.modulesJson`; no se
introducen nombres de archivo ni contenido de boda en el componente compartido.
No requiere cambios de esquema ni de endpoints: el backend ya conserva los
campos opcionales del config.

## Contenido de cada cliente y fondos (16 de septiembre de 2026)

La plantilla no aporta frases editoriales, nombres propios ni mensajes de boda.
El contenido se guarda en `evento_invitacion_publica.modulesJson`, o proviene de
los datos canónicos del evento/invitación. Un texto opcional vacío se omite: no se
reemplaza por una frase predeterminada. Los títulos opcionales también respetan
una cadena vacía. Los nuevos campos pertenecen al contrato común y se consumen
en Classic, Terracota y Oliva:

| Módulo | Campos editoriales opcionales |
| --- | --- |
| `couple_family` / `event_details` | `title` |
| `countdown` | `title`, `message`, `completedMessage` |
| `countdown_image` | `title`, `completedMessage` |
| `photo_slider` | `title` |
| `dresscode` | `title`, `message` |
| `gift_envelopes` | `title` (además del `leadText` existente) |

Se eliminaron frases automáticas de bienvenida, familia, asistencia, calendario,
galería, vestuario y cuenta regresiva. El backend tampoco inventa textos de boda
ni pasajes religiosos cuando falta configuración guardada.

Las etiquetas funcionales y de estructura (Abrir, Ver ubicación, Ceremonia,
Recepción, Padres de la novia, unidades de tiempo, opciones/estados de asistencia,
accesibilidad y carga) siguen siendo interfaz compartida. No son frases
editoriales del cliente ni contenido diferente por plantilla.

`evento.seo.image` se reserva para metadatos al compartir. Nunca se usa como
respaldo del fondo de un hero: esa imagen puede traer textos ya dibujados. El
hero consume `config.backgroundImage`; un fondo decorativo de plantilla puede
ser un valor predeterminado únicamente cuando el campo no existe. Un fondo
configurado como vacío se respeta, incluso en Terracota.

Para conservar las frases que se veían en Mayra y Samuel, `configure-copy.js`
las incorpora a su configuración local tomando los valores de `modules.json`.
Solo añade campos ausentes de `bodmys`; conserva textos personalizados y vacíos
explícitos. No asigna esas frases a otros eventos ni modifica el sobre.
