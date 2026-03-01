# Troubleshooting — Mievento

## No carga la app
- Ver contenedor:
  - `docker ps | grep mievento-`
- Ver logs:
  - `docker logs --tail 200 mievento-lab`

## API no responde (LAB)
- Verificar backend-altezza:
  - `systemctl status backend-altezza`
  - `ss -ltnp | grep 3022`
- Verificar Nginx location `/api/responseAltezza/` en vhost LAB.

## Imágenes no cargan
- Confirmar que Nginx tiene alias a `/srv/altezza/scrAppaltezza/images/eventos/`.
