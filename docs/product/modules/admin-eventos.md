← Volver al índice: [docs/product/README.md](../README.md)

# 🎉 Admin Eventos

## Descripción

Módulo donde el administrador crea y gestiona los eventos que existirán en Altezza. Cada evento funciona como un contenedor de información al que posteriormente se le asignan usuarios (clientes) que podrán acceder y trabajar sobre los módulos de su evento.

## Funciones

- Crear evento
- Editar información del evento
- Activar o desactivar evento
- Asignar usuarios al evento
- Seleccionar qué módulos estarán disponibles para el cliente
- Entrar al workspace administrativo de cada evento
- Ver listado de eventos existentes

## Notas

El evento es la entidad principal que conecta a los usuarios con los módulos del sistema.

Durante la creación del evento el administrador puede **definir qué módulos del sistema estarán habilitados para ese evento**. Esta selección controla qué opciones aparecerán en el **menú del cliente** cuando el usuario ingrese al sistema.

Desde el listado de eventos, el administrador debe entrar a una superficie propia de gestión del evento. Esa superficie no reutiliza la navegación cliente como flujo principal.

La arquitectura objetivo para este módulo queda así:

- `/admin/eventos` muestra el listado y acciones globales
- `/admin/eventos/:id` actúa como workspace administrativo del evento
- desde ahí el admin entra a módulos específicos del evento
- `/evento/...` queda reservado para cliente
- si existe preview cliente, debe ser una acción secundaria y claramente diferenciada
