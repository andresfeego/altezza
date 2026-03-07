# 📰 Feed Evento

## Rol
CLIENTE

## Descripción
Pantalla principal del evento para el cliente. Es el punto central de navegación y muestra contenido reciente del evento.

## Flujo de acceso
- Después del login, si el cliente tiene evento asignado, el sistema lo redirige a este módulo.

## Funciones
- Mostrar el menú con módulos habilitados para el evento.
- Mostrar cards resumen de módulos (información reciente o destacada).
- Acceso directo a cada módulo mediante clic o acción "Ver más".

## Reglas
- Si el cliente no tiene evento asignado, no debe llegar al Feed; se muestra un mensaje de no-asignación.
- Los módulos visibles dependen de la configuración del admin al crear el evento.
