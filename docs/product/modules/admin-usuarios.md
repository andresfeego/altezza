← Volver al índice: [docs/product/README.md](../README.md)

# 👤 Admin Usuarios

## Rol
ADMIN

## Descripción
Gestión de cuentas de usuarios del sistema. Al crear un usuario, el sistema genera contraseña temporal y un link para enviarla por WhatsApp.

## Funciones
- Crear usuario.
- Editar usuario.
- Activar/desactivar usuario.
- Asignar usuario a uno o varios eventos.
- Quitar usuario de evento.
- Ver contraseña temporal generada.
- Enviar contraseña por WhatsApp.

## Reglas
- Al crear usuario se genera contraseña aleatoria de **8 caracteres alfanuméricos**.
- La contraseña es visible para el admin.
- Se genera link para compartir por WhatsApp con mensaje prellenado.
- El destino del WhatsApp se toma del teléfono del usuario.

## Ejemplo conceptual del link
`https://wa.me/{telefono}?text=Tu%20acceso%20a%20Altezza%20es%20usuario:%20{correo}%20contraseña:%20{password}`
