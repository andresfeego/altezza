# Módulo: Usuarios

## Pantalla(s)
- Login: `pages/_api/Login/login.js`

## Funcionalidad actual
- Formulario con:
  - `Usuario` (campo `correo` en UI, pero realmente es `user`/username)
  - `Contraseña`
- Al hacer login, guarda usuario en el store (`useUsuarioStore`) y redirige según rol.

## Roles (según uso en frontend)
- Si el usuario es **CLIENTE**:
  - con `0` eventos: redirige a `/home/cliente`
  - con `1` evento: redirige a `/evento/feed/<idEvento>`
  - con `2+` eventos: redirige a `/home/cliente`
  - el backend entrega `eventosAsignados` y el front resuelve `eventoActivo`.
- Si no es cliente:
  - redirige a home según rol: `getHomePathByRole(rol)`.
  - no debe recibir eventos asignados en login.

## Respuesta esperada del backend
El frontend soporta 2 formas:
- `{ success, userId, usuario }`
- o directamente `usuario`

Campos usados por el front:
- `id`
- `rol`
- `rolNombre`
- `eventosAsignados` (solo rol cliente)
- `idEventoAsignado` como compatibilidad cuando solo existe un evento asignado

## Pendiente (no implementado hoy)
- Flujo de recuperación/cambio de contraseña en UI.
- Manejo de errores específico (hoy es genérico: "Hubo un error...").
