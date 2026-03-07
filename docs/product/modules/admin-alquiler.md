# 📦 Admin Alquiler

## Rol
ADMIN

## Descripción
Gestión de solicitudes de alquiler realizadas por organizadores. Permite construir alquiler, cotizar, iterar ajustes y aprobar.

## Funciones
- Explorar catálogo de mobiliario.
- Buscar por nombre o categoría.
- Agregar ítems a un alquiler (tipo carrito).
- Crear solicitud de cotización.
- Definir precios por unidad o paquete.
- Calcular total.
- Registrar abonos y saldo pendiente.
- Cambiar estado del alquiler.

## Flujo principal

1. El organizador entra a **📊 Organizador Dashboard**.
2. Selecciona **Nuevo alquiler**.
3. El sistema muestra catálogo con buscador y categorías.
4. El organizador agrega ítems como carrito.
5. Presiona **Cotizar alquiler**.
6. Estado: **Creado → Cotizando**.
7. En admin aparece notificación de alquiler pendiente por cotizar.
8. Admin define precios por unidad/paquete.
9. Sistema calcula total.
10. Estado: **Cotizando → Cotizado**.
11. Puede existir iteración organizador↔admin.
12. Organizador presiona **Aprobar** → estado **Aprobado**.

## Reglas
- Al estar **Aprobado**, los ítems quedan **bloqueados para la fecha del evento**.
- Ítems se muestran como no disponibles o con advertencia a otros organizadores.
- El bloqueo aplica también a **🎨 Decoración** al planificar eventos.

## Notas
Dentro del alquiler se muestra siempre:
- total
- abonos
- saldo pendiente
