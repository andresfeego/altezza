# Módulo: Feed del evento

## Rol
- Cliente

## Menú (label)
- `Feed del evento`

## Ruta(s)
- `/evento/feed/<idEvento>`

## Objetivo
- TODO: describir objetivo del módulo.

## UI / Pantallas
- Page: `pages/evento/feed/[idEvento].js`
- Component: `components/eventos/feed/FeedEvento.js`

## Datos / Campos
- Usa `idEvento` desde la URL.
- Consume resumen del evento (nombreEvento, fechaEvento, etc. según backend).

## Reglas de negocio
- TODO

## API / Endpoints
- GET `/resumenEvento/:idEvento` (helpersGetDB.getResumenEventoById)

## Estados / Permisos
- TODO

## Notas
- TODO
