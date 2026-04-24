← Volver al índice: [docs/product/README.md](../README.md)

# Comportamientos del sistema — Altezza (MiEvento)

> Fuente: `uploads/andres/inbox/2026-03-07T00-05-16-051Z__altezza_modulos_panel.md`

---

# 1) Acceso del administrador a eventos

## Descripción

Comportamiento del sistema cuando el administrador entra a un evento desde el panel administrativo.

Flujo:

1. El administrador accede al panel administrativo.
2. Ingresa al listado de eventos.
3. Hace clic sobre uno de los eventos.
4. El sistema abre el **workspace administrativo del evento**.
5. Dentro de este workspace el administrador ve un resumen del evento, acciones globales y accesos a los módulos que puede gestionar.
6. El administrador puede entrar a módulos administrativos del evento y también configurar qué módulos estarán disponibles para el cliente.
7. Si necesita revisar la experiencia cliente, lo hará mediante una acción explícita de **preview** o **ver como cliente**, no reutilizando la navegación principal del cliente.

## Reglas

- El administrador puede entrar a cualquier evento desde su panel administrativo.
- Las rutas `/evento/...` quedan reservadas para la experiencia del cliente.
- El administrador no debe entrar al feed cliente como flujo principal de trabajo.
- La gestión del evento para admin debe vivir bajo rutas separadas del tipo `/admin/eventos/:id...`.
- El workspace admin del evento debe exponer acciones generales del evento y accesos a módulos administrativos o de configuración.
- La configuración de módulos del cliente se gestiona desde el workspace admin del evento.
- Si existe un modo preview para revisar la experiencia cliente, debe estar visualmente diferenciado y ser secundario frente al workspace admin.
- Un ejemplo de módulo administrativo por defecto es **🎨 Decoración**, visible para admin dentro del evento y nunca para cliente.

---

# 2) Asignación de usuarios a eventos

## Descripción

Proceso mediante el cual el administrador crea un evento, crea usuarios y posteriormente los vincula para que esos usuarios puedan trabajar dentro del evento como clientes.

Flujo:

1. El administrador crea un evento desde **🎉 Admin Eventos**.
2. El administrador crea uno o varios usuarios desde **👤 Admin Usuarios**.
3. Al crear el usuario, el sistema genera automáticamente una **contraseña aleatoria de 8 caracteres alfanuméricos**.
4. El administrador puede ver la contraseña generada.
5. El administrador puede enviar la contraseña al usuario mediante un **link de WhatsApp**.
6. El número de WhatsApp se toma del **teléfono registrado en el usuario**.
7. El administrador asigna el usuario al evento.
8. El usuario puede iniciar sesión usando las credenciales recibidas.

## Reglas

- La contraseña inicial es generada automáticamente por el sistema.
- El administrador puede copiarla o enviarla mediante WhatsApp.
- El enlace de WhatsApp abre un mensaje prellenado con las credenciales.
- Un usuario solo puede acceder a los eventos a los que fue asignado.

---

# 3) Acceso del usuario después del login

## Descripción

Comportamiento del sistema cuando un **usuario con rol Cliente** inicia sesión.

Flujo:

1. El **usuario con rol Cliente** inicia sesión en Altezza.
2. El sistema verifica cuántos eventos tiene asignados el cliente.
3. Si **no tiene eventos asignados**, entra a **🏠 Cliente Home** y ve un empty state.
4. Si **tiene un solo evento**, entra directamente al **Feed del evento**.
5. Si **tiene dos o más eventos**, entra a **🏠 Cliente Home** como selector de eventos.
6. Una vez existe un evento activo, el menú del cliente muestra solo los módulos habilitados para ese evento.
7. El feed del evento muestra además **cards resumen cliqueables** de los módulos habilitados, con información reciente o destacada de cada uno.

## Reglas

- Este comportamiento aplica **solo para usuarios con rol Cliente**.
- Un usuario cliente sin evento asignado no puede acceder a módulos del evento.
- Los módulos visibles para el cliente dependen de la configuración realizada por el administrador al crear el evento.
- `Cliente Home` funciona como empty state cuando no hay eventos y como selector cuando hay múltiples eventos.
- El `Feed del evento` funciona como la experiencia principal del cliente cuando ya existe un evento activo.
- Sin evento activo, el menú cliente no debe mostrar módulos del evento.
- Cada módulo puede tener una **vista previa resumida** dentro del feed del evento.
- Cada card resumen debe permitir navegar al módulo completo mediante clic o acción de **Ver más**.

---

# 4) Sincronización en tiempo real de módulos operativos

## Descripción

Los módulos operativos del evento deben sincronizar cambios en tiempo real entre colaboradores y administración para garantizar que todos los usuarios vean el mismo estado actualizado sin necesidad de recargar la página.

## Objetivo

Durante la operación de un evento muchos cambios ocurren rápidamente (por ejemplo carga de mobiliario, verificación de elementos o recogida al finalizar el evento). Por esta razón el sistema debe asegurar que todos los participantes estén viendo exactamente la misma información en todo momento.

## Casos de uso

- Un colaborador marca un ítem como cargado en el camión.
- Otro colaborador ve el cambio inmediatamente en su dispositivo.
- El administrador también ve el cambio en su panel en tiempo real.
- El progreso general del checklist se actualiza automáticamente para todos.

Reglas del sistema:
- Los cambios realizados por un usuario deben reflejarse inmediatamente en los demás usuarios conectados al mismo evento.
- Cada evento debe funcionar como un canal o sala de sincronización independiente.
- Todos los usuarios conectados a ese evento reciben las actualizaciones.
- Cada cambio debe guardarse en base de datos junto con:
  - usuario que realizó el cambio
  - fecha y hora
  - estado actualizado del elemento

## Módulos afectados

La sincronización en tiempo real aplica especialmente a:

- 🧰 Colaborador Checklist Montaje
- 📦 Colaborador Checklist Recogida
- 🏠 Colaborador Home
- vistas administrativas del evento

## Requerimiento técnico

La plataforma debe utilizar una tecnología de comunicación en tiempo real (por ejemplo WebSockets) para emitir eventos de actualización cuando se modifique el estado de los elementos del evento.

Esto garantiza que el sistema funcione correctamente durante la operación real de los eventos, donde múltiples usuarios interactúan simultáneamente con la misma información.


---

## 🔶 FUNCIONALIDAD OPCIONAL — EVENT MODE

---
