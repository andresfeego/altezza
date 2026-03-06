# Glosario

- **Evento**: entidad principal. Identificada por `evento.id`.
- **Módulo**: sección funcional dentro de la app (ej: `datos_evento`, `invitados`).
- **Invitación**: entidad que agrupa invitados. Relación `evento_has_invitacion`.
- **Invitado**: persona invitada. Relación `invitacion_has_invitado`.
- **Usuario del sistema**: login a la plataforma (tabla `usuariosistema`/`usuarioSistema`).
- **Rol**: perfil del usuario. El front usa `ROLE_IDS` y el backend retorna `rol`/`rolNombre`.
- **Imagen principal del evento**: ruta/URL de la imagen asociada al evento.
