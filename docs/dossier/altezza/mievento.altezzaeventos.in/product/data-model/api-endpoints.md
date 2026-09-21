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

## Mobiliario
- Categorías: `GET/POST /mobiliario/categorias`, `PUT /mobiliario/categorias/:id`, `PUT /mobiliario/categorias/orden`
- Productos: `GET /mobiliario/productos`, `POST /mobiliario/productos` multipart con dos imágenes, `GET/PUT /mobiliario/productos/:id`, `PATCH /mobiliario/productos/:id/estado`
- Presentaciones internas: `POST /mobiliario/productos/:id/variantes`, `PUT /mobiliario/productos/:id/variantes/:variantId`, `PATCH /mobiliario/productos/:id/variantes/:variantId/estado`
- Inventario: `GET/POST /mobiliario/variantes/:id/movimientos`
- Imágenes: `PUT /mobiliario/productos/:id/imagenes/:tipo`, donde `tipo` es `producto` o `decoracion`
- Configuración pública: `GET/POST/PATCH /mobiliario/catalogo-publico/*`
- Público: `GET /public/mobiliario/catalogo/:publicCode`, `GET /public/mobiliario/media/:imagePublicCode`

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

### Catálogo mobiliario: estilos y códigos (2026-09-11)

- `PATCH /mobiliario/catalogo-publico/estilo` (Admin): `{ colorPrimario, colorSecundario }`, HEX `#RRGGBB`; responde `{ success, item }` y errores por `fields`.
- GET de configuración incluye colores y `edicion` (`YYYY-MM`). GET público incorpora `config` incluso vacío y `products[].codigo`; no entrega SKU ni inventario. Caché pública del JSON: `no-store`.
- Listado/detalle administrativo incluyen `codigo` y `consecutivo`; categorías incluyen `prefijo`. La búsqueda administrativa añade código a los criterios anteriores.

- Orden de productos (Admin): `GET /mobiliario/categorias/:id/productos/orden` → `{ items }` sin paginación; `PUT` misma ruta con `{ ids }` → `{ success, items }`. Lista completa sin duplicados, restringida a la categoría; posiciones guardadas transaccionalmente en `mobiliario_producto.orden`.
