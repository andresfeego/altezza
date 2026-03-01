# API endpoints (backend-altezza)

Base: `HOST_NAME` (en Next.js) + `endpoint`.

En VPS LAB típicamente `HOST_NAME=/api/responseAltezza` (same-origin por Nginx).
En local (Mac) típicamente `HOST_NAME=http://localhost:3022/api/responseAltezza`.

## Auth
- `POST /usuario/loginUsuario`
  - body: `{ correo, pass }`

## Catálogos
- `GET /parentescos`
- `GET /gruposEdad`
- `GET /tiposEvento`
- `GET /lugares`

## Eventos
- `GET /eventos/activos`
- `GET /eventos/inactivos`
- `GET /eventoXid/:idEvento`
- `GET /resumenEvento/:idEvento`
- `GET /eventos/detalle_completo/:idEvento`
- `POST /crearEvento`

## Imagen
- `POST /uploadImagenEvento` (multipart)

## Invitaciones / Invitados
- `GET /invitacionesXevento/:idEvento`
- `GET /invitadosXinvitacion/:idInvitacion`
- `GET /invitadosXevento/:idEvento`

- `POST /addInvitacion`
- `POST /addInvitado`
- `POST /importInvitacionesExcel`
- `POST /updConfirmado`
- `POST /updMensajeInvitacion`
- `POST /delInvitacion`
- `POST /delInvitado`

## Mesas
- `GET /mesasXevento/:idEvento`
- `POST /addMesa`
