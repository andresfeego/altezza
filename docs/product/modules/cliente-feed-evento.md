← Volver al índice: [docs/product/README.md](../README.md)

# 🏠 Cliente Home / Feed del evento

## Descripción

La experiencia cliente tiene dos superficies relacionadas:

- `Cliente Home`: funciona como empty state cuando no hay eventos asignados y como selector cuando el cliente tiene múltiples eventos
- `Feed del evento`: funciona como la pantalla principal cuando ya existe un evento activo

El feed del evento presenta un resumen visual de la información más importante mediante cards cliqueables.

## Funciones

- Resolver el caso de cliente sin eventos asignados
- Resolver el selector de evento cuando el cliente tiene múltiples eventos
- Mostrar resumen del evento activo
- Mostrar cards resumen de módulos habilitados
- Permitir navegar a los diferentes módulos del evento
- Mostrar contenido reciente o destacado de cada módulo

## Notas

Los módulos visibles en el menú del cliente se **filtran automáticamente** según los módulos que el administrador habilitó al crear el evento.

Sin evento activo, el menú cliente no debe mostrar módulos del evento.

Cuando el cliente ya está dentro de un evento, el feed mostrará **cards tipo resumen**, y cada card será **cliqueable** para llevar al usuario al módulo correspondiente.

Ejemplos de comportamiento dentro del feed:

- **💡 Inspiración**: muestra las últimas **5 fotos** en formato de scroll horizontal y al final una card del mismo tamaño que dice **Ver más**, la cual lleva al módulo de Inspiración.
- **✅ Pendientes**: muestra los últimos **3 pendientes** y un botón o acceso de **Ver más** que lleva al módulo de Pendientes.

La idea general del feed es que cada módulo tenga una **vista previa resumida** que permita consultar información rápidamente sin entrar todavía al módulo completo.
