# Mievento — App (Next.js)

## Dominios
- LAB: `lab-mievento.altezzaeventos.in` (rama `lab`)
- PROD: `mievento.altezzaeventos.in` (rama `master`)

## Qué es
- Aplicación web (Next.js 13.4.5) para gestión del evento (módulos como `datos_evento`, etc.).

## Runtime en VPS (resumen)
- App corre en **Docker**:
  - `mievento-lab` publicado en `127.0.0.1:3101`
  - `mievento-prod` publicado en `127.0.0.1:3100`
- Nginx hace reverse proxy según dominio.

## Healthcheck rápido
- `https://mievento.altezzaeventos.in/_wipi_ping` → `ok`
- `https://lab-mievento.altezzaeventos.in/_wipi_ping` → `ok`
