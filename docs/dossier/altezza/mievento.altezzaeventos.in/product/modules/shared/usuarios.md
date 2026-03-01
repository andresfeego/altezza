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
  - redirige a: `/evento/feed/<idEvento>`
  - `idEvento` viene del backend como `idEventoAsignado`.
- Si no es cliente:
  - redirige a home según rol: `getHomePathByRole(rol)`.

## Respuesta esperada del backend
El frontend soporta 2 formas:
- `{ success, userId, usuario }`
- o directamente `usuario`

Campos usados por el front:
- `id`
- `rol`
- `rolNombre`
- `idEventoAsignado` (solo rol cliente)

## Pendiente (no implementado hoy)
- Flujo de recuperación/cambio de contraseña en UI.
- Manejo de errores específico (hoy es genérico: "Hubo un error...").
