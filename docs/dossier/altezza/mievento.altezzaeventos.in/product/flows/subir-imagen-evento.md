# Flujo: Subir imagen de evento

## Frontend
- Disparador: módulo `datos_evento` (componente `DatosEvento.js`).
- Proceso:
  1) Usuario recorta imagen (`CropImagen`).
  2) Se genera un `base64`.
  3) Se convierte a `File` (`base64ToFile`).
  4) Se envía a backend con `FormData`.

## Backend
- Endpoint: `POST /api/responseAltezza/uploadImagenEvento`
- Tipo: `multipart/form-data`

### FormData
- `imagen`: archivo
- `codigoEvento`: id del evento
- `modulo`: string (ej: `datos_evento`)

### Efectos
- Guarda archivo como webp (sharp) en:
  - `<BASE_DIR>/<codigoEvento>/<modulo>/image_<random>.webp`
- Actualiza DB:
  - `evento.imagenPrincipal = /<codigoEvento>/<modulo>/<filename>`
- Responde:
```json
{ "url": "<PUBLIC_BASE_URL>/scrAppaltezza/images/eventos/<rutaRelativa>" }
```

## Notas
- `PUBLIC_BASE_URL` y `ALTEZZA_EVENTOS_PUBLIC_PATH` controlan la URL retornada.
