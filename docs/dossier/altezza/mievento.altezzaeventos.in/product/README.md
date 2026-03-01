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
