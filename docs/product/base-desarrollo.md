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

- módulo funcional de inventario propio en `/admin/mobiliario`
- alta mínima de producto con nombre, categoría, color y dos imágenes obligatorias
- presentaciones internas simples o por tamaño, cada una con SKU e inventario independiente
- dos imágenes tipadas y reemplazables en R2 (`producto` y `decoracion`), y movimientos auditables
- URL global y catálogo público editorial responsive en `/catalogo-mobiliario/[publicCode]`
- banner con edición por fecha del enlace, filtros por categoría/nombre/color/código, fondos alternados configurables y listado máximo de 1024 px
- códigos automáticos por categoría (1001…1099, 10100), independientes de los SKU
- estado funcional: rediseño implementado y verificado localmente
- estado UX/UI: revisado en desktop/móvil; pendiente de aceptación visual del usuario
- publicación controlada sin exponer precios, stock ni valores internos
- sin precios ni condiciones comerciales en Mobiliario; se definirán en la futura cotización

Fuera de esta fase:

- reservas y disponibilidad por fechas
- alquileres, cotizaciones y pagos
- mobiliario de proveedores

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

Lemoncello — actualización 2026-09-23:

- Estado funcional: sobre y Hero animados, frase bíblica con recorrido horizontal
  y mesero, fotos en bucle con `image_slider_1`, y `countdown` con fecha seguido de
  `save_the_date_calendar`. Estos últimos comparten una sola escena en Lemoncello
  y conservan contratos independientes al cambiar de plantilla. `event_details`
  añade dos pasos visuales, ceremonia/recepción, con los mismos datos del evento,
  banderas de visibilidad, mensajes y mapa existente.
- Estado UX/UI: acuarela suave, Polaroids con recorte centrado y gesto corto,
  presentación blanca para fecha/mensaje/contador/calendario, cenefas de azulejos
  azules arriba/abajo y rama de limones animada abajo a la derecha.
  Fotos ↔ fecha ↔ iglesia usan sombrillas amarillas/marfil que entran girando,
  cubren toda la pantalla, cambian el fondo a mitad y salen girando (unos 3.66 s).
  Posiciones/tamaños irregulares y recorrido continuo, sin pausa central; los
  tramos de entrada/salida van un 30% más despacio.
  Sustituye el caballete y los zooms. Flechas con aparición/desaparición de 300 ms;
  el texto en el cielo aparece al terminar de salir las sombrillas.
  Ceremonia aparece centrada y más grande con el halo del monograma; la siguiente
  flecha dispara una chispa discreta en 4 s, seguida del texto de recepción sobre
  la misma imagen de cielo claro y en azul marino. Regreso a ceremonia en 2.2 s;
  sin efectos con movimiento reducido.
  La iglesia conserva detalles sobre el cielo (60%) y paisaje abajo (40%).
  La capilla toma su arquitectura del dibujo del Hero de Natalia y Andrés:
  cúpula, escalinata y cipreses, con dos canastillas de limones. Fondo de día
  centrado en la fachada; referencia original y ambas tarjetas conservan sus datos.
  Cipreses con viento localizado suave y base fija, continuo entre eventos;
  se omite con movimiento reducido.
  Lluvia de sobres (`gift_envelopes`) funcional después de recepción: ascenso y
  fundido nocturno simultáneos en 4.8 s, luna/estrellas, cuatro haces difuminados,
  silueta de novios, icono y texto desde el contrato común. Regreso y movimiento
  reducido verificados; configuración local idempotente con respaldo. Revisión
  UX/UI realizada en WebKit móvil y desktop; aprobación visual del usuario pendiente.
  Recomendaciones funcionales como módulo genérico compartido: título, dos textos,
  imagen y enlace. Lemoncello incorpora hospedaje tras sobres con descenso nocturno,
  cielo continuo y estrellas adicionales; contacto WhatsApp desde la web oficial
  del hotel. 52 pruebas frontend y configurador local idempotente verificados;
  aprobación visual del usuario pendiente.
  Los datos de fecha se pintan a resolución final. Revisión responsive y teclado en Playwright;
  aprobación visual de esta nueva sección pendiente. Recepción 16:00 provisional,
  marcada en inglés; ceremonia 14:30 y puntualidad confirmadas en el Word.

Tarjeta pública modular (actualización 2026-09-19):

- Estado funcional: `instant_photos` implementado con dos fotos, sello, texto opcional y carga diferida; migración local de `bodmys` después de asistencia. El texto del cierre pertenece ahora a las fotos y el cierre independiente queda desactivado. Oliva admite relieve botánico en el fondo beige de esta sección.
- Estado UX/UI: composición Polaroid con mensaje integrado y relieve botánico sobre el beige original de Oliva. Fotos y sello comparten la sombra del monograma; sello centrado en el cruce del borde inferior de la foto posterior y el izquierdo de la frontal. Revisada en Chrome y WebKit a 320, 390, 480 y 1440 px, sin recortes ni desbordamiento; anclaje comprobado con error inferior a 0.2 px. Efecto limitado a la sección, movimiento reducido y contraste aumentado comprobados. Aprobación visual del cliente pendiente.
- Contrato y validación: [módulo de invitaciones](modules/cliente-invitaciones.md#fotografías-instantáneas-y-cierre).

Oliva — carga pública revisada (2026-09-21):

- Estado funcional: compilación optimizada actual en 3004 y gateway del túnel
  configurado para usarla por defecto. Desarrollo continúa en 3002. Backend
  estable; compilación y 54 pruebas aprobadas. El nuevo túnel usa HTTP/2.
- Estado UX/UI: no se reprodujo un bucle en tres recargas locales; la carga
  pesada por túnel se redujo usando unos 180 kB de JavaScript, frente a los
  15,5 MB del `_app.js` de desarrollo. Apertura real en Chrome y WebKit móvil
  por el túnel nuevo en 6,1–6,2 s, sin errores ni recargas adicionales; sobre,
  esquinas florales y fotos finales comprobados. Cada cambio posterior requiere
  reconstruir la vista optimizada antes de compartirlo.
- Evidencia y operación: [diagnóstico de carga](../invitaciones-diagnostico-carga.md#revisión-del-21-de-septiembre-de-2026).

Oliva — preparación completa de medios y compresión (2026-09-22):

- Estado funcional: la ruta pública de Oliva prepara un manifiesto de los medios
  de módulos habilitados, incluidos fondos, máscaras, ambas variantes responsive
  y fuentes. Descarga completos el video y la música; reutiliza sus blobs y espera
  imágenes decodificadas y datos reproducibles en los elementos del DOM antes de
  habilitar el sobre. Un error o el límite de 90 s muestra reintento, sin abrir la
  tarjeta incompleta. Las demás plantillas conservan su carga anterior.
- Estado UX/UI: pantalla opaca con barra proporcional de progreso, sin contador
  de archivos ni porcentajes numéricos visibles; tarjeta sin interacción
  mientras carga, mensaje recuperable ante fallo y soporte de movimiento reducido.
  La música conserva su inicio mediante el gesto de abrir. Sobre, video, imágenes
  interiores y música comprobados con retrasos individuales de 6 s en Chrome;
  carga completa también comprobada en WebKit móvil. Reintento sin recargar validado.
- Recursos de Mayra/Samuel: 52.72 MB → 13.26 MB entre 21 archivos inventariados.
  Derivados versionados con originales intactos y copia SHA-256; incluye imágenes,
  video y audio, sin equivaler al total transferido por visita. Compresión aplicada
  a la configuración local y seed, sin cambios de textos, orden ni respuestas.
- Contrato y checklist: [preparación de medios](modules/cliente-invitaciones.md#preparación-completa-de-medios-en-oliva).

Oliva — esquinas de la frase bíblica (2026-09-21):

- Estado funcional: `biblical_quote` reutiliza su vista y datos, con decoración
  exclusiva de Oliva. Una máscara floral blanca y transparente en dos esquinas, y relieve compartido
  con las fotos finales; no cambia el orden, la confirmación ni otras plantillas.
- Estado UX/UI: pequeña «┌» floral superior izquierda y la misma imagen girada
  180° en la esquina inferior derecha; sustituyen los marcos completos probados.
  Tamaño de 96–128 px y separación de 16 px. Relieve CSS sobre papel beige,
  frase centrada y altura flexible para evitar cruces entre texto y ornamento.
  Padding horizontal aumentado a 64 px por lado (48 px bajo 360 px), conservando
  la tipografía y el padding vertical.
  Revisado en Chrome y WebKit a 320, 390, 480 y 1440 px; sin desbordamiento ni
  cambios de dimensiones en los demás módulos de Oliva. Movimiento reducido y
  contraste aumentado comprobados. 47 pruebas aprobadas y recurso accesible por
  túnel. Integración lista para revisión visual del usuario.
- Contrato y validación: [módulo de invitaciones](modules/cliente-invitaciones.md#esquinas-florales-de-la-frase-en-oliva).

Oliva — aparición de textos (2026-09-21):

- Estado funcional: entrada única al llegar a cada texto desde la frase hasta el
  cierre; nombres escalonados, contador y calendario completos. Incluye imágenes
  de vestuario, paletas, sobre, Polaroids y sello, esperando su carga sin bloquear
  otros elementos. La entrada conserva las rotaciones y sombras existentes. Sin cambios de
  datos ni de confirmación. Fallback visible, foco de teclado inmediato y
  movimiento reducido inicial o activado durante la visita.
- Estado UX/UI: propuesta aprobada de 700 ms, recorrido de 12 px y secuencia de
  100 ms. En los fondos claros, cada bloque de texto alterna izquierda/derecha;
  fondos verdes y nombres conservan el ascenso. Conserva geometría, colores y
  tipografía. Textos e imágenes revisados en Chrome y WebKit: entrada única,
  contador activo, foco inmediato y movimiento reducido. Sombras y rotaciones
  de las Polaroid conservadas durante la entrada. Sin desbordamiento a 320, 390,
  480 y 1440 px ni cambios de geometría. 47 pruebas aprobadas. Revisión final
  del usuario pendiente; pasos manuales en el módulo de invitaciones.

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

Lemoncello — vestuario (2026-09-24):

- Estado funcional: `dresscode` configurado después de recomendaciones con textos
  del usuario, seis invitados ilustrados, seis telas sugeridas y dos colores
  reservados (amarillo mantequilla y azul cielo). Mismo contrato en todas las
  plantillas; configuración local repetible con respaldo.
- Estado UX/UI: diez fuegos desde el hotel, resplandor cálido que cubre el cambio
  y papelería blanca con azulejos/rama compartidos con fecha. Revisado en WebKit
  móvil y desktop, ida/regreso y movimiento reducido; aprobación visual del usuario
  pendiente. En 320×568 se admite scroll interno para mantener legibilidad.

Lemoncello — asistencia (2026-09-24):

- Estado funcional: `attendance_confirm` después de vestuario, con el formulario
  común de respuestas, errores y fecha límite. Configuración local con respaldo,
  sin modificar invitados ni respuestas. Túnel habilitado solo para la confirmación
  de la invitación de prueba.
- Estado UX/UI: descenso simple de 900 ms, cielo azul y adornos claros arriba/abajo,
  sin plantas ni azulejos. Scroll interno validado con 24 filas en móvil pequeño,
  iPhone y escritorio; navegación, foco y movimiento reducido comprobados.
  Aprobación visual del usuario pendiente.

Lemoncello — cierre y navegación (2026-09-24):

- Estado funcional: `closing_message` al final con «Te esperamos» e imagen del
  monograma. Campos opcionales `imageSrc`/`imageAlt` disponibles en las cuatro
  plantillas y separados del marco ornamental. Configuración local con respaldo.
- Estado UX/UI: costa nocturna distante, monograma mantequilla arriba a la derecha
  y halo centrado; navegación circular de 48 px, siempre izquierda/derecha.
  Vespa acelera/frena en 6.8 s. Revisado en WebKit móvil/escritorio, incluyendo
  ida/regreso y movimiento reducido; aprobación visual del usuario pendiente.

Lemoncello — agua del cierre (2026-09-24):

- Estado funcional: oleaje localizado en la ilustración existente; se libera al
  salir, pausa con pestaña oculta y conserva imagen estática sin WebGL o con
  movimiento reducido. Sin cambios de contrato ni configuración.
- Estado UX/UI: ondas y reflejos suaves; cielo, costa y monograma inmóviles.
  Verificado en WebKit móvil y 53 pruebas frontend; aprobación visual pendiente.

Lemoncello — tipografía del letrero bíblico (2026-09-24):

- Estado funcional: paquetes Cormorant y Khalifah Script extraídos y trasladados
  del Storage del evento a `assets/fonts` de la plantilla, incluidos sus originales
  y documentación. El mensaje bíblico usa Cormorant local; Khalifah se reserva
  para los títulos «Ceremonia» y «Recepción» del módulo de detalles.
- Estado UX/UI: Cormorant cursiva en azul marino y escala ajustada al papel;
  mensaje y adorno inferior visibles en móvil y escritorio. Aprobación visual pendiente.
  Prueba manual: abrir, avanzar al letrero y verificar el texto completo y el limón.

Lemoncello — títulos de ceremonia y recepción (2026-09-24):

- Estado funcional: Khalifah Script local aplicada solo a ambos títulos de detalles;
  fechas, horas, lugares, mensajes y enlaces conservan su fuente y contenido.
- Estado UX/UI: fecha elevada 16 px para separarla de los títulos sin desplazar
  los demás datos; títulos completos dentro del cielo. Verificado en WebKit a
  320 y 440 px. Aprobación visual pendiente. Prueba manual: recorrer ceremonia y recepción
  y comprobar ambos encabezados y la tipografía sin cambios de los demás datos.

Lemoncello — tipografía editorial y sobre (2026-09-24):

- Estado funcional: Khalifah local en títulos de sobres, hospedaje, vestuario,
  confirmación y mensaje final; Cormorant en cuerpos. Mensaje de adultos en frase
  normal y blanco añadido a reservados en DB, seed y preview con script idempotente
  y respaldo. Vespa en 6 s, conservando curva y apertura de 3.6 s. 53 pruebas pasan.
- Estado UX/UI: árbol reilustrado cerca del marco izquierdo para verlo en el
  encuadre móvil; abertura arqueada con alfa completo, sin ramas dentro del hueco.
  Recursos `envelope-tree-close-edit-v2` y `landscape-open-clear-v3`; cámara y otros
  objetos conservados. Revisado en WebKit móvil, apertura y módulos finales;
  aprobación visual del usuario pendiente. Prueba manual: esperar la llegada,
  abrir y comprobar árbol visible/hueco despejado; recorrer los títulos y comprobar
  el blanco reservado mediante el scroll interno de vestuario en pantallas cortas.

Lemoncello — vestuario sin scroll (2026-09-24):

- Estado funcional: presentación de `dresscode` sin desplazamiento interno;
  datos, imágenes de colores y navegación conservados. La cuenta regresiva y
  el scroll de asistencia mantienen su comportamiento.
- Estado UX/UI: ambas cenefas a media altura e ilustración de personas un 10%
  menor, sin deformación. Densidad adaptada en pantallas cortas; las paletas quedan
  delante de la rama. Verificado en WebKit a 320×568, 375×667, 390×844, 440×763,
  480×687 y escritorio. Aprobación visual pendiente. Prueba manual: entrar a
  vestuario y ver título, seis tonos sugeridos y tres reservados completos sin
  deslizar; avanzar/regresar y comprobar el scroll independiente de asistencia.

Lemoncello — música desde el inicio (2026-09-24):

- Estado funcional: `music_player` habilitado con «Eres tú · Carla Morrison»,
  desde el Storage del evento; configuración local, seed y preview alineados.
  Inicia al salir del loader, durante el recorrido del sobre. Si autoplay está
  bloqueado, reintenta con interacción. Abrir respeta el silencio elegido y
  navegar no reinicia la canción. Script backend idempotente con respaldo.
- Validación: 62 pruebas frontend y una backend pasan. WebKit móvil por túnel
  confirmó inicio audible en fase `travel`; bloqueo de autoplay simulado recuperado
  con un toque, silencio conservado al abrir y continuidad al avanzar.
- Estado UX/UI: control circular beige y azul marino en la esquina superior
  derecha, revisado a 440×763. Aprobación visual pendiente. Prueba manual: entrar
  desde un móvil, comprobar el sonido inicial o tocar si el navegador lo bloquea,
  silenciar, abrir, reactivar y avanzar sin reinicio de la pista.

Lemoncello — inicio con flecha y ritmo del recorrido (2026-09-24):

- Estado funcional: la Vespa espera estática tras la carga. La flecha circular
  inicia moto y música en el mismo gesto y desaparece; el control de sonido se
  revela entonces. Abrir hace un vaivén breve cada 3 s al llegar. La ceremonia
  aparece junto con su paisaje bajo las sombrillas, manteniendo bloqueada la
  interacción hasta terminar. Frase ↔ fotos dura 3 s con aceleración/frenado.
  Los demás recorridos y datos permanecen iguales. `RECEPTION TIME TO REPLACE`
  sigue indicando que las 16:00 de recepción son provisionales.
- Validación: 62 pruebas frontend pasan, incluidos espera inicial, clics repetidos,
  continuidad del audio, cambio bajo cobertura y movimiento reducido. WebKit móvil
  confirmó audio detenido antes de la flecha, reproducción durante la moto,
  duración/easing de fotos y texto de ceremonia opaco al revelar el paisaje.
- Estado UX/UI: se reutiliza la flecha circular aprobada y el letrero existente;
  capturas a 440×763 revisadas. Aprobación visual pendiente. Prueba manual: esperar
  tras cargar, tocar la flecha, comprobar canción/recorrido y vaivén al llegar;
  abrir, pasar de frase a fotos y de cuenta regresiva a ceremonia sin texto tardío.

Lemoncello — Abrir sin recuadro (2026-09-24):

- Estado funcional: apertura y vaivén conservados; se elimina el contorno amarillo
  del foco. La navegación por teclado mantiene una variación leve de brillo del arte.
- Estado UX/UI: sin marco añadido al letrero. Prueba manual: iniciar el recorrido
  y comprobar al llegar que Abrir se mueve sin recuadro. Aprobación visual pendiente.

Lemoncello — continuidad Hero/frase (2026-09-24):

- Respaldo previo: front `60ebbe5` y backend `19d0a35`, antes de cambiar la imagen.
  Se guardaron fuentes, recursos, código y configuración; los temporales locales,
  herramientas descargadas, respaldos `.env` y Storage permanecen fuera de Git.
- Estado funcional: paisaje común `hero-quote-continuous-v2.webp` para Hero y
  paseo, con posición de solape adaptada al escalado uniforme en móviles altos.
  Datos, monograma, balcón, rama, pájaro, mesero, letrero y navegación conservados.
  Un Hero con fondo personalizado mantiene su imagen y composición anteriores.
- Estado UX/UI: cielo y costa continuos hacia la terraza de sombrillas; corregida
  la conexión de la balaustrada y limitado el solape para evitar imágenes dobles.
  Ilustración realizada con ImageGen, con originales y prompts guardados.
  Revisado en WebKit a 440×763, 390×844 y escritorio 1440×900; 62 pruebas frontend
  y 18 backend pasan. Aprobación visual pendiente. Prueba manual: abrir, avanzar
  con el mesero desde Hero hasta frase y regresar; revisar paisaje durante el
  movimiento, letrero y paso a las fotos.

Lemoncello — agua del cierre más visible (2026-09-24):

- Estado funcional: amplitud del oleaje aumentada aproximadamente un 35% y
  variación de reflejos del 2.8% al 4%, conservando velocidad, máscara y pausas.
- Estado UX/UI: revisado en WebKit móvil; el agua cambia entre fotogramas y el
  cielo permanece idéntico. Movimiento reducido conserva la ilustración estática.
  Prueba manual: llegar al mensaje final y observar oleaje y reflejos durante unos
  segundos. Aprobación visual pendiente.

Lemoncello — datos confirmados y cuatro fotos nuevas (2026-09-24):

- Estado funcional: recepción a las 16:30 en Villa Germana Paipa, sin texto
  provisional; ceremonia enlazada a la ubicación entregada por los novios.
  Seed, preview y DB local alineados. Las fotos 023–026 del Storage se intercalan
  con las siete anteriores; el slider conserva su orden previo y ahora recorre
  once fotos. Los 26 originales JPEG permanecen íntegros; entrega WebP separada.
- Estado UX/UI: label del sobre en Cormorant. El corazón rodea el día del evento,
  con el número centrado ópticamente dentro, espacio entre filas y calendario
  completo. Distribución revisada en WebKit a 375×667, 390×844 y 440×763; sin
  scroll adicional en esas dimensiones. Centrado final del corazón revisado
  visualmente en Chrome a 440×763.
  Aprobación visual pendiente.
- Validación: 62 pruebas frontend y 7 backend pasan. Recorrido completo del
  slider, recepción y enlace de ceremonia comprobados en navegador. Actualizador
  local de datos idempotente y con respaldo; conserva el lugar compartido por
  otras bodas. Prueba manual: abrir, pasar las once fotos, comprobar el corazón
  alrededor del 19 y avanzar a ceremonia/recepción para revisar mapa, lugar y hora.

Lemoncello — scroll de confirmación en móvil (2026-09-24):

- Estado funcional: toda la superficie de asistencia, incluidos los márgenes,
  pertenece al mismo contenedor de scroll nativo. Se bloquean el encadenamiento
  y el rebote al llegar a sus extremos. El marco de las escenas usa `overflow:
  clip` para recortar sin convertirse en otro contenedor desplazable por el foco
  o por el navegador. Se conserva el zoom de accesibilidad, el guardado compartido
  y la posición de la lista al volver del cierre.
- Validación: reproducido con cuatro invitados de prueba; antes, los gestos
  laterales no desplazaban la lista y el marco admitía desplazamiento horizontal.
  Después, gestos táctiles nativos en Chromium a 360×732, 390×844 y 440×763
  desplazan únicamente la lista, incluso desde márgenes y decoraciones. WebKit
  verificado con rueda en viewport móvil y con toques/teclado en emulación móvil;
  sin desplazamiento del marco al seleccionar ni al avanzar/regresar. Guardados
  simulados, sin modificar invitados reales. Pasan las 66 pruebas frontend.
- Estado UX/UI: conservados colores, tipografía, espaciado inicial y flechas;
  revisión visual local completada. Pendiente comprobar en el dispositivo de
  producción del usuario después de desplegar. Prueba manual: con cuatro
  invitados, deslizar desde filas y márgenes, insistir en ambos extremos,
  confirmar al último invitado y avanzar/regresar; solo debe moverse la lista,
  sin mostrar otras escenas ni perder la posición o la respuesta.

Lemoncello — confirmación fuera de la cámara al reposar (2026-09-24):

- Estado funcional: al terminar los viajes entre vestuario, asistencia y cierre,
  la escena activa vuelve al origen del viewport y el contenedor deja de tener
  `transform`. Solo se transforma durante los 900 ms de viaje. Se conserva el
  mismo nodo del formulario y su posición de scroll; las escenas inactivas usan
  también `visibility: hidden`. La capa visible acepta eventos directamente,
  sin un ancestro con `pointer-events: none` sobre la lista activa.
- Validación: tarjeta real de prueba `lausprueba` con cuatro invitados, sin
  cambiar sus respuestas. Playwright/Chrome visible con emulación móvil:
  18 gestos táctiles en 390×844, 440×763 y 375×667, centro y márgenes, cambios de
  dirección, avance/regreso y capturas durante el arrastre. La posición de la
  lista se conserva tras detener la inercia y navegar. WebKit en viewport móvil
  comprobado con rueda. Pasan las 66 pruebas frontend, incluida la conservación
  del nodo y el scroll al cambiar las coordenadas de la cámara.
- Estado UX/UI: conserva composición y transiciones. No se reprodujo el
  parpadeo reportado en estas capturas; pendiente contrastar con el dispositivo
  y enlace exactos del usuario. Prueba manual: recargar, llegar a confirmación,
  deslizar varias veces hacia arriba y abajo, ir al cierre y volver;
  verificar lista estable, posición conservada y flechas operativas.
