# Módulo: Invitados

## Endpoints backend existentes
- `GET /invitacionesXevento/:idEvento`
- `GET /invitadosXinvitacion/:idInvitacion`
- `GET /invitadosXevento/:idEvento`
- `POST /addInvitacion` (body: `idEvento`)
- `POST /addInvitado` (body: `idInvitacion`, `nombre`, `principal`, `telefono`, `wp`, `parentesco`, `grupoEdad`)
- `POST /updConfirmado` (body: `idInvitado`, `confirmado`)
- `POST /updMensajeInvitacion` (body: `idInvitacion`, `mensaje`)
- `POST /delInvitacion` (body: `idInvitacion`)
- `POST /delInvitado` (body: `idInvitacion`, `idInvitado`)
- `POST /importInvitacionesExcel` (body: `data`, `idEvento`)

## Catálogos
- `GET /parentescos`
- `GET /gruposEdad`

## Tablas implicadas (según queries)
- `evento`
- `invitacion`
- `evento_has_invitacion`
- `invitado`
- `invitacion_has_invitado`
- `parentesco`
- `grupoEdad`
- `confirmado`
