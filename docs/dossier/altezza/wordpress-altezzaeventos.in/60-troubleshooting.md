# Troubleshooting — WordPress

## 502/Bad Gateway en altezzaeventos.in
- Verificar `wp-altezza` levantado:
  - `docker ps | grep wp-altezza`
- Verificar que el puerto `9021` esté escuchando:
  - `ss -ltnp | grep 9021`
- Ver logs:
  - `docker logs --tail 200 wp-altezza`

## Imágenes de eventos no cargan
- Confirmar que existen archivos en:
  - `/srv/altezza/scrAppaltezza/images/eventos/`
- Confirmar Nginx alias:
  - `location ^~ /scrAppaltezza/images/eventos/ { alias ... }`
