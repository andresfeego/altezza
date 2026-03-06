# Flujo: Login

## Frontend
- Archivo: `pages/_api/Login/login.js`
- Llama a: `loginUsuario(correo, pass)` → `components/initialized/data/helpersGetDB.js`

## Backend
- Endpoint: `POST /api/responseAltezza/usuario/loginUsuario`

### Request (JSON)
```json
{ "correo": "<username>", "pass": "<password>" }
```

### Response (JSON)
```json
{ "success": true, "userId": 123, "usuario": { /* user */ } }
```

### Errores lógicos
El backend usa respuestas `200` con un payload con `error`:
- `error: 404` → credenciales inválidas
- `error: 401` → contraseña incorrecta
- `error: 406` → usuario sin contraseña asignada
- `error: 409` → ingreso con contraseña temporal

## Notas
- El backend hoy compara contraseñas en texto plano.
- El frontend actualmente muestra un error genérico.
