# Entidades y campos (derivado del código)

> Nota: Esto está derivado de queries SQL dentro del backend (no es un schema formal).

## Usuario del sistema (`usuariosistema` / `usuarioSistema`)
Campos vistos en query de login:
- `id`
- `nombres`
- `apellidos`
- `user` (username)
- `rol` (int)
- `rolNombre` (join `rolSistema.nombre`)
- `telefon`
- `pass` (secreto; no debe salir al front)
- `passTemp` (secreto)
- `idEventoAsignado` (solo rol cliente; join `evento_has_usuario.idEvento`)

## Evento (`evento`)
Campos usados/retornados en distintas queries:
- `id` (string)
- `nombre`
- `estado` (1/0)
- `idTipoEvento` + `tipo_evento.nombre`
- Fechas:
  - `fechaHoraCeremonia`
  - `fechaHoraRecepcion`
  - `fechaHoraLimiteConfirmar` (usado en UI)
- Lugares:
  - `idLugarCeremonia` + nombre
  - `idLugarRecepcion` + nombre
- `numeroInvitados`
- `hashtag`
- `imagenPrincipal` (ruta relativa tipo `/<evento>/<modulo>/file.webp`)

## Tipo de evento (`tipo_evento`)
- `id`
- `nombre`

## Lugar (`lugar`)
- `id`
- `nombre`

## Invitación (`invitacion`)
Campos observados indirectamente:
- `id` (string)
- `mensaje`
- `autoinc` (se usa en ORDER BY)

Relación:
- `evento_has_invitacion(idEvento, idInvitacion)`

## Invitado (`invitado`)
Campos usados en inserts:
- `id` (auto)
- `nombre`
- `principal` (1/0)
- `telefono`
- `wp` (string '1'/'0')
- `parentesco` (FK)
- `grupoEdad` (FK)
- `confirmado` (FK)

Relación:
- `invitacion_has_invitado(idInvitacion, idInvitado)`

## Mesa (`mesa`)
- `id`
- `numeroMesa`

Relación:
- `evento_has_mesa(idEvento, idMesa)`
