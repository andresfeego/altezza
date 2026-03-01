# Dossier — Proyecto Altezza

Este dossier documenta **Altezza** como un solo proyecto, con dos frentes:

1) **WordPress informativo** (NO se versiona en Git): `altezzaeventos.in` / `www.altezzaeventos.in`
2) **Aplicación Mievento (Next.js)** (sí está en Git):
   - LAB: `lab-mievento.altezzaeventos.in` (rama `lab`)
   - PROD: `mievento.altezzaeventos.in` (rama `master`)

> Regla operativa acordada: **Wipi solo hace cambios en LAB**. La promoción a PROD se hace por **PR** revisado por Andres.

## Índice

- WordPress (informativo)
  - [Overview](./wordpress-altezzaeventos.in/00-overview.md)
  - [Arquitectura](./wordpress-altezzaeventos.in/10-architecture.md)
  - [Runtime/ENV](./wordpress-altezzaeventos.in/20-runtime-and-env.md)
  - [Despliegue/Ops](./wordpress-altezzaeventos.in/40-ops.md)
  - [Troubleshooting](./wordpress-altezzaeventos.in/60-troubleshooting.md)

- Mievento (App)
  - [Overview](./mievento.altezzaeventos.in/00-overview.md)
  - [Arquitectura](./mievento.altezzaeventos.in/10-architecture.md)
  - [Runtime/ENV](./mievento.altezzaeventos.in/20-runtime-and-env.md)
  - [Deploy](./mievento.altezzaeventos.in/30-deploy.md)
  - [Ops](./mievento.altezzaeventos.in/40-ops.md)
  - [Local Dev](./mievento.altezzaeventos.in/50-local-dev.md)
  - [Troubleshooting](./mievento.altezzaeventos.in/60-troubleshooting.md)

- Global
  - [Changelog](./90-changelog.md)

## Política de secretos

- **Nunca** pegar contraseñas/tokens aquí.
- Referenciar ubicación:
  - GitHub Actions Secrets
  - VPS: archivos `*.env`/`env_file` fuera del repo
  - Password manager
