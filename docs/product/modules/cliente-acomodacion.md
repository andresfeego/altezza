← Volver al índice: [docs/product/README.md](../README.md)

# 🪑 Acomodación

Descripción:
Módulo que permite visualizar la distribución de mesas del evento y organizar a los invitados en cada una de ellas.

Funciones:

- Mostrar número de mesas
- Visualizar la distribución de mesas
- Abrir detalle de cada mesa
- Editar invitados asignados por mesa
- Generar una URL pública de consulta de mesas
- Buscar invitados para ubicar su mesa

Notas:
El módulo presentará una vista general de las mesas del evento. Al hacer clic sobre una mesa se abrirá un **modal** donde se podrá gestionar la asignación o edición de invitados correspondientes a esa mesa.

Adicionalmente, el sistema generará una **URL pública** donde los invitados podrán consultar la distribución de mesas del evento.

Comportamiento de la vista pública:

- Mostrará el plano o distribución visual de las mesas.
- Tendrá un **buscador** para que los invitados escriban su nombre.
- Al encontrar al invitado, el sistema resaltará visualmente su ubicación dentro del evento.
- La interfaz podrá mostrar un mensaje tipo **"Usted está aquí"** junto con una referencia visual que lleve hasta la mesa asignada.
- La mesa del invitado deberá destacarse con un **color distintivo** y mostrar claramente su número.

Objetivo de esta funcionalidad:

- Permitir compartir fácilmente el **link público de acomodación** al llegar al evento.
- Permitir usar una **tablet en la entrada** mostrando esta URL para que los invitados busquen su mesa por sí mismos.
