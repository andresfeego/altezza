# Arquitectura — Mievento

## Componentes

- **Nginx (host)**
  - `mievento.altezzaeventos.in` → proxy a `127.0.0.1:3100`
  - `lab-mievento.altezzaeventos.in` → proxy a `127.0.0.1:3101`
  - LAB además proxy-pasa:
    - `/api/responseAltezza/*` → backend-altezza (puerto 3022)
    - y sirve assets:
      - `/scrAppaltezza/images/eventos/*` → alias `/srv/altezza/scrAppaltezza/images/eventos/`

- **Mievento (Docker)**
  - build y run vía `/opt/stacks/mievento/docker-compose.yml`
  - Dockerfile: `/opt/stacks/mievento/Dockerfile`

- **Backend Altezza (Node, systemd)**
  - servicio: `backend-altezza.service`
  - escucha en `:3022`

## Diagrama (texto)

Internet
  -> Nginx :443
     -> (LAB host)   /           -> 127.0.0.1:3101 (mievento-lab)
     -> (LAB host)   /api/...    -> 127.0.0.1:3022 (backend-altezza)
     -> (PROD host)  /           -> 127.0.0.1:3100 (mievento-prod)

## Notas importantes
- En el código, `HOST_NAME` se usa como base para llamar endpoints del backend (`components/initialized/data/SetDB.js`).
- Política: Wipi trabaja en LAB; la promoción a PROD se hace por PR.
