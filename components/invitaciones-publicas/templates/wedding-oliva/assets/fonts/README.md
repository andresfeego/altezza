# Tipografías locales de Oliva

La plantilla usa tres familias, empaquetadas por Next.js desde esta carpeta:

- **Cormorant**: serif del contenido; variable de 300 a 700, normal y cursiva.
- **Montserrat**: sans serif de controles y fecha del sobre; variable de 100 a 900, normal y cursiva.
- **Allura**: nombres, títulos caligráficos y etiqueta del sobre; regular 400.

Las declaraciones `@font-face` y los tokens `--oliva-serif`, `--oliva-sans` y `--oliva-script` viven en `index.module.scss`. No se solicitan fuentes a Google Fonts ni se usan Libre Baskerville o Caviar Dreams en esta plantilla.

Cormorant y Montserrat se copiaron de los assets locales de `bodmys` del backend el 16 de septiembre de 2026. Se conservan los originales y las licencias OFL dentro de cada familia; Allura ya estaba organizada aquí. Se usan las versiones variables para evitar cargar un archivo por peso.
