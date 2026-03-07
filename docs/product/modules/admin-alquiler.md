← Volver al índice: [docs/product/README.md](../README.md)

# 📦 Admin Alquiler

## Descripción

Módulo donde se gestionan las **solicitudes de alquiler de mobiliario realizadas por organizadores**. Permite construir un alquiler seleccionando ítems del catálogo, enviar la solicitud para cotización y gestionar todo el ciclo del alquiler hasta su aprobación.

## Funciones

- Explorar catálogo de mobiliario
- Buscar mobiliario por nombre o categoría
- Agregar ítems a un alquiler (tipo carrito de selección)
- Crear solicitud de cotización
- Definir precios por unidad o por paquete
- Calcular total del alquiler
- Registrar abonos y saldo pendiente
- Cambiar estado del alquiler

## Flujo principal

1. El organizador entra a **📊 Organizador Dashboard**.
2. Selecciona la opción **Nuevo alquiler**.
3. El sistema muestra un **catálogo con buscador y menú de categorías** en la parte superior.
4. El organizador puede **agregar ítems al alquiler** de forma similar a un carrito.
5. Cuando termina la selección presiona el botón **Cotizar alquiler**.
6. El alquiler cambia de estado **Creado → Cotizando**.
7. En el dashboard administrativo de Altezza aparece una **notificación de alquiler pendiente por cotizar**.
8. El administrador define precios por unidad o por paquete para cada ítem.
9. El sistema calcula el **total del alquiler**.
10. El alquiler cambia de estado **Cotizando → Cotizado**.
11. Puede existir iteración entre organizador y administrador hasta ajustar la cotización.
12. Cuando el organizador presiona **Aprobar**, el alquiler cambia a estado **Aprobado**.

## Reglas

- Cuando un alquiler queda **Aprobado**, los ítems quedan **bloqueados para la fecha del evento**.
- Estos ítems aparecerán como **no disponibles o con advertencia** para otros organizadores.
- El mismo bloqueo aplica para el módulo **🎨 Decoración** al planificar eventos.

## Notas

Dentro del alquiler siempre se mostrará:

- total del alquiler
- abonos registrados
- saldo pendiente

Esto permite controlar financieramente cada alquiler dentro de la plataforma.
