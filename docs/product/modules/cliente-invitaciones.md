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
