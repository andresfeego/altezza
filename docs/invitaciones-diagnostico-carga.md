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

## Preparación completa en Oliva — 22 de septiembre de 2026

La política anterior de tres segundos no cumplía el nuevo requisito de mostrar
la tarjeta con todos los medios preparados. En pruebas con seis segundos de
retraso, la capa desaparecía antes del sobre y del video: el helper omitía
imágenes ocultas o sin altura, no esperaba video y aceptaba el vencimiento como
éxito. Era un criterio de preparación del frontend, no un fallo de Cloudflare.

La ruta pública de Oliva ahora usa `useMediaPreparationOliva` con manifiesto de
recursos de módulos habilitados, incluyendo máscaras/texturas CSS y fuentes.
Espera imágenes cargadas/decodificadas y descarga completa del video y la música
a blobs reutilizados por el DOM. Después espera los elementos reales y dos
frames antes de retirar el cargador. Un fallo o 90 s de espera ofrece reintento;
nunca convierte un recurso pendiente en éxito. `waitForInitialAssets` conserva
su comportamiento anterior en las demás plantillas.

Los 21 archivos inventariados de Mayra/Samuel pasaron de 52.72 a 13.26 MB. Los
originales siguen en sus rutas y también tienen respaldo verificado por SHA-256.
La configuración local, seed, imports y whitelist del gateway usan los derivados.
El procedimiento y perfiles están en el README de `bodmys` del backend.

Validación local: Chrome y WebKit móvil retiraron el cargador con las 28 imágenes
del DOM completas, fuentes cargadas y audio/video preparados. Al retener durante
6 s el sobre, video, paleta o música, Chrome mantuvo la capa e interacción
bloqueada a los 3.3 s y terminó solo tras cada descarga. Un 503 de video presentó
error recuperable y el botón Reintentar completó la carga sin recargar la página.
Por el túnel, Chrome y WebKit sin caché finalizaron en 25.625 / 33.763 s: todas las
imágenes y fuentes listas, audio/video preparados, una sola descarga por archivo
binario y sin solicitudes fallidas ni errores JavaScript. Esta espera incluye
la música y el video completos, a diferencia de la medición del 21 de septiembre.
Los artefactos están en `output/playwright/media-ready-20260922/`; el informe y
logs de compresión en `output/media-audit-20260922/` (locales, fuera del commit).

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

## Revisión del 21 de septiembre de 2026

Ante un nuevo reporte de carga detenida se probó la apertura real en navegador,
además de HTTP. No se reprodujo el bucle anterior de Fast Refresh: tres recargas
en desarrollo local terminaron en 1,232 / 1,328 / 1,212 segundos, con exactamente
tres peticiones de documento, hash HMR estable y ninguna recarga adicional durante
20 segundos de observación. El backend continuó respondiendo 200.

El túnel estaba apuntando otra vez al servidor de desarrollo del puerto 3002.
La apertura por ese túnel tardó 23,641 segundos; `_app.js` transfirió 15,5 MB y
tardó 21,1 segundos. El límite de tres segundos del cargador empieza después del
arranque de React, por lo que no puede acortar esa descarga inicial.

Se compiló la versión actual, incluidas las esquinas florales, con
`npm run build:preview`, y se arrancó en 3004 con `npm run preview:local`.
La prueba por LAN abrió en 0,834 segundos y transfirió 179.572 bytes de JavaScript.
El gateway de Oliva ahora usa 3004 por defecto; 3002 solo se elige explícitamente
con `OLIVA_PREVIEW_UPSTREAM_PORT=3002` para una prueba de desarrollo.

El túnel anterior mostró variación de 3,6 a 15,3 segundos incluso con la versión
optimizada. En una carga sin caché, cuatro scripts de 39–46 kB tardaron unos diez
segundos en terminar de recibirse. Se creó un túnel nuevo con
`cloudflared tunnel --url http://127.0.0.1:3003 --protocol http2 --no-autoupdate`.
La conexión nueva se registró en `bog04`; la anterior usaba QUIC y `tpa01`.
Estas mediciones no establecen por sí solas un fallo interno de Cloudflare.

En el túnel nuevo, las aperturas sin recursos previos de ese host tardaron
6,147 segundos en Chrome y 6,210 en WebKit móvil, con unos 180 kB de JavaScript.
En ambos se abrió el sobre, se comprobó la presencia de las dos esquinas nuevas
y se llegó a las fotos finales. No hubo errores JavaScript, HTTP fallidos,
WebSocket HMR, reaparición del cargador ni recargas extra durante diez segundos
de observación. La compilación y las 54 pruebas de carga, contratos y animaciones
pasaron. Los tiempos son mediciones desde este equipo, no una garantía para
cualquier conexión o teléfono.

Para que el túnel muestre cambios posteriores, detener el proceso de vista
optimizada, volver a compilar y arrancarlo antes de verificar. Guardar un archivo
en desarrollo no actualiza la compilación de 3004. No compilar sobre el directorio
que un proceso activo de vista optimizada está sirviendo.
