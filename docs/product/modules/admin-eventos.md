← Volver al índice: [docs/product/README.md](../README.md)

# 🎉 Admin Eventos

## Rol
ADMIN

## Descripción
M�dulo donde el administrador crea y gestiona los eventos que existirán en Altezza.

Cada **evento** es un contenedor principal de información al que posteriormente se le asignan usuarios (clientes) para que puedan acceder y trabajar sobre los módulos del evento.

## Funciones
- Crear evento.
- Editar información del evento.
- Activar o desactivar evento.
- Asignar usuarios al evento.
- Seleccionar qué módulos estarán disponibles para el cliente.
- Entrar a la vista interna de cada evento como administrador.
- Ver listado de eventos existentes.

## Notas
- El evento es la entidad principal que conecta a los usuarios con los módulos del sistema.
- En la creación del evento, el admin **define qué módulos** estarán habilitados para ese evento.
- Esa selección controla el **menú del cliente**.
- Desde el listado de eventos, el admin puede entrar a un evento y ver una experiencia similar a la del cliente, pero además con módulos administrativos por defecto.
