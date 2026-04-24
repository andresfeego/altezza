# Base de desarrollo por módulos — Altezza (MiEvento)

> Alcance de esta base: se toma como fuente de verdad únicamente la carpeta `docs/product` y se contrasta contra el código actual del proyecto.

---

## Objetivo

Este documento define:

1. El orden recomendado de desarrollo por dependencias entre módulos.
2. Lo que ya existe hoy en el código.
3. Lo que debe corregirse o construirse para que el sistema concuerde con el manual de producto.

---

## Criterios base

- Primero se desarrolla lo que crea el contexto del evento.
- Después lo que habilita acceso, navegación y permisos.
- Luego los módulos de operación compartidos.
- Finalmente los módulos complementarios, de contenido o fases opcionales.
- Cada módulo debe evaluarse en dos capas:
  - funcionalidad
  - diseño aprobado UX/UI
- La superficie inicial por rol se documenta con una sola convención:
  - `Dashboard` solo para `Admin`
  - `Home` para `Cliente`, `Organizador` y `Colaborador`

## Superficies iniciales por rol

- `Admin` entra a `Admin Dashboard`
- `Cliente` entra a `Cliente Home` si tiene `0` o `2+` eventos y entra directo al `Feed del evento` si tiene `1`
- `Organizador` entra a `Organizador Home`
- `Colaborador` entra a `Colaborador Home`

## Decisión de arquitectura acordada

- las rutas `/evento/...` quedan reservadas para la experiencia `Cliente`
- `Admin` no reutiliza el feed cliente como flujo principal de trabajo
- la gestión del evento para `Admin` debe vivir en un workspace propio bajo rutas tipo `/admin/eventos/:id...`
- desde ese workspace el admin configura módulos cliente, entra a módulos administrativos del evento y, si aplica, abre un preview cliente como acción secundaria
- el workspace admin base ya quedó abierto en:
  - `/admin/eventos/:id`
  - `/admin/eventos/:id/datos`
  - `/admin/eventos/:id/usuarios`
  - `/admin/eventos/:id/preview`

## Matriz de resúmenes por superficie inicial

Esta matriz existe para no olvidar qué módulos deben aportar resumen en la pantalla inicial de cada rol.

| Módulo | Tiene resumen inicial | Superficie | Rol | Estado |
| --- | --- | --- | --- | --- |
| Admin Eventos | Sí | Admin Dashboard | Admin | `🧪 Pendiente validar` |
| Admin Usuarios | Sí | Admin Dashboard | Admin | `🧪 Pendiente validar` |
| Admin Alquiler | Sí | Admin Dashboard | Admin | `🧪 Pendiente validar` |
| Admin Cotizador | Sí | Admin Dashboard | Admin | `🧪 Pendiente validar` |
| Admin Decoración | Sí | Admin Dashboard | Admin | `🧪 Pendiente validar` |
| Datos Evento | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Invitados | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Invitaciones | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Acomodación | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Pendientes | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Timming | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Paletas Colores | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Pastel | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Inspiración | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Calculador Trago | Sí | Cliente Home | Cliente | `🧪 Pendiente validar` |
| Organizador Alquiler Mobiliario | Sí | Organizador Home | Organizador | `🧪 Pendiente validar` |
| Colaborador Agenda | Sí | Colaborador Home | Colaborador | `🧪 Pendiente validar` |
| Colaborador Checklist Montaje | Sí | Colaborador Home | Colaborador | `🧪 Pendiente validar` |
| Colaborador Checklist Recogida | Sí | Colaborador Home | Colaborador | `🧪 Pendiente validar` |

Regla:

- si un módulo debe ser visible como entrada rápida del rol, debe quedar registrado aquí antes de desarrollarse
- si un módulo no requiere resumen inicial, debe quedar explícito en su documentación

---

## Orden recomendado de desarrollo

### Fase 1. Base transversal

Objetivo: dejar lista la estructura mínima para que cualquier módulo funcione sobre un evento real.

Incluye:

- login
- roles y redirección por rol
- persistencia de sesión
- evento asignado al usuario
- navegación por rol
- activación de módulos por evento

Entrega esperada:

- un usuario cliente entra al contexto correcto según `0/1/N` eventos asignados
- un admin entra y ve su panel
- cada rol solo ve módulos válidos para su experiencia

Dependencias:

- ninguna, es la base

Estado general actual: `🟡 Parcial`

#### Convención visual de estados

- `🟢 Hecho`
- `🟡 Parcial`
- `🟠 En revisión`
- `🔴 No iniciado`
- `⛔ Bloqueado`
- `🧪 Pendiente validar`
- `🎨 Diseño pendiente`
- `✨ Diseño aprobado`

#### Convención de cierre por módulo

- `Estado funcional`: mide si el flujo ya opera de punta a punta.
- `Estado UX/UI`: mide si la experiencia ya quedó amigable, clara y aprobada visualmente.
- Un módulo no se considera cerrado solo por funcionar.
- El cierre real requiere:
  - `Estado funcional: 🟢 Hecho`
  - `Estado UX/UI: ✨ Diseño aprobado`

#### 1. 🔐 Login y sesión

Estado: `🟡 Parcial`
Estado funcional: `🟢 Hecho`
Estado UX/UI: `🎨 Diseño pendiente`

Objetivo:

- autenticar al usuario
- persistir su sesión
- redirigirlo al punto correcto del producto

Ya existe:

- formulario de login
- consumo del endpoint de autenticación
- persistencia con Zustand
- redirección básica por rol
- manejo de errores con toast
- flujo de contraseña temporal con cambio de contraseña y login automático

Falta:

- mejorar jerarquía visual del formulario
- mejorar feedback visual de estados de carga
- revisar espaciado, accesibilidad y claridad del mensaje principal
- alinear la pantalla con una propuesta UX/UI final de producto
- definir versión final de la pantalla para cliente sin evento asignado

Riesgo técnico:

- hoy el login funciona, pero la lógica de entrada del usuario está repartida entre varias capas

Pendientes acordados:

- `🧪` pantalla más completa para cliente sin evento asignado: pendiente hasta construir creación/asignación de usuarios desde admin
- `🧪` patrón formal de autovalidación de campos: pendiente para el siguiente desarrollo de Fase 1

#### 2. 👤 Roles y destino inicial por rol

Estado: `🟡 Parcial`
Estado funcional: `🟢 Hecho`
Estado UX/UI: `🟡 Parcial`

Objetivo:

- que cada rol tenga un punto de entrada consistente

Ya existe:

- constantes de roles
- función central para resolver destino inicial por usuario/rol
- homes base para admin, cliente, organizador y colaborador

Falta:

- llevar esa lógica a una experiencia visual consistente entre pantallas
- definir mejor las pantallas vacías para roles todavía no desarrollados
- validar manualmente entrada real de los 4 roles

Riesgo técnico:

- hoy hay mezcla entre home por rol y navegación directa al evento
- la arquitectura de `Admin Eventos` todavía debe separarse formalmente de la experiencia cliente del evento

#### 3. 🎫 Contexto de evento asignado

Estado: `🟡 Parcial`
Estado funcional: `🟡 Parcial`
Estado UX/UI: `🎨 Diseño pendiente`

Objetivo:

- que el cliente opere siempre dentro del evento correcto

Ya existe:

- `eventosAsignados` en sesión para cliente
- `idEventoAsignado` solo como compatibilidad o caso único
- `evento activo` resuelto en frontend
- rutas dinámicas para `Feed del evento` y `Datos Evento`

Falta:

- terminar de validar el caso `cliente con 2+ eventos` con data real
- desacoplar más el contexto de evento activo del store de usuario si luego el producto lo requiere

Riesgo técnico:

- hoy el contexto del evento depende demasiado del store y no de una capa explícita de control

#### 4. 🧭 Navegación por rol

Estado: `🟡 Parcial`
Estado funcional: `🟢 Hecho`
Estado UX/UI: `🟡 Parcial`

Objetivo:

- que el menú y la navegación representen exactamente el manual de producto

Ya existe:

- `SideMenu`
- `menuItems`
- construcción básica por rol

Falta:

- validar manualmente navegación por rol
- seguir reemplazando placeholders cliente por módulos funcionales
- decidir siguientes superficies reales para organizador y colaborador

Riesgo técnico:

- el producto visible hoy no coincide con la definición funcional del manual

Avance aplicado:

- `✅` se removió `Decoración` del menú cliente porque en el manual es solo admin
- `✅` se agregaron `Invitaciones` y `Acomodación` a la navegación base del cliente
- `✅` organizador y colaborador dejaron de mostrar rutas falsas tipo `/url_vacia`
- `🧪` `Invitaciones` y `Acomodación` quedaron solo con placeholder mínimo hasta construir su lógica real
- `✅` las cards de `Admin Eventos` ya entran al workspace admin del evento
- `✅` el header superior ya soporta volver a `Admin Eventos` desde las subrutas del workspace

#### 5. 🧩 Activación de módulos por evento

Estado: `🟡 Parcial`
Estado funcional: `🟢 Hecho`
Estado UX/UI: `🟡 Parcial`

Objetivo:

- que el cliente vea únicamente los módulos habilitados por el administrador para su evento

Ya existe:

- modelo y endpoint de módulos habilitados por evento
- carga de esa configuración en frontend
- filtrado real de menú cliente
- filtrado de previews en feed cliente
- bloqueo de acceso manual a módulos deshabilitados
- gestión administrativa de módulos dentro del workspace del evento
- guardado inmediato por módulo desde admin
- preview administrativo del estado visible para cliente

Falta:

- validar manualmente el flujo final de configuración y preview
- cerrar detalles visuales pendientes del panel admin-evento

Riesgo técnico:

- esta es una regla central del producto y ya existe base funcional, pero aún falta validación integral y cierre visual

#### 6. 🛡️ Guardas de acceso y permisos

Estado: `🟡 Parcial`
Estado funcional: `🟡 Parcial`
Estado UX/UI: `🎨 Diseño pendiente`

Objetivo:

- impedir accesos por sesión inválida, rol incorrecto o módulo no habilitado

Ya existe:

- protección básica de rutas en `_app.js`

Falta:

- guardas por rol
- guardas por evento asignado
- guardas por módulo habilitado
- validación de acceso a rutas administrativas y de evento

Riesgo técnico:

- hoy un usuario autenticado todavía puede llegar a rutas que no representan bien su experiencia real

#### 7. 🧱 Normalización estructural

Estado: `🔴 No iniciado`
Estado funcional: `🔴 No iniciado`
Estado UX/UI: `🔴 No iniciado`

Objetivo:

- limpiar inconsistencias antes de seguir desarrollando módulos

Ya existe:

- la estructura mínima de rutas y componentes

Falta:

- corregir rutas mal armadas
- corregir enlaces fuera del patrón `/evento/...`
- eliminar lógica duplicada en navegación
- reemplazar placeholders que hoy parecen módulos reales

Riesgo técnico:

- si no se corrige ahora, cada módulo nuevo heredará una base inconsistente

#### Checklist operativo de cierre para Fase 1

- `🧪` Login validado con respuestas correctas y erróneas
- `🧪` Redirección única y consistente por rol
- `🧪` Cliente siempre entra a su evento asignado
- `🧪` Menú visible coincide con el manual
- `🧪` Módulos del cliente se filtran por evento
- `🧪` Rutas no autorizadas redirigen correctamente
- `🧪` Organizador y colaborador no muestran navegación falsa
- `🎨` Login tiene una UI clara y aprobada
- `🎨` Administración de usuarios tiene layout, jerarquía y acciones UX aprobadas
- `🎨` Estados vacíos, cargas y errores tienen tratamiento visual consistente

#### Matriz de contrato Fase 1: producto vs frontend vs backend

| Punto Fase 1 | Manual de producto pide | Frontend hoy | Backend hoy | Estado | Brecha principal |
| --- | --- | --- | --- | --- | --- |
| 🔐 Login | autenticación y entrada correcta al producto | login funcional con store persistente, toasts y cambio de contraseña temporal | `POST /usuario/loginUsuario` devuelve `usuario`, `userId`, `rol`, `rolNombre`, `idEventoAsignado` para cliente | `🟡 Parcial` | funcionalmente ya opera, pero falta aprobar UX/UI final y resolver la pantalla final para cliente sin evento |
| 👤 Roles | experiencia distinta por rol | roles y destinos iniciales base ya unificados | el login sí devuelve `rol` y `rolNombre` | `🟡 Parcial` | la base funcional ya existe, pero las pantallas por rol aún no tienen cierre visual ni estados vacíos maduros |
| 🎫 Evento asignado | el cliente entra a su evento asignado | usa `idEventoAsignado` para construir rutas cliente | el backend entrega `idEventoAsignado` solo para rol cliente | `🟡 Parcial` | falta proteger el caso sin evento asignado y centralizar ese contexto |
| 🧭 Navegación por rol | cada rol ve solo lo suyo | `SideMenu` y `menuItems` existen | backend no participa en esta decisión | `🟡 Parcial` | el menú no coincide con el manual y contiene rutas placeholder |
| 🧩 Módulos habilitados por evento | cliente ve solo módulos activos de su evento | no existe filtrado real por evento | no existe endpoint o modelo visible para módulos habilitados por evento | `🔴 No iniciado` | falta contrato completo front-back para configuración de módulos |
| 🛡️ Guardas de acceso | bloquear rutas por sesión, rol y evento | `_app.js` protege sesión básica | backend no expone una capa de permisos de producto | `🟡 Parcial` | no hay control real por módulo habilitado ni por acceso indebido al evento |
| 🧱 Normalización estructural | rutas consistentes y sin navegación falsa | hay rutas y links inconsistentes | backend sí tiene endpoints base coherentes para eventos/login | `🔴 No iniciado` | el problema principal está en la capa frontend |

#### Estado puntual de lo ya trabajado

##### 🔐 Login y sesión

- Estado funcional: `🟢 Hecho`
- Estado UX/UI: `🎨 Diseño pendiente`

Ya quedó:

- login con manejo de errores por `toast`
- redirección por rol
- contraseña temporal detectada por backend
- flujo para cambio de contraseña temporal
- login automático después del cambio de contraseña

Falta para aprobación UX/UI:

- mejorar composición visual del login
- definir jerarquía más clara entre branding, formulario y ayuda
- revisar estados de carga, foco, error y éxito
- decidir diseño final del caso "cliente sin evento"

##### 👥 Administración de usuarios

- Estado funcional: `🟢 Hecho`
- Estado UX/UI: `🎨 Diseño pendiente`

Ya quedó:

- listado de usuarios
- creación de usuario
- edición de usuario
- asignación y retiro de eventos
- regeneración y copiado de `passTemp`
- mensajes por `toast`

Falta para aprobación UX/UI:

- mejorar jerarquía visual de tabla y formulario
- trabajar mejor acciones por fila para escritorio y móvil
- revisar densidad visual, estados vacíos y microcopys
- pulir consistencia entre botones primarios, secundarios y estados activos/inactivos

#### Detalle por contrato

##### 1. 🔐 Autenticación

Contrato útil hoy:

- request frontend: `{ correo, pass }`
- endpoint backend: `POST /usuario/loginUsuario`
- response exitosa:
  - `success`
  - `userId`
  - `usuario.id`
  - `usuario.rol`
  - `usuario.rolNombre`
  - `usuario.idEventoAsignado` solo en cliente

Problema actual:

- falta cerrar el flujo posterior para contraseña temporal
- el caso cliente sin evento ya tiene fallback, pero no una experiencia final de producto

Decisión recomendada:

- backend y frontend deben usar HTTP semántico real para login
- el frontend debe seguir mostrando mensajes por caso según código devuelto

##### 2. 👤 Roles y destino inicial

Contrato útil hoy:

- backend entrega `rol`
- frontend tiene `ROLE_IDS`
- frontend tiene `getHomePathByRole`

Problema actual:

- login envía al cliente a `/evento/feed/:idEvento`
- `getHomePathByRole` para cliente apunta a `/home/cliente`
- `_app.js` además intenta forzar homes por rol

Decisión recomendada:

- definir una sola regla:
  - `ADMIN` entra a `/home/admin`
  - `CLIENTE` entra a `/evento/feed/:idEventoAsignado` como `Cliente Home`
  - `ORGANIZADOR` entra a `/home/organizador`
  - `COLABORADOR` entra a `/home/colaborador`

##### 3. 🎫 Contexto de evento

Contrato útil hoy:

- backend entrega `idEventoAsignado`
- frontend lo persiste en `useUsuarioStore`
- frontend ya consume `GET /resumenEvento/:idEvento`
- frontend ya consume `GET /eventos/detalle_completo/:idEvento`

Problema actual:

- no existe una capa explícita de “evento activo”
- el cliente puede terminar en rutas manuales
- no está resuelto el caso “cliente sin evento asignado” como lo pide el manual

Decisión recomendada:

- crear una utilidad o guarda única para resolver el evento activo del cliente
- redirigir a una pantalla controlada si `idEventoAsignado` no existe

##### 4. 🧭 Navegación y menú

Contrato útil hoy:

- frontend define menú por rol
- backend no filtra menú

Problema actual:

- `Decoración` aparece como cliente y en el manual es solo admin
- `Invitaciones` y `Acomodación` faltan del menú cliente
- organizador y colaborador siguen con `/url_vacia`
- el modal de menú del evento tiene opciones hardcodeadas que no corresponden al manual

Decisión recomendada:

- convertir el manual en la única fuente para `menuItems`
- ocultar módulos no implementados cuando su presencia rompa la experiencia
- no mostrar rutas falsas en roles propuestos

##### 5. 🧩 Módulos habilitados por evento

Contrato útil hoy:

- no existe contrato funcional visible ni en frontend ni en backend

Problema actual:

- esta es una regla central del manual y no hay modelo implementado

Lo que falta definir:

- dónde se guarda la activación de módulos por evento
- cómo la consulta el frontend
- cómo se aplica a menú, home y acceso directo por URL

Decisión recomendada:

- antes de implementar módulos nuevos, crear este contrato en backend y exponerlo al frontend

##### 6. 🛡️ Guardas y permisos

Contrato útil hoy:

- `_app.js` exige sesión para casi todo

Problema actual:

- no valida adecuadamente:
  - acceso por rol
  - acceso al evento correcto
  - acceso a módulo habilitado

Decisión recomendada:

- crear guardas de frontend por:
  - sesión
  - rol
  - evento asignado
  - módulo habilitado

---

---

### Fase 2. Núcleo administrativo

Objetivo: permitir crear el contenedor de trabajo.

Módulos:

- `Admin Eventos`
- `Admin Usuarios`
- `Admin Dashboard`

Orden interno:

1. `Admin Eventos`
2. `Admin Usuarios`
3. `Admin Dashboard`

Razón:

- el evento es la entidad principal
- luego se crean y asignan usuarios
- al final el dashboard resume ese estado

Resultado esperado:

- crear evento
- activar o desactivar evento
- asignar usuarios al evento
- definir módulos habilitados para cliente
- entrar al evento como administrador

---

### Fase 3. Shell del evento cliente

Objetivo: construir la experiencia mínima del cliente dentro de su evento.

Módulos:

- `Cliente Home`
- `Datos Evento`

Orden interno:

1. `Datos Evento`
2. `Cliente Home`

Razón:

- `Cliente Home` necesita datos resumidos de módulos
- `Datos Evento` es la primera fuente común reutilizable en cards y encabezados

Resultado esperado:

- el cliente ve la información principal del evento
- el home muestra cards solo de módulos habilitados
- la navegación entre módulos usa el contexto del evento correcto

---

### Fase 4. Gestión de invitados

Objetivo: construir la base operativa de asistencia y distribución.

Módulos:

- `Invitados`
- `Invitaciones`
- `Acomodación`

Orden interno:

1. `Invitados`
2. `Invitaciones`
3. `Acomodación`

Razón:

- `Invitaciones` depende de la base de invitados
- `Acomodación` depende de invitados y de la estructura de mesas

Resultado esperado:

- CRUD de invitados
- respuestas o estados de invitación
- asignación de invitados por mesa
- URL pública de acomodación

---

### Fase 5. Planeación y seguimiento

Objetivo: cubrir la operación previa y el seguimiento del evento.

Módulos:

- `Pendientes`
- `Timming`
- `Wedding Day`

Orden interno:

1. `Pendientes`
2. `Timming`
3. `Wedding Day`

Razón:

- `Wedding Day` consume información agregada de otros módulos
- no debe construirse primero porque sería una vista vacía o duplicada

Resultado esperado:

- tareas compartidas cliente/equipo
- cronograma del evento
- vista operativa del día del evento

---

### Fase 6. Contenido complementario del cliente

Objetivo: enriquecer la experiencia del evento sin bloquear la operación central.

Módulos:

- `Admin Frases`
- `Tips Boda`
- `Inspiración`
- `Fotos Compartidas`
- `Paletas Colores`
- `Pastel`
- `Calculador Trago`

Orden sugerido:

1. `Admin Frases`
2. `Tips Boda`
3. `Inspiración`
4. `Fotos Compartidas`
5. `Paletas Colores`
6. `Pastel`
7. `Calculador Trago`

Razón:

- `Admin Frases` alimenta `Tips Boda`
- el resto tiene bajo acoplamiento con el núcleo transaccional

---

### Fase 7. Cadena comercial de mobiliario

Objetivo: cubrir inventario, alquiler y cotización.

Módulos:

- `Admin Proveedores`
- `Admin Mobiliario`
- `Organizador Home`
- `Organizador Alquiler Mobiliario`
- `Admin Alquiler`
- `Admin Cotizador`

Orden interno:

1. `Admin Proveedores`
2. `Admin Mobiliario`
3. `Organizador Home`
4. `Organizador Alquiler Mobiliario`
5. `Admin Alquiler`
6. `Admin Cotizador`

Razón:

- el inventario depende de proveedores si hay mobiliario externo
- el organizador necesita catálogo antes de poder solicitar alquiler
- `Admin Alquiler` administra el ciclo de lo que el organizador solicita
- `Admin Cotizador` puede convivir con esta fase, pero no debe desplazar el núcleo de eventos y operación

---

### Fase 8. Operación en campo

Objetivo: soportar ejecución logística real del evento.

Módulos:

- `Decoración`
- `Colaborador Agenda`
- `Colaborador Checklist Montaje`
- `Colaborador Checklist Recogida`
- `Colaborador Home`

Orden interno:

1. `Decoración`
2. `Colaborador Agenda`
3. `Colaborador Checklist Montaje`
4. `Colaborador Checklist Recogida`
5. `Colaborador Home`

Razón:

- `Decoración` define qué debe ir al evento
- los checklists dependen directamente de esa planificación
- el home del colaborador resume agenda y checklists

---

### Fase 9. Funcionalidades avanzadas

Objetivo: cerrar experiencia operativa en tiempo real.

Incluye:

- sincronización en tiempo real de checklists y vistas operativas
- `Event Mode`

Razón:

- estas funciones dependen de módulos ya operativos
- implementarlas antes solo acelera deuda técnica

---

## Auditoría del código actual contra `docs/product`

## Resumen ejecutivo

Estado actual por nivel:

- implementado parcialmente: `Admin Eventos`, `Cliente Home`, `Datos Evento`, login base
- estructura creada pero vacía: varios módulos admin y cliente
- no existe en código: algunos módulos documentados
- inconsistente con el manual: navegación, roles y visibilidad de módulos

---

## Lo que ya existe y puede aprovecharse

### Base transversal

Ya existe:

- login funcional
- store persistente de usuario
- roles base `ADMIN_WEDDING`, `CLIENTE`, `ORGANIZADOR`, `COLABORADOR`
- menú lateral por rol
- rutas base de admin, cliente, organizador y colaborador

Observación:

- la base existe, pero todavía no aplica bien las reglas del manual respecto a visibilidad por módulo y experiencia dentro del evento.

### Admin Eventos

Ya existe:

- listado de eventos activos e inactivos
- modal para crear evento
- formulario de creación de evento
- consumo de endpoints para tipos de evento y lugares

Falta para concordar con el manual:

- editar evento
- activar o desactivar evento desde UI
- asignar usuarios al evento
- seleccionar módulos habilitados para cliente
- entrar a la vista interna del evento como administrador con menú admin + módulos activos

### Cliente Home

Ya existe:

- ruta dinámica por evento
- carga de resumen del evento
- barra superior del evento
- card resumida de `Datos Evento`

Falta para concordar con el manual:

- cards resumen por módulo habilitado
- filtrado real según módulos del evento
- navegación a módulos reales
- contenido destacado por módulo

### Datos Evento

Ya existe:

- vista de datos principales
- carga desde detalle del evento
- edición local de formulario
- subida de imagen con recorte

Falta para concordar con el manual:

- persistencia real de edición en backend
- control de permisos por rol
- campos completos según flujo del producto

---

## Brechas por módulo

### Admin Dashboard

Código actual:

- existe la página
- es un placeholder sin cards ni alertas

Acción requerida:

- convertirlo en dashboard real con indicadores de eventos, alquileres, cotizaciones y tareas pendientes

### Admin Eventos

Código actual:

- es el módulo más adelantado del panel admin

Acción requerida:

- completar gestión y no dejarlo solo en listado + creación

### Decoración

Manual:

- módulo exclusivo del administrador dentro del evento

Código actual:

- existe una ruta vacía en cliente
- aparece en el menú del cliente

Acción requerida:

- mover su visibilidad al contexto admin dentro del evento
- quitarlo del menú cliente
- conectarlo con `Admin Mobiliario`

### Admin Mobiliario

Código actual:

- página placeholder

Acción requerida:

- CRUD de inventario
- categorías
- fotos
- origen propio o proveedor

### Admin Alquiler

Código actual:

- página placeholder

Acción requerida:

- tablero de solicitudes
- detalle de alquiler
- estados
- precios por unidad o paquete
- abonos y saldo pendiente

### Admin Cotizador

Código actual:

- página placeholder

Acción requerida:

- flujo por pasos según el manual
- versiones de cotización
- exportación o compartir

### Admin Proveedores

Manual:

- está documentado como módulo admin

Código actual:

- no tiene página, ni ruta admin, ni item en el menú admin

Acción requerida:

- crear el módulo antes de cerrar `Admin Mobiliario`

### Admin Frases

Código actual:

- página placeholder

Acción requerida:

- CRUD de frases
- clasificación por tipo de evento
- clasificación por categoría
- estados activo/inactivo

### Admin Usuarios

Código actual:

- página placeholder

Acción requerida:

- CRUD de usuarios
- contraseña temporal
- link de WhatsApp
- asignación a eventos
- activación o desactivación

### Cliente Home

Código actual:

- muestra solo `Datos Evento`

Acción requerida:

- hacerlo realmente modular
- usar módulos habilitados por evento
- agregar vistas previas resumidas

### Datos Evento

Código actual:

- parcial pero reutilizable

Acción requerida:

- persistencia real
- revisar formato de datos y consistencia de rutas

### Calculador Trago

Código actual:

- placeholder `Hola mundo`

Acción requerida:

- construir módulo completo desde cero

### Fotos Compartidas

Código actual:

- placeholder `Hola mundo`

Acción requerida:

- galería
- carga
- visualización compartida

### Inspiración

Código actual:

- página placeholder con título

Acción requerida:

- tablero visual
- carga o curación de imágenes
- integración con preview en home

### Invitados

Código actual:

- placeholder `Hola mundo`

Acción requerida:

- este módulo es prioritario porque alimenta `Invitaciones` y `Acomodación`

### Invitaciones

Manual:

- módulo cliente documentado

Código actual:

- no existe ruta implementada
- no existe item en menú cliente

Acción requerida:

- crear módulo y conectarlo con invitados

### Acomodación

Manual:

- módulo cliente documentado

Código actual:

- no existe ruta implementada
- no existe item en menú cliente

Acción requerida:

- crear módulo y conectarlo con invitados y mesas

### Paletas Colores

Código actual:

- página placeholder con título

Acción requerida:

- creación y gestión de paletas
- soporte a extracción desde imagen si se quiere alinear con futuras cotizaciones

### Pastel

Código actual:

- página placeholder con título

Acción requerida:

- definir si es selección visual, proveedor o ambas
- conectar con `Admin Proveedores` si aplica

### Pendientes

Código actual:

- página placeholder

Acción requerida:

- lista compartida
- autor
- estado
- seguimiento entre cliente y equipo

### Timming

Código actual:

- página placeholder

Acción requerida:

- cronograma editable
- URL pública
- base reutilizable para `Wedding Day`

### Tips Boda

Código actual:

- página placeholder

Acción requerida:

- consumir frases administradas desde `Admin Frases`

### Wedding Day

Código actual:

- página placeholder

Acción requerida:

- construirlo después de `Pendientes`, `Timming`, `Frases` y `Datos Evento`

### Organizador Home

Código actual:

- existe `home/organizador`
- es placeholder
- el menú del organizador usa `/url_vacia`

Acción requerida:

- alinear menú, home y rutas reales

### Organizador Alquiler Mobiliario

Código actual:

- existe una ruta `pages/organizador/catalogo/catalogo.js`
- está en placeholder
- no coincide con el menú actual

Acción requerida:

- unificar ruta, menú y módulo real de catálogo/alquiler

### Colaborador Home

Código actual:

- existe `home/colaborador`
- es placeholder
- el menú del colaborador usa `/url_vacia`

Acción requerida:

- construir home operativo real

### Colaborador Agenda

Código actual:

- no existe ruta operativa alineada con menú

Acción requerida:

- agenda de eventos asignados

### Colaborador Checklist Montaje

Código actual:

- no existe módulo funcional

Acción requerida:

- checklist basado en `Decoración`
- progreso
- estados por ítem

### Colaborador Checklist Recogida

Código actual:

- no existe módulo funcional

Acción requerida:

- checklist post-evento basado en `Decoración`

---

## Inconsistencias que deben corregirse antes de seguir construyendo

### 1. Rutas del evento inconsistentes

Problemas actuales:

- hay enlaces que apuntan a `/feed/:id` en vez de `/evento/feed/:id`
- hay enlaces que apuntan a `/datos_evento/:id` en vez de `/evento/datos_evento/:id`

Impacto:

- navegación rota
- experiencia inconsistente entre módulos

### 2. Menú cliente no concuerda con el manual

Problemas actuales:

- muestra `Decoración`, aunque el manual la define como módulo admin exclusivo
- no muestra `Invitaciones`
- no muestra `Acomodación`

Impacto:

- el producto implementado no representa la estructura funcional definida

### 3. Menú del evento hardcodeado y fuera de producto

Problemas actuales:

- `ModalMenuEvento` usa un arreglo fijo
- incluye módulos como `Presupuesto`, `Mobiliario` y `Alquiler` en experiencia cliente del evento
- las acciones son `alert()`

Impacto:

- el home del cliente no es todavía una navegación real de producto

### 4. Organizador y colaborador no están conectados

Problemas actuales:

- las homes existen
- el menú apunta a `/url_vacia`

Impacto:

- los roles están declarados pero no son operables

### 5. Admin Proveedores está documentado pero no existe en el panel

Impacto:

- bloquea una implementación correcta de `Admin Mobiliario`

### 6. Los módulos no usan todavía una capa de permisos por evento

Problemas actuales:

- la visibilidad se define por rol, no por configuración del evento

Impacto:

- el sistema todavía no cumple la regla principal del manual cliente: ver solo módulos habilitados por admin

---

## Prioridad inmediata recomendada

Si el desarrollo continúa desde el estado actual, el mejor siguiente bloque es:

1. corregir navegación y visibilidad de módulos
2. terminar `Admin Eventos`
3. construir `Admin Usuarios`
4. cerrar `Datos Evento`
5. rehacer `Cliente Home` como home real por módulos
6. construir `Invitados`
7. construir `Invitaciones`
8. construir `Acomodación`

Razón:

- ese bloque deja listo el corazón del producto
- evita seguir creando pantallas vacías sin base funcional

---

## Decisión de alcance recomendada

Para mantener coherencia con el manual, conviene separar el trabajo en tres grupos:

- núcleo obligatorio: eventos, usuarios, home cliente, datos del evento, invitados, invitaciones, acomodación, pendientes, timming
- negocio de alquiler: proveedores, mobiliario, alquiler, organizador
- operación avanzada: decoración, colaborador, tiempo real, event mode

Esta separación reduce retrabajo y evita mezclar planeación del evento con logística avanzada demasiado temprano.
