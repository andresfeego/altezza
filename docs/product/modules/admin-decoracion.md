← Volver al índice: [docs/product/README.md](../README.md)

# 🎨 Decoración

Descripción:
Módulo de uso exclusivo del **administrador** donde se planifica el mobiliario y los elementos de decoración que deben llevarse a un evento.

Funciones:

- Seleccionar ítems del inventario de mobiliario
- Asociar mobiliario a un evento específico
- Definir cantidades necesarias por ítem
- Preparar listado de elementos que deben transportarse al evento

Notas:
Este módulo **no es visible para los clientes**.

El administrador siempre tendrá acceso a este módulo dentro de cada evento, independientemente de los módulos habilitados para el cliente.

La información registrada aquí se utiliza posteriormente por los roles de **organizador y colaborador**, quienes verán estos elementos como parte de sus listas de trabajo el día del evento (por ejemplo en checklists de montaje o preparación).

Los ítems que se agregan en este módulo provienen del inventario definido en **🪑 Admin Mobiliario**. El sistema permitirá distinguir si el mobiliario utilizado en el evento es **mobiliario propio de Altezza** o **mobiliario de proveedor externo**, manteniendo esta distinción dentro de la planificación del evento.
