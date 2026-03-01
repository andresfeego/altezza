# Especificación funcional (v1) — Mievento

Esta carpeta describe **lo que ya existe hoy en el código** (frontend + backend), para que:

- Andres pueda escribir nuevas características de forma ordenada.
- Wipi pueda implementarlas y desplegarlas a **LAB** sin ambigüedades.

## Cómo leer esto

- **Módulos**: qué pantallas existen y qué hacen.
- **Flujos**: login, subida de imagen, etc.
- **Modelo de datos**: entidades/campos que ya se usan desde el backend.
- **API**: endpoints actuales (request/response).

## Índice

- [Glosario](./glossary.md)
- [Resumen de módulos (menús/roles)](./modules/shared/_resumen-modulos.md)
- Módulos
  - [Usuarios](./modules/shared/usuarios.md)
  - [Eventos](./modules/shared/eventos.md)
  - [Datos del evento](./modules/shared/datos_evento.md)
  - [Invitados](./modules/shared/invitados.md)
  - [Mesas](./modules/shared/mesas.md)

- Flujos
  - [Login](./flows/auth-login.md)
  - [Subir imagen de evento](./flows/subir-imagen-evento.md)

- Modelo de datos
  - [Entidades y campos](./data-model/entities.md)
  - [API endpoints](./data-model/api-endpoints.md)

- Roadmap
  - [Backlog](./roadmap/backlog.md)
  - [Decisiones](./roadmap/decisions.md)

## Especificación por módulos (archivos)

### Shared (base)
- `modules/shared/usuarios.md`
- `modules/shared/eventos.md`
- `modules/shared/datos_evento.md`
- `modules/shared/invitados.md`
- `modules/shared/mesas.md`
- `modules/shared/_resumen-modulos.md`

### Admin
- `modules/admin/admin_home.md`
- `modules/admin/admin_eventos.md`
- `modules/admin/admin_mobiliario.md`
- `modules/admin/admin_alquiler.md`
- `modules/admin/admin_cotizador.md`
- `modules/admin/admin_frases.md`
- `modules/admin/admin_usuarios.md`

### Cliente
- `modules/cliente/cliente_feed_evento.md`
- `modules/cliente/cliente_datos_evento.md`
- `modules/cliente/cliente_calculador_trago.md`
- `modules/cliente/cliente_decoracion.md`
- `modules/cliente/cliente_fotos_compartidas.md`
- `modules/cliente/cliente_inspiracion.md`
- `modules/cliente/cliente_invitados.md`
- `modules/cliente/cliente_paletas_colores.md`
- `modules/cliente/cliente_pastel.md`
- `modules/cliente/cliente_pendientes.md`
- `modules/cliente/cliente_timming.md`
- `modules/cliente/cliente_tips_boda.md`
- `modules/cliente/cliente_wedding_day.md`

### Organizador (propuesto)
- `modules/organizador/organizador_dashboard.md`
- `modules/organizador/organizador_alquiler_mobiliario.md`
- `modules/organizador/organizador_agenda.md`
- `modules/organizador/organizador_pendientes.md`
- `modules/organizador/organizador_ajustes.md`

### Colaborador (propuesto)
- `modules/colaborador/colaborador_dashboard.md`
- `modules/colaborador/colaborador_checklist_montaje.md`
- `modules/colaborador/colaborador_checklist_recogida.md`
- `modules/colaborador/colaborador_agenda.md`
- `modules/colaborador/colaborador_ajustes.md`

