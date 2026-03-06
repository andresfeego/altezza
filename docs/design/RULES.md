# Reglas de diseño — Mievento (Altezza)

> Fuente: lectura del código actual del repo (`pages/*.scss`, `components/initialized/variables.scss`, `pages/_app.js`, `next.config.js`).
> Este documento busca describir **lo que ya está**. No es una re-interpretación.

---

# Identidad visual (tokens existentes)

## Tipografías
El proyecto carga varias fuentes, pero actualmente el estilo global usa principalmente:
- `caviar` (definida en `pages/stylesGlobal.scss`)

También existen definiciones de:
- `Poppins` (definida en `pages/app.scss`)
- `Libre Baskerville` (definida en `pages/app.scss`)

Regla observable:
- El `body` en `pages/stylesGlobal.scss` aplica `font-family: 'caviar' !important`.

## Colores (SCSS variables)
Variables definidas en `components/initialized/variables.scss`:
- `$primary: #ec9fb5`
- `$primaryDark: #c76a84`
- `$secondary: #6c3c3c`
- `$secondaryDark: #4d2626`
- Estados/semánticos:
  - `$verde: #A8CF45`
  - `$rojo: #F33446`
  - `$azul: #0098DA`
- Escala de grises: `$gray*`, `$white*`

## Loader superior (NextTopLoader)
Configuración en `pages/_app.js` (valores actuales):
- `color="#E6B7B1"`
- `shadow="0 0 13px #E6B7B1,0 0 8px #C48C96"`

---

# UI / Componentes (convenciones observables)

## Base UI
- Se usa **Material UI (MUI)** (`@mui/material`, `@mui/icons-material`).
- Se sobreescriben estilos globales para componentes MUI en `pages/stylesGlobal.scss` (ej. labels, inputs, etc.).

## Botones (estilo global)
En `pages/stylesGlobal.scss` existe un estilo global para `button`:
- `background-color: #ec9fb5` (primary)
- `border-radius: 6px`
- hover: `#d78ca2`
- disabled: `#e3cdd4`

Regla observable:
- `button { text-transform: initial !important; font-size: 1em !important; }`

## Links
En `pages/stylesGlobal.scss`:
- `a:-webkit-any-link { color: inherit; text-decoration: none; }`

---

# Layout / Navegación

## Navegación lateral
En `pages/_app.js`:
- Si hay `usuario`, se renderiza `SideMenu`.
- Paths “públicos” (sin menú):
  - `/_api/Login/login`
  - `/_api/registro/registro`

## Menú de usuario
En `pages/_app.js`:
- `UserMenuButton` se muestra cuando hay `usuario`.

---

# Reglas de assets / rutas

## Assets legacy
Existe un directorio `scrAppServer/` y el repo referencia assets desde esa estructura.

En `next.config.js`:
- `sassOptions.includePaths` incluye `./components/initialized`.
- `prependData: @use './variables' as *;` (las variables SCSS se inyectan globalmente).

---

# Recomendaciones (no obligatorias) — para pulir luego

## Consistencia de tipografías
Actualmente hay definiciones de `Poppins` y `Libre Baskerville`, pero `stylesGlobal.scss` fuerza `caviar` con `!important`.
- Recomendación: decidir una sola tipografía base (o una jerarquía clara) y reducir `!important`.

## Evitar overrides globales excesivos
Hay muchas reglas globales con `!important` que afectan MUI.
- Recomendación: mover overrides a un theme de MUI (ThemeProvider) o a scopes por layout.

## Normalizar tokens
Los colores están parcialmente en SCSS (`variables.scss`) y parcialmente hardcodeados en archivos.
- Recomendación: centralizar tokens (SCSS + theme MUI) y evitar hex repetidos.
