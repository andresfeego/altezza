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
- [Resumen de módulos (menús/roles)](./modules/_resumen-modulos.md)
- Módulos
  - [Usuarios](./modules/usuarios.md)
  - [Eventos](./modules/eventos.md)
  - [Datos del evento](./modules/datos_evento.md)
  - [Invitados](./modules/invitados.md)
  - [Mesas](./modules/mesas.md)

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

### Admin
- `modules/admin_home.md`
- `modules/admin_eventos.md`
- `modules/admin_mobiliario.md`
- `modules/admin_alquiler.md`
- `modules/admin_cotizador.md`
- `modules/admin_frases.md`
- `modules/admin_usuarios.md`

### Cliente
- `modules/cliente_feed_evento.md`
- `modules/cliente_datos_evento.md`
- `modules/cliente_calculador_trago.md`
- `modules/cliente_decoracion.md`
- `modules/cliente_fotos_compartidas.md`
- `modules/cliente_inspiracion.md`
- `modules/cliente_invitados.md`
- `modules/cliente_paletas_colores.md`
- `modules/cliente_pastel.md`
- `modules/cliente_pendientes.md`
- `modules/cliente_timming.md`
- `modules/cliente_tips_boda.md`
- `modules/cliente_wedding_day.md`

### Organizador (propuesto)
- `modules/organizador_dashboard.md`
- `modules/organizador_alquiler_mobiliario.md`
- `modules/organizador_agenda.md`
- `modules/organizador_pendientes.md`
- `modules/organizador_ajustes.md`

### Colaborador (propuesto)
- `modules/colaborador_dashboard.md`
- `modules/colaborador_checklist_montaje.md`
- `modules/colaborador_checklist_recogida.md`
- `modules/colaborador_agenda.md`
- `modules/colaborador_ajustes.md`
