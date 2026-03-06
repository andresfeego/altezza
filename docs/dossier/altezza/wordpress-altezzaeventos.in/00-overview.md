# WordPress — altezzaeventos.in (informativo)

## Dominios
- `altezzaeventos.in`
- `www.altezzaeventos.in`

## Qué es
- Sitio informativo (WordPress).
- **El código de WordPress NO se versiona** en este repo. Solo documentamos la configuración.

## En VPS (resumen)
- Nginx recibe tráfico y proxy-pasa a un contenedor WordPress.
- Los assets de la app (imágenes de eventos) se sirven desde disco por Nginx en `/scrAppaltezza/images/eventos/`.

## Healthcheck rápido
- `https://altezzaeventos.in/_wipi_ping` → responde `ok`
