# Ops — WordPress

## Ver estado
- Nginx:
  - `sudo nginx -t`
  - `sudo systemctl status nginx`

- Docker:
  - `docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | egrep 'wp-altezza|wipi-mariadb'`

## Logs
- WP container:
  - `docker logs --tail 200 wp-altezza`

## Backups
- DB: revisar `/opt/stacks/db/backups` (si hay rutinas programadas, documentarlas aquí).

## Cambios (política)
- Cambios de vhost y docker en PROD requieren confirmación de Andres.
