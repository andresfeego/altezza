← Volver al índice: [docs/product/README.md](../README.md)

# Comportamientos del sistema — Altezza (MiEvento)

> Fuente: `uploads/andres/inbox/2026-03-07T00-05-16-051Z__altezza_modulos_panel.md`

---

## 1) Acceso del administrador a eventos

### Descripción
Comportamiento del sistema cuando el administrador entra a un evento desde el panel administrativo.

### Flujo

1. El administrador accede al panel administrativo.
2. Ingresa al listado de eventos.
3. Hace clic sobre uno de los eventos.
4. El sistema abre la vista interna de ese evento.
5. Dentro del evento, el administrador ve una interfaz muy similar a la del cliente, basada en módulos.
6. El menú del evento para el administrador mostrará primero los **módulos administrativos por defecto** y después los módulos activos del evento.

### Reglas

- El administrador puede entrar a cualquier evento desde su panel administrativo.
- La vista interna del evento para administrador conserva una lógica similar a la experiencia del cliente, para mantener consistencia de navegación.
- Los **módulos administrativos por defecto** del administrador dentro del evento deben aparecer **al inicio del menú**.
- A continuación de estos se listan los **módulos activos del evento** (los mismos que puede ver el cliente).
- La interfaz debe mostrar un elemento visual diferencial que deje claro que el usuario está dentro de un evento, pero en **modo administrador**.
- Ejemplo de módulo administrativo por defecto: **🎨 Decoración**, que siempre es visible para admin dentro de cada evento y nunca para cliente.

---

## 2) Asignación de usuarios a eventos

### Descripción
Proceso mediante el cual el administrador crea un evento, crea usuarios y posteriormente los vincula para que esos usuarios puedan trabajar dentro del evento como clientes.

### Flujo

1. El administrador crea un evento desde **🎉 Admin Eventos**.
2. El administrador crea uno o varios usuarios desde **👤 Admin Usuarios**.
3. Al crear el usuario, el sistema genera automáticamente una **contraseña aleatoria de 8 caracteres alfanuméricos**.
4. El administrador puede ver la contraseña generada.
5. El administrador puede enviar la contraseña al usuario mediante un **link de WhatsApp**.
6. El número de WhatsApp se toma del **teléfono registrado en el usuario**.
7. El administrador asigna el usuario al evento.
8. El usuario puede iniciar sesión usando las credenciales recibidas.

### Reglas

- La contraseña inicial es generada automáticamente por el sistema.
- El administrador puede copiarla o enviarla mediante WhatsApp.
- El enlace de WhatsApp abre un mensaje prellenado con las credenciales.
- Un usuario solo puede acceder a los eventos a los que fue asignado.

---

## 3) Acceso del usuario después del login (rol Cliente)

### Descripción
Comportamiento del sistema cuando un usuario con rol Cliente inicia sesión.

### Flujo

1. El usuario con rol Cliente inicia sesión en Altezza.
2. El sistema verifica si el cliente tiene un evento asignado.
3. Si **no tiene evento asignado**, se muestra un mensaje indicando que aún no tiene un evento vinculado y que debe comunicarse con el administrador.
4. Si **tiene evento asignado**, el sistema redirige automáticamente al **📰 Feed Evento**.
5. En el Feed del evento el cliente verá el menú con los módulos habilitados para su evento.
6. El Feed mostrará además cards resumen cliqueables de los módulos, con información reciente o destacada de cada uno.

### Reglas

- Aplica solo para usuarios con rol Cliente.
- Un usuario cliente sin evento asignado no puede acceder a módulos.
- Los módulos visibles para el cliente dependen de la configuración del admin al crear el evento.
- El Feed es el punto central de navegación.
- Cada módulo puede tener una vista previa resumida dentro del Feed.
- Cada card resumen debe permitir navegar al módulo completo mediante clic o acción de **Ver más**.

---

## 4) Sincronización en tiempo real de módulos operativos

### Descripción
Los módulos operativos del evento deben sincronizar cambios en tiempo real entre colaboradores y administración.

### Objetivo
Durante la operación de un evento ocurren cambios rápidamente; se debe asegurar que todos los usuarios vean el mismo estado actualizado sin recargar.

### Casos de uso

- Un colaborador marca un ítem como cargado en el camión.
- Otro colaborador ve el cambio inmediatamente.
- El administrador también ve el cambio en tiempo real.
- El progreso general del checklist se actualiza automáticamente.

### Reglas

- Cambios realizados por un usuario deben reflejarse inmediatamente en los demás conectados al mismo evento.
- Cada evento funciona como un canal/sala de sincronización independiente.
- Todos los usuarios conectados al evento reciben actualizaciones.
- Cada cambio debe guardarse en base de datos con:
  - usuario que realizó el cambio
  - fecha y hora
  - estado actualizado

### Módulos afectados

- 🧰 Colaborador Checklist Montaje
- 📦 Colaborador Checklist Recogida
- 📊 Colaborador Dashboard
- Vistas administrativas del evento

### Requerimiento técnico
Usar tecnología de comunicación en tiempo real (por ejemplo WebSockets) para emitir eventos de actualización.
