← Volver al índice: [docs/product/README.md](../README.md)

# 🪑 Admin Mobiliario

## Descripción

Módulo donde el administrador registra y gestiona el **inventario de mobiliario disponible para alquiler**. Este inventario alimenta el catálogo de alquiler que será utilizado posteriormente por los organizadores de eventos.

## Funciones

- Crear nuevos ítems de mobiliario
- Editar información de mobiliario
- Registrar cantidad disponible
- Subir fotos del mobiliario
- Clasificar mobiliario por tipo o categoría
- Definir si el mobiliario es propio o de proveedor

## Notas

El mobiliario registrado en este módulo constituye el **catálogo base de alquiler** que se mostrará en los módulos relacionados con alquiler dentro de la plataforma.

El mobiliario puede pertenecer a **dos tipos de origen**:

- **Mobiliario propio:** pertenece directamente a Altezza.
- **Mobiliario de proveedor:** pertenece a un proveedor externo que presta el servicio.

Cuando el mobiliario es de proveedor, el ítem puede vincularse con un proveedor registrado en el módulo **🧑‍🍳 Admin Proveedores**.

Regla de visibilidad:
El **catálogo mostrado a los organizadores** solo incluirá **mobiliario propio de Altezza**. El mobiliario de proveedor se utiliza para gestión interna o para planificación dentro de eventos, pero no aparece en el catálogo público de alquiler para organizadores.
