# Reglas de desarrollo

## Objetivo

Este archivo fija reglas operativas para trabajar el producto entre frontend, backend y base de datos.

## Reglas base

- `docs/product` es la fuente de verdad funcional.
- El backend y el frontend no deben inventar contratos fuera de esa base sin dejarlo documentado.
- Si un cambio afecta datos, primero se revisa esquema y contrato antes de tocar UI.

## Backend

- Todo cambio de esquema debe salir como migracion.
- No hacer cambios manuales a la base si ese cambio debe repetirse en otros entornos.
- Las rutas nuevas deben usar HTTP semantico real.
- Las respuestas deben ser consistentes y faciles de consumir desde frontend.
- Si un modulo depende de tablas incompletas, primero se crea la migracion, luego el endpoint.

## Frontend

- No mostrar rutas falsas o placeholders como si fueran funcionalidades reales.
- El menu debe respetar el manual de producto.
- La navegacion por rol y por evento debe pasar por una sola regla central.
- Si un endpoint aun no existe, usar placeholder explicito o dejar el modulo fuera del menu.
- Cada vez que un flujo ya sea funcional, dejar una lista minima de pruebas manuales para validar en pagina.
- Un modulo funcional no se considera cerrado hasta tener revision UX/UI y estado de diseño aprobado.
- En `base-desarrollo.md` cada punto debe reflejar dos estados:
  - estado funcional
  - estado UX/UI

## Front y back al mismo tiempo

- Primero se define el flujo funcional.
- Luego se define el contrato request/response.
- Luego se ajusta base de datos si hace falta.
- Despues se implementa backend.
- Finalmente se conecta frontend.

## Base de datos

- Usar migraciones siempre.
- Crear migraciones pequenas y enfocadas.
- Probar primero en local.
- Aplicar luego en los otros entornos siguiendo el mismo orden.

## Admin Usuarios

Para este modulo el orden acordado es:

1. migracion base de `usuarioSistema`
2. endpoints backend
3. UI admin
4. asignacion usuario-evento
5. mejoras UX como WhatsApp y estados mas completos

## Validacion manual

- Toda entrega funcional debe cerrar con una lista corta de pruebas manuales.
- Las pruebas deben enfocarse en lo minimo que debe verse correcto en la pagina.
- Si hay backend involucrado, incluir al menos:
  - caso feliz
  - caso de validacion
  - caso de error visible
- Si se cambia backend local, reiniciar el proceso antes de validar el flujo en la pagina.
