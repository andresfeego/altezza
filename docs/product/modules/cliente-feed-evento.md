← Volver al índice: [docs/product/README.md](../README.md)

# 📰 Feed Evento

Descripción:
Pantalla principal a la que accede el cliente después de iniciar sesión cuando tiene un evento asignado. Funciona como el punto de entrada a todos los módulos del evento y presenta un resumen visual de la información más importante mediante cards cliqueables.

Funciones:

- Mostrar resumen del evento
- Mostrar cards resumen de módulos habilitados
- Permitir navegar a los diferentes módulos del evento
- Mostrar contenido reciente o destacado de cada módulo

Notas:
Los módulos visibles en el menú del cliente se **filtran automáticamente** según los módulos que el administrador habilitó al crear el evento.

El Feed del evento mostrará **cards tipo resumen**, y cada card será **cliqueable** para llevar al usuario al módulo correspondiente.

Ejemplos de comportamiento dentro del Feed:

- **💡 Inspiración**: muestra las últimas **5 fotos** en formato de scroll horizontal y al final una card del mismo tamaño que dice **Ver más**, la cual lleva al módulo de Inspiración.
- **✅ Pendientes**: muestra los últimos **3 pendientes** y un botón o acceso de **Ver más** que lleva al módulo de Pendientes.

La idea general del Feed es que cada módulo tenga una **vista previa resumida** que permita consultar información rápidamente sin entrar todavía al módulo completo.
