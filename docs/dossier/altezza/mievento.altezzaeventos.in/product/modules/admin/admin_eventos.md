# Módulo: Eventos (Admin)

## Rol
- Admin

## Menú (label)
- `Eventos`

## Ruta(s)
- `/admin/eventos`

## Objetivo
- TODO: describir objetivo del módulo.

## UI / Pantallas
- Page: `pages/admin/eventos/index.js`
- Component: `components/home/AdminEventos.js`
- List: `components/eventos/ListaEventos.js` (incluye `ModalCrearEvento`)

## Datos / Campos
- TODO: listar campos que muestra/edita.

## Reglas de negocio
- TODO

## API / Endpoints
- GET `/eventos/activos` (helpersGetDB.getEventosActivos)
- GET `/eventos/inactivos` (helpersGetDB.getEventosInactivos)`

## Estados / Permisos
- TODO

## Notas
- Muestra eventos activos y permite alternar vista de inactivos.
