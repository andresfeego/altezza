← Referencias base:
[docs/product/modules/cliente-invitados.md](/Volumes/02_SSD_1TB/Negocios/Altezza/Web/altezza/docs/product/modules/cliente-invitados.md)
[docs/product/modules/cliente-invitaciones.md](/Volumes/02_SSD_1TB/Negocios/Altezza/Web/altezza/docs/product/modules/cliente-invitaciones.md)
[docs/product/modules/cliente-acomodacion.md](/Volumes/02_SSD_1TB/Negocios/Altezza/Web/altezza/docs/product/modules/cliente-acomodacion.md)

# Base Temporal De Desarrollo

## Modulos

- Invitados
- Invitaciones
- Acomodacion

## Objetivo

Definir una base de desarrollo funcional y UX/UI para construir los tres modulos del cliente respetando esta secuencia:

1. El cliente crea invitados
2. El cliente organiza esos invitados en invitaciones
3. El cliente asigna invitados a mesas en acomodacion

Esta base no cubre todavia el diseno visual final de las tarjetas publicas de invitacion ni el flujo completo de envio.

## Logica General

### Invitados

`Invitados` es la fuente maestra de personas del evento.

Cada invitado debe poder existir aunque:

- aun no tenga invitacion
- aun no tenga mesa
- aun no haya respondido asistencia

Este modulo alimenta a `Invitaciones` y `Acomodacion`.

### Invitaciones

`Invitaciones` no significa todavia disenar una tarjeta publica.

En esta fase, una invitacion es un contenedor de invitados.

Ejemplos:

- Familia Perez
- Juan y Ana
- Mesa directiva
- Invitacion individual

Regla de negocio propuesta:

- un invitado pertenece a una sola invitacion
- una invitacion puede contener uno o varios invitados

La invitacion debe permitir:

- nombre interno de la invitacion
- mensaje interno editable
- invitado principal
- lista de integrantes
- estado de preparacion

### Acomodacion

`Acomodacion` organiza fisicamente a los invitados en mesas.

Regla de negocio propuesta:

- un invitado puede no tener mesa aun
- un invitado solo puede estar en una mesa al mismo tiempo
- una mesa tiene capacidad definida

## Secuencia UX Esperada

### Paso 1. Invitados

La experiencia debe resolver primero la carga de personas.

Vista principal:

- resumen compacto arriba
- buscador
- filtros rapidos
- listado principal de invitados
- accion primaria visible para crear invitado

Estados utiles:

- todos
- sin invitacion
- con invitacion
- sin mesa
- confirmados
- pendientes

### Paso 2. Invitaciones

La experiencia debe trabajar sobre invitados ya existentes.

Vista principal:

- resumen compacto arriba
- grid o lista de invitaciones
- accion primaria `Nueva invitacion`
- cada invitacion se gestiona como card operativa

Dentro de cada invitacion:

- agregar invitados existentes
- quitar invitados
- marcar invitado principal
- editar nombre interno
- editar mensaje interno
- ver cantidad de integrantes

Estados utiles:

- sin invitados
- lista para envio
- con faltantes

### Paso 3. Acomodacion

La experiencia debe trabajar sobre invitados ya definidos.

Vista principal:

- resumen compacto arriba
- grid de mesas
- accion primaria `Nueva mesa`
- buscador global de invitado

Dentro de cada mesa:

- ver ocupacion
- agregar invitados
- quitar invitados
- mover invitados entre mesas

Estados utiles:

- mesas incompletas
- invitados sin mesa
- capacidad completa

## UX Detallada Por Modulo

### Invitados

#### Objetivo UX

Permitir al cliente cargar y mantener rapidamente la base de personas del evento sin obligarlo a pensar aun en la invitacion o la mesa.

#### Piezas UI

- `InvitadosSummaryCard`
- `InvitadosToolbar`
- `InvitadosFilterTabs`
- `InvitadosList`
- `InvitadoRowCard`
- `InvitadoFormModal`

#### Campos base por invitado

- nombres
- apellidos
- telefono
- whatsapp
- parentesco
- grupoEdad
- notas
- estadoAsistencia

#### Relaciones visibles en la UI

- invitacion asignada o `Sin invitacion`
- mesa asignada o `Sin mesa`

#### Acciones

- crear
- editar
- eliminar
- asignar a invitacion
- quitar de invitacion
- ver mesa

### Invitaciones

#### Objetivo UX

Permitir agrupar invitados en unidades de invitacion sin entrar aun a la tarjeta publica o al diseno final.

#### Piezas UI

- `InvitacionesSummaryCard`
- `InvitacionesToolbar`
- `InvitacionesGrid`
- `InvitacionGroupCard`
- `InvitacionComposerModal`
- `InvitacionMembersPanel`

#### Estructura visual de una invitacion

- nombre de la invitacion
- cantidad de integrantes
- mensaje interno corto
- invitado principal
- estado
- lista de integrantes

#### Acciones

- crear invitacion
- editar nombre
- editar mensaje
- agregar invitados existentes
- quitar invitados
- definir invitado principal
- eliminar invitacion

#### Regla UX importante

Si no existen invitados, el modulo no debe fingir operatividad.

Debe mostrar empty state con CTA:

- `Ir a crear invitados`

### Acomodacion

#### Objetivo UX

Permitir sentar invitados de forma clara, rapida y reversible.

#### Piezas UI

- `AcomodacionSummaryCard`
- `MesasGrid`
- `MesaCard`
- `MesaDetailModal`
- `SeatAssignmentPanel`
- `InvitadoSearchAssign`

#### Estructura visual de una mesa

- nombre o numero
- capacidad
- ocupacion
- invitados asignados
- estado visual

#### Acciones

- crear mesa
- editar capacidad
- asignar invitado
- quitar invitado
- mover invitado
- eliminar mesa

#### Regla UX importante

Si hay invitados sin mesa, eso debe verse como pendiente principal del modulo.

## Arquitectura De Datos Propuesta

### Entidades

#### Invitado

- `id`
- `idEvento`
- `nombres`
- `apellidos`
- `telefono`
- `whatsapp`
- `parentesco`
- `grupoEdad`
- `notas`
- `estadoAsistencia`
- `idInvitacion`
- `idMesa`
- `principalInvitacion`

#### Invitacion

- `id`
- `idEvento`
- `nombre`
- `mensaje`
- `estado`
- `idInvitadoPrincipal`

#### Mesa

- `id`
- `idEvento`
- `nombre`
- `capacidad`
- `orden`

## Relaciones

- `Evento -> muchos Invitados`
- `Evento -> muchas Invitaciones`
- `Evento -> muchas Mesas`
- `Invitacion -> muchos Invitados`
- `Mesa -> muchos Invitados`

## Reglas De Negocio

### Invitados

- un invitado pertenece a un solo evento
- un invitado puede existir sin invitacion
- un invitado puede existir sin mesa

### Invitaciones

- una invitacion pertenece a un solo evento
- una invitacion puede estar vacia en borrador
- un invitado no puede estar en dos invitaciones al mismo tiempo
- una invitacion puede tener un invitado principal

### Mesas

- una mesa pertenece a un solo evento
- la capacidad no puede ser menor a los invitados ya sentados
- un invitado no puede estar en dos mesas al mismo tiempo

## Endpoints Esperados

### Invitados

- `GET /eventos/:idEvento/invitados`
- `POST /eventos/:idEvento/invitados`
- `PATCH /eventos/:idEvento/invitados/:idInvitado`
- `DELETE /eventos/:idEvento/invitados/:idInvitado`

### Invitaciones

- `GET /eventos/:idEvento/invitaciones`
- `POST /eventos/:idEvento/invitaciones`
- `PATCH /eventos/:idEvento/invitaciones/:idInvitacion`
- `DELETE /eventos/:idEvento/invitaciones/:idInvitacion`
- `POST /eventos/:idEvento/invitaciones/:idInvitacion/invitados`
- `DELETE /eventos/:idEvento/invitaciones/:idInvitacion/invitados/:idInvitado`
- `PATCH /eventos/:idEvento/invitaciones/:idInvitacion/principal`

### Acomodacion

- `GET /eventos/:idEvento/mesas`
- `POST /eventos/:idEvento/mesas`
- `PATCH /eventos/:idEvento/mesas/:idMesa`
- `DELETE /eventos/:idEvento/mesas/:idMesa`
- `POST /eventos/:idEvento/mesas/:idMesa/invitados`
- `DELETE /eventos/:idEvento/mesas/:idMesa/invitados/:idInvitado`
- `PATCH /eventos/:idEvento/mesas/:idMesa/mover-invitado`

## Estructura Frontend Propuesta

### Componentes

`components/eventos/modulos/invitados/`

- `InvitadosModule.js`
- `InvitadosSummary.js`
- `InvitadosToolbar.js`
- `InvitadosList.js`
- `InvitadoCard.js`
- `InvitadoFormModal.js`

`components/eventos/modulos/invitaciones/`

- `InvitacionesModule.js`
- `InvitacionesSummary.js`
- `InvitacionesGrid.js`
- `InvitacionCard.js`
- `InvitacionEditorModal.js`
- `InvitacionMembersManager.js`

`components/eventos/modulos/acomodacion/`

- `AcomodacionModule.js`
- `AcomodacionSummary.js`
- `MesasGrid.js`
- `MesaCard.js`
- `MesaEditorModal.js`
- `MesaAssignmentManager.js`

### Rutas

- `/evento/invitados/invitados`
- `/evento/invitaciones/invitaciones`
- `/evento/acomodacion/acomodacion`

## Dependencias Entre Modulos

### Invitaciones depende de Invitados

Sin invitados no hay invitaciones utiles.

### Acomodacion depende de Invitados

Sin invitados no hay acomodo posible.

### Acomodacion puede convivir con Invitaciones

No debe bloquearse por no tener invitaciones, pero si debe beneficiarse de que los invitados ya vengan agrupados.

## Fases De Implementacion Recomendadas

### Fase 1. Invitados

- modelo de datos
- endpoints CRUD
- UI lista + modal
- filtros base

### Fase 2. Invitaciones

- CRUD de invitaciones
- asignacion de invitados a invitaciones
- invitado principal
- resumen de estados

### Fase 3. Acomodacion

- CRUD de mesas
- asignacion de invitados a mesas
- mover invitado
- resumen de pendientes

### Fase 4. Evoluciones posteriores

- diseno de tarjeta publica de invitacion
- envio por WhatsApp
- RSVP publico
- link publico de acomodacion
- consulta publica de mesa

## Reutilizacion De Codigo Legacy

El codigo en `old/` sugiere que ya existio esta logica:

- evento -> invitaciones -> invitados
- invitado principal
- mensaje interno por invitacion
- acciones de WhatsApp
- resumenes de confirmacion

Archivos legacy mas utiles como referencia funcional:

- [old/Components/AdminComponents/Invitados/AdminInvitaciones.js](/Volumes/02_SSD_1TB/Negocios/Altezza/Web/altezza/old/Components/AdminComponents/Invitados/AdminInvitaciones.js)
- [old/Components/AdminComponents/Invitados/TarjetaInvitacion.js](/Volumes/02_SSD_1TB/Negocios/Altezza/Web/altezza/old/Components/AdminComponents/Invitados/TarjetaInvitacion.js)
- [old/Components/Resumen/ResumenListaInvitados.js](/Volumes/02_SSD_1TB/Negocios/Altezza/Web/altezza/old/Components/Resumen/ResumenListaInvitados.js)

La UI legacy no debe copiarse tal cual.
La referencia debe usarse para:

- reglas de dominio
- operaciones disponibles
- relaciones de entidades

## Criterios De Cierre UX

Un modulo no se considera cerrado solo por tener CRUD.

Debe cumplir:

- jerarquia clara
- accion primaria visible
- empty state real
- estado loading
- estado error
- responsive aceptable
- continuidad con los shells del cliente

## Plan Tecnico Ejecutable

### Objetivo Inmediato

Construir primero `Invitados` como modulo base real del cliente.

Ese primer entregable debe dejar listo:

- modelo de datos claro
- CRUD funcional
- UI operativa
- puntos de integracion para `Invitaciones` y `Acomodacion`

### Orden De Implementacion

#### Etapa 1. Contrato y backend

Definir y construir primero el contrato de `Invitados`.

##### Backend esperado

- tabla o entidad de invitados por evento
- endpoints CRUD
- soporte para filtros simples
- soporte para relaciones futuras con `idInvitacion` e `idMesa`

##### Campos minimos v1

- `id`
- `idEvento`
- `nombres`
- `apellidos`
- `telefono`
- `whatsapp`
- `parentesco`
- `grupoEdad`
- `notas`
- `estadoAsistencia`

##### Campos reservados para integrar despues

- `idInvitacion`
- `idMesa`
- `principalInvitacion`

#### Etapa 2. Capa de datos frontend

Crear helpers dedicados al modulo para no mezclar la logica en paginas.

##### Archivos propuestos

- `components/initialized/data/helpersGetInvitados.js`
- `components/initialized/data/helpersSetInvitados.js`

Si el proyecto prefiere mantener un solo archivo de helpers, entonces al menos agrupar por comentarios y naming consistente.

#### Etapa 3. UI del modulo Invitados

##### Ruta

- `/pages/evento/invitados/invitados.js`

##### Componentes a crear

- `components/eventos/modulos/invitados/InvitadosModule.js`
- `components/eventos/modulos/invitados/InvitadosSummary.js`
- `components/eventos/modulos/invitados/InvitadosToolbar.js`
- `components/eventos/modulos/invitados/InvitadosList.js`
- `components/eventos/modulos/invitados/InvitadoCard.js`
- `components/eventos/modulos/invitados/InvitadoFormModal.js`
- `components/eventos/modulos/invitados/invitados.module.scss`

##### Responsabilidad de cada pieza

- `InvitadosModule`
  - orquestacion
  - carga de datos
  - estado loading/error/empty
  - integracion con modal

- `InvitadosSummary`
  - resumen superior compacto
  - total invitados
  - sin invitacion
  - sin mesa

- `InvitadosToolbar`
  - buscador
  - filtros rapidos
  - boton primario `Nuevo invitado`

- `InvitadosList`
  - grid o lista
  - empty states por resultado

- `InvitadoCard`
  - identidad
  - telefono/WhatsApp
  - estado
  - invitacion asignada
  - mesa asignada
  - menu de acciones

- `InvitadoFormModal`
  - crear/editar
  - validacion inline
  - submit

#### Etapa 4. Integracion con menu y workspace admin espejo

Una vez exista el modulo cliente real:

- reemplazar placeholder de `/evento/invitados/invitados`
- hacer que `/admin/eventos/[idEvento]/modulo/invitados` reutilice ese mismo modulo dentro del shell admin

### Decision UX Para Invitados v1

La primera version no debe intentar resolver todo.

Debe enfocarse en:

- crear
- editar
- eliminar
- buscar
- filtrar
- ver estados base

No incluir todavia:

- importacion masiva
- envio por WhatsApp
- RSVP complejo
- drag and drop

### Checklist Tecnico Invitados v1

#### Backend

- migracion creada
- endpoint listar
- endpoint crear
- endpoint editar
- endpoint eliminar
- validaciones minimas

#### Frontend

- ruta reemplaza placeholder
- modulo carga desde backend real
- modal crear funciona
- modal editar funciona
- eliminar confirma y refresca
- buscador filtra
- filtros rapidos funcionan

#### UX/UI

- accion primaria visible
- empty state correcto
- loading state correcto
- cards o filas legibles en desktop
- una columna en mobile
- spacing en tokens

### Dependencias Para La Siguiente Etapa

`Invitaciones` solo arranca cuando `Invitados` ya permita:

- listar invitados reales
- saber quien no tiene invitacion
- asignar luego `idInvitacion`

`Acomodacion` solo arranca cuando `Invitados` ya permita:

- listar invitados reales
- saber quien no tiene mesa
- asignar luego `idMesa`

### Plan Inmediato Recomendado

1. Revisar esquema actual y confirmar si ya existe tabla de invitados utilizable
2. Definir contrato request/response de `Invitados`
3. Implementar backend
4. Crear componentes frontend del modulo
5. Reemplazar placeholder actual
6. Validar en cliente y en admin espejo

### Pruebas Manuales Minimas Invitados v1

1. Crear invitado nuevo
2. Editar invitado existente
3. Eliminar invitado
4. Buscar por nombre o usuario
5. Ver empty state cuando no hay resultados
6. Abrir el mismo modulo desde admin espejo y confirmar que carga
