# Local Dev (Mac) — Mievento + Backend

## Requisitos
- Node (idealmente igual al servidor): `v22.22.0`
- MySQL/MariaDB local con la DB importada

## Backend (backend-altezza)
1) Clonar repo `backend-altezza` y crear `.env.local`.
2) Crear carpeta de runtime (ignoradas por git): `_local_storage/`.
3) `npm i && npm start`.

Backend debe quedar en:
- `http://localhost:3022`

## Front (mievento)
1) En `lab/app`, crear `.env.local`:

```env
HOST_NAME=http://localhost:3022/api/responseAltezza
```

2) Correr:
- `npm i`
- `npm run dev`

## Assets (imágenes de eventos)
- En VPS se sirven desde:
  - `/srv/altezza/scrAppaltezza/images/eventos/` (disco)
- En local (con el PR del backend):
  - `backend-altezza/_local_storage/images/eventos/`
  - servidos por Express en:
    - `http://localhost:3022/scrAppaltezza/images/eventos/*`
