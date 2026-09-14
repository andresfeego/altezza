# Módulo: Mobiliario

## Rol y rutas

- Admin: `/admin/mobiliario`
- Público: `/catalogo-mobiliario/[publicCode]`

## Objetivo

Centralizar categorías, fichas visuales, presentaciones e inventario propio de Altezza y publicar esa misma fuente como catálogo editorial sin información comercial interna.

## UI / Pantallas

- `pages/admin/mobiliario/index.js`: indicadores, URL pública, filtros y listado desktop/mobile.
- `components/admin/mobiliario/MobiliarioModals.js`: alta mínima, edición con presentaciones, categorías y movimientos.
- `pages/catalogo-mobiliario/[publicCode].js`: banner de edición, select de categorías, búsqueda por nombre/color/código y fichas alternadas (máximo 1024 px; apiladas en móvil).

## Datos y reglas

- Producto: categoría, nombre, color, orden y estado; se crea en borrador sin inventario.
- Presentación interna: SKU automático, medidas e inventario. Una presentación se trata como producto simple; varias representan tamaños.
- Movimiento: tipo, cantidad, saldos antes/después, motivo, administrador y fecha.
- Imagen: tipo `producto` o `decoracion`, código público, objetos R2 full/preview, dimensiones, alt y estado.
- Publicación requiere categoría activa, ambas imágenes y una presentación activa.
- Inventario no admite negativos ni fuera de servicio por encima de existencia.
- Solo los movimientos modifican inventario después del alta inicial.
- El payload público excluye precios, existencias, disponibilidad, depósitos, reposición y SKU.

## API y persistencia

Base `/api/responseAltezza`. CRUD administrativo bajo `/mobiliario/*`; catálogo en `GET /public/mobiliario/catalogo/:publicCode` y media en `GET /public/mobiliario/media/:imagePublicCode`.

Migraciones aisladas `20260907_002`, `_003`, `_004` y `_005`. Siete tablas `mobiliario_*` en MariaDB, nombres minúsculos y collation `utf8mb4_unicode_ci`. La migración `_005` retira campos comerciales y tipa las dos imágenes. Las fotos permanecen privadas en R2 y se sirven con firma temporal.

R2 se configura solo en backend mediante `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` y `R2_BUCKET_REGION`; las claves nunca llegan al frontend.

## Estado

Implementación funcional terminada. La integración posterior con alquileres, reservas, proveedores y disponibilidad por fechas queda fuera de esta fase.


## Actualización 2026-09-11

Migraciones `_006_mobiliario_codigos` y `_007_mobiliario_catalogo_estilo`: prefijos permanentes 10–18 para categorías base, consecutivos transaccionales no reutilizables y `codigo` público por producto; cambio de categoría reasigna código. Nuevas categorías usan prefijos 19–99. El consecutivo crece más allá de 99 (`10100`). `publicCode` y SKU se conservan.

La configuración añade dos colores HEX editables en la card del catálogo y `edicion` YYYY-MM calculada en Colombia al generar/regenerar enlace. Endpoint administrativo `PATCH /mobiliario/catalogo-publico/estilo`; GET público agrega `config` incluso vacío. Edición preservada al reactivar; colores preservados siempre. Contrato detallado y pruebas: `docs/product/modules/admin-mobiliario.md`.
