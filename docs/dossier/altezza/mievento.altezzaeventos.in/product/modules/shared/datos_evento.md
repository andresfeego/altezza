# Módulo: Datos del evento (`datos_evento`)

## Pantalla
- Ruta: `pages/evento/datos_evento/[idEvento].js`

## Componentes principales
- `components/eventos/modulos/datos_evento/DatosEvento.js`
- `components/eventos/modulos/datos_evento/FormularioEdicion.js`
- `components/eventos/modulos/datos_evento/EditorPersonalizado.js`
- Editores por tipo:
  - `editor_tipos/EditorMatrimonio.js`
  - `EditorQuince.js`, `EditorBautizo.js`, etc.

## Funcionalidad actual

### Vista (modo normal)
- Muestra:
  - Imagen principal (con posibilidad de recorte)
  - Nombre, tipo, lugar recepción, fecha, estado

### Subida/recorte de imagen
- Usa `CropImagen` → entrega `base64` → se convierte a File (`base64ToFile`) → se sube con:
  - `uploadImagenEvento(file, evento.id, 'datos_evento')`

### Edición (modo edición)
- En `FormularioEdicion` existen campos UI:
  - nombre
  - fechaHoraCeremonia
  - fechaHoraRecepcion
  - fechaHoraLimiteConfirmar
  - hashtag
  - numeroInvitados
  - tipo de evento (solo lectura)
- **Pero guardar al backend NO está implementado aún** (solo muestra toast "Cambios guardados").

## Campos que se consumen del backend (evento)
Vienen de `GET /eventos/detalle_completo/:idEvento`.
En UI se usan:
- `id`
- `nombre`
- `idTipoEvento`
- `nombreTipoEvento`
- `nombreLugarRecepcion`
- `fechaHoraCeremonia`
- `fechaHoraRecepcion`
- `fechaHoraLimiteConfirmar`
- `hashtag`
- `numeroInvitados`
- `estado`
- `imagenPrincipal`
