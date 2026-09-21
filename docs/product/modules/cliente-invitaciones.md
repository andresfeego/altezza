← Volver al índice: [docs/product/README.md](../README.md)

# 💌 Invitaciones

## Descripción

Módulo que permite crear y gestionar **invitaciones digitales del evento**.

## Funciones

- Crear invitaciones digitales
- Llenar la información de cada invitación
- Escoger entre distintas plantillas de invitación prediseñadas
- Generar un link único para cada invitación
- Visualizar el estado de respuesta de cada invitado

## Notas

Cada invitación genera un **link individual** que puede compartirse con el invitado correspondiente.

Desde ese link el invitado podrá responder su asistencia seleccionando una de estas opciones:

- Asistiré
- No asistiré
- Quizá asistiré

Este módulo se alimenta de la información base del módulo **👥 Invitados** y permite gestionar la respuesta de asistencia de cada persona invitada.

## Fotografías instantáneas y cierre

### Aparición de textos e imágenes en Oliva

Desde la frase (`biblical_quote`, o nombres/fecha si no hay frase), Oliva revela
los textos al entrar en pantalla: opacidad y desplazamiento de 12 px en
700 ms, con separación de 100 ms entre partes. En las secciones claras (frase,
detalles, vestuario y mensaje de fotos/cierre), los bloques alternan izquierda y
derecha, comenzando por la izquierda en cada módulo. Cada texto de detalles
cuenta como un bloque; no se alternan sus líneas. Los fondos verdes y nombres
conservan la entrada desde abajo. Este ritmo editorial fue aprobado
por el usuario para la tarjeta. Mayra, «&» y Samuel comparten una entrada
escalonada; contador y calendario entran como bloques, sin animar cada cambio
de cifra ni cada celda. Incluye familia, lugares, sobres, vestuario, introducción
de asistencia y mensaje bajo las fotos. Fondos, controles de respuesta y mensajes
de estado mantienen su funcionamiento.

También aparecen la ilustración y paletas de vestuario, el sobre de regalos,
las dos Polaroid y su sello. Vestuario/fotos alternan los laterales; el sobre
asciende sobre su fondo verde. Cada imagen se activa al entrar en pantalla y
espera su propia carga, sin bloquear textos ni el resto de la tarjeta. Las
fotos conservan marcos, rotaciones, sombras animadas y posición final del sello:
su entrada usa transiciones independientes de la animación de sombra.

Cada texto aparece una sola vez por visita. El efecto pertenece a la plantilla:
no modifica contratos, contenido, orden ni otras plantillas. Se prepara únicamente
al abrir la invitación. Sin soporte de observación o con movimiento reducido,
el texto permanece visible. Activar movimiento reducido durante la visita o
enfocar un enlace con teclado elimina la espera; imprimir muestra todo el texto.

Validación manual: abrir y recorrer la tarjeta en móvil/escritorio, comprobar
la secuencia de nombres y fecha y los laterales alternados de detalles/vestuario;
verificar la entrada de ilustración, paletas, sobre, fotos y sello sin repetirla;
volver hacia arriba sin nuevas entradas, revisar
movimiento reducido y acceder a los enlaces por teclado. El contador debe seguir
actualizándose y el mensaje final quedar visible al llegar al pie.

`instant_photos` presenta dos fotos estáticas superpuestas en marcos Polaroid y un
sello opcional. Comparte contrato y vista entre Classic, Terracota y Oliva:

```json
{
  "type": "instant_photos",
  "enabled": true,
  "order": 13,
  "config": {
    "images": [
      { "imageSrc": "/scrAppaltezza/invitations/bodmys/photos/003.jpeg", "imageAlt": "Mayra y Samuel juntos" },
      { "imageSrc": "/scrAppaltezza/invitations/bodmys/photos/004.jpeg", "imageAlt": "Mayra y Samuel abrazados" }
    ],
    "sealImageSrc": "/scrAppaltezza/invitations/bodmys/instant_photos/sello-lacre-MS-v1.webp",
    "sealImageAlt": "Sello dorado con el monograma de Mayra y Samuel",
    "message": "Con mucho cariño,\nMayra & Samuel",
    "reliefImageSrc": "/scrAppaltezza/invitations/bodmys/hero/floral-relief-v1.png"
  }
}
```

Sin exactamente dos fotos configuradas el módulo no se muestra; no toma imágenes
de otros módulos. Las tres imágenes cargan de forma diferida y la composición
reserva su altura antes de descargarlas. No incorpora controles de galería.
`enabled` y `order` conservan su comportamiento habitual.

`message` es opcional, admite saltos de línea y se muestra dentro de la sección,
debajo de las fotos. Vacío o ausente no añade texto ni un espacio reservado.
`reliefImageSrc` es opcional: Oliva utiliza la imagen como máscara de las mismas
capas de relieve del hero, sobre el beige y la textura del papel actual. La luz,
sombras y grano quedan detrás de fotos, sello y mensaje, limitados a esta sección.
Respeta movimiento reducido y contraste aumentado. Las otras plantillas conservan
las fotos y el mensaje con su propio estilo, sin introducir el relieve de Oliva.

En Oliva, las fotos y el sello comparten la sombra del monograma del hero, incluida
su variación con la luz y su estado estático con movimiento reducido. El centro
del sello está en la intersección del borde inferior de la foto posterior con el
borde izquierdo de la foto frontal, considerando sus rotaciones. Las coordenadas
proporcionales se derivan de la geometría de la composición y conservan ese anclaje
en móvil y escritorio; si cambia la composición deben recalcularse.

En `bodmys` el módulo está después de `attendance_confirm`; su mensaje se copia
del cierre guardado mediante `merge-closing-into-photos.js`. `closing_message`
queda desactivado conservando su configuración como respaldo. Su opción
`config.showFrame: false` sigue disponible para ocultar el marco de un cierre
independiente; si se omite conserva el comportamiento anterior.

Validación manual: abrir el sobre, llegar al final, comprobar las dos fotos y el
sello, verificar un único mensaje dentro del módulo y relieve solo en ese fondo;
repetir a 320, 390 y 480 px y en escritorio, comprobando que no se cortan fotos ni
texto. Revisar movimiento reducido y las imágenes por túnel.

## Esquinas florales de la frase en Oliva

`biblical_quote` conserva `passageText` y `passageReference`, centrados y con su
animación de entrada. `BiblicalQuoteOliva` añade dos pequeñas esquinas florales:
un único PNG blanco plano y transparente en forma de «┌», arriba a la izquierda,
y la misma imagen rotada 180° abajo a la derecha. Usa el mismo relieve y papel
beige de las fotos finales. El color, las luces y las sombras se aplican en CSS.
Los adornos miden entre 96 y 128 px y tienen 16 px de separación del contenedor.
Reemplazan las pruebas de marco completo y quedan limitados a esta sección;
la altura crece con el texto para evitar solapamientos en móvil. El texto tiene
64 px de padding horizontal por lado, reducido a 48 px bajo 360 px de ancho,
para separarlo de las esquinas sin cambiar el tamaño de letra ni su centrado.
No requiere configuración nueva ni cambios de datos; las otras plantillas
conservan su presentación. El recurso y su prompt están en los assets de Oliva.

Validación manual: abrir el sobre, revisar la frase a 320, 390, 480 y 1440 px,
comprobar texto centrado y separado de las dos esquinas, misma imagen girada y ausencia de
desbordamiento. Revisar referencia opcional y texto largo, movimiento reducido
(relieve estático), contraste aumentado (sin ornamento) y dimensiones sin cambios
en los demás módulos. Cerrar las pestañas de inspección al finalizar.

## Fondo opcional común de las secciones

Todos los módulos pueden guardar `config.sectionBackground` en su configuración:

```json
{
  "sectionBackground": {
    "imageSrc": "/scrAppaltezza/invitations/evento/seccion/fondo.png",
    "overlayOpacity": 0.78
  }
}
```

`imageSrc` acepta una ruta pública local o URL HTTP(S). `overlayOpacity` va de 0
(foto sin velo) a 1 (velo opaco), con valor por defecto 0.8. Ausencia, `null`,
imagen vacía o URL inválida conservan exactamente el renderizado anterior.
Los campos especializados existentes (`backgroundImage`, `backgroundSrc`, vídeo,
monograma, etc.) siguen teniendo su función y no activan esta opción implícitamente.

Classic, Terracota y Oliva comparten `ModuleSurface`: fondo fotográfico en `cover`,
velo de color de la plantilla y contenido encima. El color del velo procede del
token `--module-background-overlay-color` de la sección, con respaldo en la
superficie base de la plantilla. La capa cambia el fondo raíz; no oculta fotos,
vídeos, máscaras o contenido propio de módulos especializados. La música conserva
su control flotante, sin convertirse en una sección del documento.

Si la plantilla ya tiene un velo propio, puede definir
`--module-background-overlay-image: none` y aplicar
`--module-background-opacity` a esa capa para evitar duplicar el velo. En Nombres
de Oliva la capa es `coupleNamesModule::before`: su opacidad procede de
`config.sectionBackground.overlayOpacity`; sin fondo configurado conserva la
textura original al 35%.

La opción no modifica nombres, frases, orden, estado activo ni respuestas. Solo
se configura en Nombres de `bodmys`; los otros módulos y eventos siguen sin ella.
En contraste aumentado se omite la foto. Validar imagen, lectura y ausencia de
desbordamiento en móvil/escritorio, y comprobar que sin configuración el DOM
anterior se conserva. La ruta del recurso también debe permitirse en el túnel.
