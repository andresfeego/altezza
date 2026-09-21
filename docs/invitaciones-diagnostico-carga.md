# Diagnóstico de carga de la invitación — 18 de septiembre de 2026

Se revisó `/invitacion/mysprueba/910171` por localhost y por la IP de LAN,
sin pasar por Cloudflare.

## Hallazgos comprobados

1. **Bucle de Fast Refresh en desarrollo.** El navegador recibía un runtime
   Webpack con hash `9e6bd70e0ba1e3c7`, mientras el WebSocket anunciaba
   `0297128c83e67c95`. La petición
   `/_next/static/webpack/9e6bd70e0ba1e3c7.webpack.hot-update.json` devolvía 404.
   Next recargaba la página, recibía otra vez el mismo runtime y repetía el ciclo.
   Se reprodujo en una sesión nueva de Chrome y duró más de tres minutos.
   El reinicio de Next restableció la coherencia. No se determinó qué ejecución
   anterior dejó desincronizados el servidor y los archivos compilados.

2. **Espera innecesaria de imágenes ocultas.** El cargador recorría todos los
   `img`, incluidos los del interior oculto y los de `loading="lazy"`.
   Se observaron 12 imágenes diferidas pendientes detrás del sobre; por eso
   la espera agotaba sus 12 segundos aunque la portada estuviera lista.
   Tras reiniciar, una carga anterior al arreglo tardó 18,1 segundos en total.

3. **Fuentes sin límite de espera.** `document.fonts.ready` se esperaba antes
   de crear el temporizador de imágenes. Una fuente detenida podía bloquear
   indefinidamente el cargador. Además, una imagen ya fallida se suscribía a un
   evento `error` que ya había ocurrido.

4. **Peso del modo de desarrollo.** El archivo `_app.js` ocupaba unos 67 MiB
   sin comprimir y unos 15,5 MB transferidos. La mayor parte eran catálogos de
   `react-icons`. La compilación optimizada de la invitación requiere unos
   161 kB de JavaScript comprimido en las mediciones de navegador. Las imágenes
   y el video son adicionales; no se modificó su calidad en este diagnóstico.

5. **Backend estable durante las mediciones.** Ocho consultas directas
   consecutivas respondieron 200 en 6–26 ms. El HTML por localhost y LAN
   respondió 200. El fondo del módulo de nombres no se solicitó antes de abrir
   el sobre; no fue el origen del bucle de recarga observado.

## Cambios

- `waitForInitialAssets` espera solo imágenes no diferidas de la primera
  pantalla, excluye contenido `hidden` y considera las imágenes ya fallidas.
- Un único plazo de tres segundos, contado desde el efecto del componente,
  cubre imágenes, decodificación y fuentes. No incluye la descarga previa
  del JavaScript. Los recursos pendientes pueden terminar después de mostrar
  la tarjeta. Al desmontar se retiran los listeners y el temporizador.
- La consulta SSR al backend tiene un límite de diez segundos. Se conserva
  el tratamiento existente de errores de esta ruta.
- Desarrollo usa `.next-dev`; producción, `.next`; y la vista local optimizada,
  `.next-preview`. Una compilación de producción no sobrescribe los archivos
  que está sirviendo el proceso de desarrollo.
- La vista optimizada local activa explícitamente las rutas al backend local
  mediante `ALTEZZA_LOCAL_PREVIEW=1`. Las rutas de producción normal conservan
  su configuración anterior.

## Uso local

Backend requerido en el puerto 3022.

- Edición con Fast Refresh: `npm run dev`, puerto 3002.
- Preparar la vista optimizada: `npm run build:preview`.
- Servir esa compilación: `npm run preview:local`, puerto 3004.

La vista optimizada no recarga al editar. Para actualizarla, detenerla,
volver a compilar y arrancarla de nuevo. No ejecutar otra compilación sobre
`.next-preview` mientras esa misma compilación se está sirviendo.

## Verificaciones

- 33 pruebas de contratos y carga: imágenes ocultas/diferidas, imágenes
  fallidas, fuentes detenidas, decodificación detenida y limpieza al desmontar.
- Desarrollo: tres recargas con apertura disponible en 1,3–1,5 segundos.
  Una observación posterior de 20 segundos registró una única petición de
  documento y ningún HTTP fallido.
- Contextos nuevos en móvil: carga normal, fuentes bloqueadas e imagen del
  sobre fallida. La tarjeta siguió siendo operable; con tres fuentes retenidas
  el cargador se retiró aun estando `document.fonts.status` en `loading`.
- Compilación optimizada completa, incluidas 126 páginas estáticas.
- Vista optimizada: seis cargas entre escritorio y móvil, apertura del sobre
  y llegada al vestuario, sin errores de JavaScript, sin WebSocket de Fast
  Refresh y sin desbordamiento horizontal. Disponibilidad medida: 0,12–0,43 s.
- Red simulada de 8 Mbps y 100 ms de latencia, móvil sin caché: apertura
  disponible en 3,77 s, una sola petición de documento y ningún error de
  JavaScript; observación adicional de diez segundos sin recargas.

Los tiempos se midieron desde este equipo usando su dirección LAN; no equivalen
a una medición física desde otro teléfono o a través de Cloudflare. La prueba
inicial de HTTP/HMR y las capturas quedaron en
`output/playwright/loading-investigation/` (artefactos locales, fuera del commit).
