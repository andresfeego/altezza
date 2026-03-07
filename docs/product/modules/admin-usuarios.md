← Volver al índice: [docs/product/README.md](../README.md)

# 👤 Admin Usuarios

Descripción:
Módulo donde el administrador crea y gestiona las cuentas de usuarios del sistema. Al crear un usuario, el sistema genera automáticamente una contraseña temporal que luego puede ser compartida con el usuario final.

Funciones:

- Crear usuario
- Editar usuario
- Activar o desactivar usuario
- Asignar usuario a uno o varios eventos
- Quitar usuario de un evento
- Ver contraseña temporal generada por el sistema
- Enviar contraseña al usuario por WhatsApp

Notas:
Cuando el administrador crea un usuario, el sistema genera automáticamente una contraseña aleatoria de **8 caracteres alfanuméricos**. Esta contraseña es visible para el administrador dentro del panel.

El sistema genera también un **link de compartir por WhatsApp** que abre un mensaje prellenado con la contraseña. El número de destino se toma del **teléfono registrado en los datos del usuario**.

Ejemplo conceptual del link:
[https://wa.me/{telefono}?text=Tu%20acceso%20a%20Altezza%20es%20usuario:%20{correo}%20contraseña:%20{password}](https://wa.me/{telefono}?text=Tu%20acceso%20a%20Altezza%20es%20usuario:%20{correo}%20contraseña:%20{password})

---

## 👰 CLIENTE
