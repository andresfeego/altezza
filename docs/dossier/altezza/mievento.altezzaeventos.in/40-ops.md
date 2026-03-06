# Ops — Mievento

## Ver estado
- Docker:
  - `docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | egrep 'mievento-(lab|prod)'`
- Nginx:
  - `sudo nginx -t`
  - `sudo systemctl reload nginx`

## Logs
- `docker logs --tail 200 mievento-lab`
- `docker logs --tail 200 mievento-prod`

## Nginx vhosts
- `/etc/nginx/sites-available/mievento.altezzaeventos.in`
- `/etc/nginx/sites-available/lab-mievento.altezzaeventos.in`
