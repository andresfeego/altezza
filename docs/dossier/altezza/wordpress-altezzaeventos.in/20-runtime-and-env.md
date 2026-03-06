# Runtime/ENV — WordPress

## Nginx
- Archivo: `/etc/nginx/sites-available/altezzaeventos.in`
- Endpoints especiales:
  - `/_wipi_ping` → `ok`
  - `/scrAppaltezza/images/eventos/` → assets en disco

## Docker
- Contenedor WP: `wp-altezza`
  - Publicación: `127.0.0.1:9021:80`
  - Bind mount:
    - `/opt/stacks/altezza/wp/html` (host) → `/var/www/html` (container)

- Contenedor DB: `wipi-mariadb`
  - Compose: `/opt/stacks/db/docker-compose.yml`
  - Volúmenes:
    - `/opt/stacks/db/data` → `/var/lib/mysql`
    - `/opt/stacks/db/backups` → `/backups`

## Secretos (no pegar valores aquí)
- Passwords DB:
  - viven en `wp-config.php` y/o en variables del contenedor DB.
- Recomendación: mover secretos a un manager o documentar “dónde están”, nunca el valor.
