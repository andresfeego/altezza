← Volver al índice: [docs/product/README.md](../README.md)

# 🎨 Paletas Colores

## Descripción

Módulo que permite definir y gestionar las paletas de colores del evento. Estas paletas ayudan a mantener coherencia visual en elementos como decoración, invitaciones, vestuario y otros detalles estéticos del evento.

## Funciones

- Crear nuevas paletas de colores
- Asignar un nombre a cada paleta (por ejemplo: "Colores reservados por los novios")
- Agregar colores manualmente a la paleta
- Definir colores usando formatos **Pantone**, **RGB** o selectores visuales de color (similar a herramientas de diseño como Corel)
- Editar o eliminar colores dentro de una paleta

## Notas

Un evento puede tener **varias paletas de colores** según las necesidades del diseño del evento.

El sistema incluirá un botón de **"Extraer paleta"** que permitirá generar automáticamente una paleta a partir de una imagen.

Flujo de extracción de colores:

1. El usuario sube una imagen de referencia.
2. Antes de procesar la imagen, el sistema permite **recortarla** para seleccionar la zona de interés.
3. El usuario indica cuántos colores desea extraer (por ejemplo 3, 4, 5, etc.).
4. El sistema analiza la imagen y calcula los **colores predominantes**.
5. Los colores generados se agregan automáticamente a la paleta.

Preview - Feed Evento:
En el **📰 Feed Evento** puede mostrarse una card con una vista previa de la paleta principal del evento, mostrando pequeños **swatches de color** representando los colores seleccionados. Al hacer clic se abre el módulo completo de Paletas de Colores.
