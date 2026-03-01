# Arquitectura — WordPress altezzaeventos.in

## Componentes

- **Nginx (host)**
  - vhost: `/etc/nginx/sites-available/altezzaeventos.in`
  - TLS con Certbot
  - Proxy a WordPress en `127.0.0.1:9021`
  - Sirve assets de eventos desde disco:
    - URL pública: `https://altezzaeventos.in/scrAppaltezza/images/eventos/*`
    - Ruta en disco (VPS): `/srv/altezza/scrAppaltezza/images/eventos/`

- **WordPress (Docker)**
  - contenedor: `wp-altezza`
  - puerto publicado local: `127.0.0.1:9021 -> 80`
  - código WP montado (bind): `/opt/stacks/altezza/wp/html -> /var/www/html`

- **DB (Docker)**
  - contenedor MariaDB: `wipi-mariadb` (stack `/opt/stacks/db/docker-compose.yml`)
  - puerto publicado local: `127.0.0.1:3306 -> 3306`

## Diagrama (texto)

Internet
  -> Nginx :443 (altezzaeventos.in)
      -> / (y /web/)  --> http://127.0.0.1:9021 (wp-altezza)
      -> /scrAppaltezza/images/eventos/* --> alias /srv/altezza/scrAppaltezza/images/eventos/

## Notas
- Credenciales de DB están en `wp-config.php` del WordPress montado, pero **NO se documentan aquí** (se consideran secreto).
