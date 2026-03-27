# Fase 1 — Cierre operativo

> Documento operativo de trabajo para cerrar la Fase 1 sin mezclar el detalle ejecutable dentro de `base-desarrollo.md`.

---

## Objetivo

Cerrar la base transversal del producto para que autenticación, roles, navegación, contexto de evento y permisos queden consistentes antes de entrar a la Fase 2.

---

## Relación con el documento base

- `base-desarrollo.md` sigue siendo el documento rector de producto
- este archivo se usa para ejecutar, chequear y validar el cierre operativo de Fase 1
- cualquier cambio de criterio de producto debe reflejarse primero en `base-desarrollo.md`

---

## Definiciones acordadas

### Regla de entrada por rol

- `Admin` entra a `/home/admin`
- `Cliente` entra a `/home/cliente` si tiene `0` o `2+` eventos y entra directo al `Feed` si tiene `1`
- `Organizador` entra a `/home/organizador`
- `Colaborador` entra a `/home/colaborador`

### Regla para cliente sin evento asignado

- el cliente no se bloquea fuera del producto
- entra a `Cliente Home`
- `Cliente Home` muestra un empty state de no tiene eventos asignados
- el menú cliente no activa módulos mientras no exista un evento activo
- cualquier ruta de módulo que dependa de evento debe redirigir al `Cliente Home`

### Regla para cliente con eventos asignados

- si el cliente tiene `1` evento, entra directo al `Feed` de ese evento
- si el cliente tiene `2 o más` eventos, entra a `Cliente Home` como selector de eventos
- el frontend resuelve un único `evento activo`
- los módulos visibles dependen de la configuración habilitada para ese evento
- no se permite acceso manual a módulos no habilitados ni a rutas de evento sin selección válida

### Decisión de arquitectura para Admin Eventos

- las rutas `/evento/...` quedan reservadas para cliente
- admin no debe trabajar sobre el feed cliente como flujo principal
- `Admin Eventos` debe evolucionar hacia un workspace propio por evento bajo rutas tipo `/admin/eventos/:id...`
- dentro de ese workspace vivirán:
  - resumen general del evento
  - configuración de módulos cliente
  - accesos a módulos administrativos o de gestión
  - preview cliente solo como acción secundaria cuando haga falta
- avance actual:
  - `✅ /admin/eventos/:id`
  - `✅ /admin/eventos/:id/datos`
  - `✅ /admin/eventos/:id/usuarios`
  - `✅ /admin/eventos/:id/preview`

### Regla de base de datos y backend

- no se deben inferir nombres de tablas, columnas o contratos
- antes de tocar migrations o backend se valida el esquema real en base local
- se trabaja sobre la rama `fase_1`

---

## Bloques de trabajo

## 1. Roles y destino inicial

Objetivo:

- dejar una sola regla de entrada por rol

Checklist:

- [ ] revisar lógica actual de redirección en login
- [x] revisar lógica actual de redirección en `_app.js`
- [x] definir un único helper de destino inicial por rol
- [x] eliminar duplicidad entre home por rol y redirección a evento
- [ ] validar navegación inicial para los 4 roles

Validación:

- [ ] admin entra a `/home/admin`
- [ ] cliente entra a `/home/cliente`
- [ ] organizador entra a `/home/organizador`
- [ ] colaborador entra a `/home/colaborador`

Estado: `en curso`

---

## 2. Contexto de evento activo

Objetivo:

- centralizar la resolución del evento activo del cliente

Checklist:

- [x] definir fuente de verdad para `idEventoAsignado`
- [x] crear helper o store de `evento activo`
- [ ] desacoplar la lógica del evento activo del store de usuario cuando aplique
- [x] definir comportamiento cuando no hay evento asignado
- [x] definir comportamiento cuando la ruta manual no coincide con el evento permitido

Validación:

- [x] cliente con evento asignado mantiene contexto consistente
- [x] cliente sin evento asignado cae en `Cliente Home`
- [x] rutas manuales inválidas redirigen correctamente

Estado: `en revision`

---

## 3. Cliente Home sin evento asignado

Objetivo:

- resolver el caso vacío sin sacar al usuario de su superficie principal

Checklist:

- [x] diseñar el empty state funcional
- [x] definir mensaje principal y mensaje secundario
- [ ] revisar qué acciones visibles debe tener el usuario en ese estado
- [x] ocultar accesos a módulos dependientes de evento
- [x] validar consistencia visual con el resto del sistema

Validación:

- [x] home carga sin error cuando `idEventoAsignado` no existe
- [x] el usuario entiende que aún no tiene evento asignado
- [x] el menú no expone módulos inválidos

Estado: `en revision`

---

## 4. Navegación por rol

Objetivo:

- alinear el menú visible con el manual y con el estado real del producto

Checklist:

- [x] auditar `menuItems`
- [x] remover accesos que no correspondan al rol
- [x] ocultar rutas placeholder que parezcan módulos reales
- [x] revisar navegación de organizador y colaborador
- [x] revisar menú del cliente según módulos habilitados
- [x] revisar accesos directos desde cards o menús secundarios
- [x] cerrar la regla de que `/evento/...` es solo cliente
- [x] rediseñar acceso de cards de `Admin Eventos` hacia workspace admin propio
- [x] crear subrutas admin base del evento

Validación:

- [ ] cada rol ve solo lo que le corresponde
- [x] no hay rutas falsas visibles
- [ ] cliente no ve módulos deshabilitados o inexistentes

Estado: `en revision`

---

## 5. Módulos habilitados por evento

Objetivo:

- crear el contrato real que habilita o deshabilita módulos cliente por evento

Checklist frontend:

- [x] definir catálogo oficial de módulos cliente
- [x] definir estructura de datos esperada desde backend
- [x] cargar configuración al entrar al contexto del evento
- [x] filtrar menú cliente
- [x] filtrar cards o resúmenes del home/feed cliente
- [x] bloquear acceso manual por URL

Checklist backend:

- [x] confirmar modelo real en base de datos
- [x] definir dónde se guarda la activación de módulos por evento
- [x] exponer endpoint o contrato consumible por frontend
- [x] devolver claves estables para cada módulo

Checklist db:

- [x] validar nombres reales de tablas y columnas contra la base local
- [x] crear migration solo después de confirmar naming exacto
- [x] probar migration en entorno local real

Validación:

- [x] un evento puede tener módulos activos e inactivos
- [x] frontend refleja esa configuración sin hardcodes rotos
- [x] una URL manual a módulo inactivo redirige

Estado: `en revision`

---

## 6. Guardas de acceso

Objetivo:

- impedir navegación inválida por sesión, rol, evento o módulo

Checklist:

- [ ] definir guarda por sesión
- [ ] definir guarda por rol
- [x] definir guarda por evento asignado
- [x] definir guarda por módulo habilitado
- [x] centralizar la lógica para no repetir validaciones en varias capas

Validación:

- [ ] usuario sin sesión va al login
- [ ] usuario con rol incorrecto redirige a su home
- [x] cliente sin evento no entra a módulos de evento
- [x] cliente con módulo deshabilitado no entra a esa ruta

Estado: `en curso`

---

## 7. Normalización estructural

Objetivo:

- corregir inconsistencias antes de seguir desarrollando módulos nuevos

Checklist:

- [x] detectar rutas fuera del patrón esperado
- [ ] detectar enlaces duplicados o inconsistentes
- [x] revisar placeholders que aparentan funcionalidad real
- [ ] eliminar decisiones dispersas en varios archivos para el mismo flujo
- [x] dejar una estructura clara para continuar con Fase 2
- [x] fijar la convención de que admin-evento y cliente-evento son superficies distintas
- [x] dejar base administrativa del evento con `Resumen`, `Datos`, `Usuarios` y `Preview`

Validación:

- [ ] no quedan rutas placeholder visibles
- [ ] la navegación principal responde a una sola convención
- [ ] la base queda lista para extender módulos sin deuda evitable

Estado: `en revision`

---

## Dependencias externas por confirmar

- [x] ruta exacta del backend
- [x] rama actual de trabajo para esta etapa
- [x] método de conexión a la base local
- [x] esquema real actual de tablas relacionadas con evento, usuario y activación de módulos

---

## Validación integral de cierre

- [ ] login y redirección inicial consistentes
- [ ] cliente sin evento entra a home con empty state correcto
- [ ] cliente con evento opera dentro de un contexto válido
- [ ] menú coincide con rol y estado del evento
- [ ] guardas bloquean accesos no autorizados
- [ ] frontend y backend usan contrato real, no inferido
- [x] Fase 1 queda lista para construir el workspace admin por evento
- [x] existe base real del workspace admin por evento

---

## Registro de trabajo

### Estado general

- Fase 1 cierre operativo: `en curso`

### Próximo bloque a ejecutar

- cerrar validación manual de `Admin Evento` y decidir el siguiente módulo administrativo real a profundizar
