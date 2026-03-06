# Deploy — Mievento

## Ramas
- LAB: rama `lab` → `lab-mievento.altezzaeventos.in`
- PROD: rama `master` → `mievento.altezzaeventos.in`

## CI/CD
- CI/CD se ejecuta con GitHub Actions (ver `.github/workflows/`).
- Regla: cambios a PROD entran por PR.

## Runtime en VPS
- Contenedores:
  - `mievento-lab` (3101)
  - `mievento-prod` (3100)

## Reinicio/actualización
- Se hace rebuild del contenedor correspondiente y Nginx sigue apuntando al puerto local.
- Comandos (VPS):
  - `cd /opt/stacks/mievento && docker compose up -d --build`
