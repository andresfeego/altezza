# Módulo: Eventos

## Funcionalidad observada en código

### Listados
Se consumen endpoints:
- `GET /eventos/activos`
- `GET /eventos/inactivos`

Helpers:
- `components/initialized/data/helpersGetDB.js`

### Detalle / resumen
- Resumen: `GET /resumenEvento/:idEvento`
- Detalle completo: `GET /eventos/detalle_completo/:idEvento`

### Crear evento (backend existente)
- Endpoint backend: `POST /crearEvento`
- El front tiene helper `crearEventoBasico` en `helpersSetDB.js`.

## Campos relevantes (según queries backend)
- `evento.id` (string)
- `evento.nombre`
- `evento.estado` (1 activo, 0 inactivo)
- `evento.idTipoEvento` + `tipo_evento.nombre`
- Fechas:
  - `fechaHoraCeremonia`
  - `fechaHoraRecepcion`
- Lugares:
  - `idLugarCeremonia` / `idLugarRecepcion` (+ nombres via joins)
- Otros usados en UI:
  - `numeroInvitados`
  - `hashtag`
  - `fechaHoraLimiteConfirmar`
  - `imagenPrincipal`
