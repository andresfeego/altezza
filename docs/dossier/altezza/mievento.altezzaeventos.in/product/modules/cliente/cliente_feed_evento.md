# Módulo: Feed del evento

## Rol
- Cliente

## Menú (label)
- `Feed del evento`

## Ruta(s)
- `/evento/feed/<idEvento>`

## Objetivo
- Ser la superficie principal del cliente cuando ya existe un evento activo.

## UI / Pantallas
- Page: `pages/evento/feed/[idEvento].js`
- Component: `components/eventos/feed/FeedEvento.js`

## Datos / Campos
- Usa `idEvento` desde la URL.
- Consume resumen del evento (nombreEvento, fechaEvento, etc. según backend).
- El acceso depende de `eventosAsignados`, `eventoActivo` y módulos habilitados por evento.

## Reglas de negocio
- La ruta `/evento/feed/<idEvento>` queda reservada para cliente.
- Si el cliente no tiene permiso sobre ese evento, debe redirigir a `Cliente Home`.
- Si el cliente tiene un solo evento asignado, puede entrar directo al feed después del login.
- Si el cliente tiene múltiples eventos, primero resuelve el evento activo desde `Cliente Home`.
- El feed solo muestra previews de módulos habilitados para el evento activo.

## API / Endpoints
- GET `/resumenEvento/:idEvento` (helpersGetDB.getResumenEventoById)

## Estados / Permisos
- `Cliente` con evento activo válido: permitido
- `Cliente` sin evento activo: redirección
- `Admin`, `Organizador` y `Colaborador`: no permitido en esta ruta

## Notas
- `Cliente Home` y `Feed del evento` son superficies distintas:
  - `Cliente Home` sirve para empty state o selector
  - `Feed del evento` sirve para operar dentro del evento seleccionado
