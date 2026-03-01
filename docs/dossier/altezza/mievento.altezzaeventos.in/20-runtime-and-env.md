# Runtime/ENV — Mievento

## Next.js
- Versión: `next@13.4.5`
- Script dev: `next dev -p 3002` (en `package.json`)

## Variables
- `HOST_NAME`
  - Define el base URL del backend para `setDB()`.
  - En LAB (VPS) suele ser `'/api/responseAltezza'` (same-origin via Nginx).
  - En local (Mac) debe apuntar al backend local, por ejemplo:
    - `HOST_NAME=http://localhost:3022/api/responseAltezza`

## Dónde viven los secretos en VPS
- Para contenedores Docker, la config se inyecta por `env_file` (fuera del repo).
- No documentar valores; documentar ubicaciones.
