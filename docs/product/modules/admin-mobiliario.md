← Volver al índice: [docs/product/README.md](../README.md)

# 🪑 Admin Mobiliario

## Estado funcional

Implementado en `/admin/mobiliario`. El módulo administra exclusivamente el inventario propio de Altezza y alimenta una única URL pública de catálogo. No incluye reservas, disponibilidad por fecha, proveedores, cotizaciones ni alquileres.

## Alcance

- Categorías administrables, ordenables, activables y desactivables; se precargan nueve categorías base.
- Alta simplificada con nombre, categoría, color, imagen de producto e imagen de decoración; siempre comienza en `borrador` y sin inventario.
- Presentaciones internas con SKU automático inmutable, medidas e inventario independiente. Una sola presentación se muestra como producto simple; varias se muestran como tamaños.
- Movimientos transaccionales: inventario inicial, entrada, retiro definitivo, fuera de servicio, reincorporación y corrección.
- Dos imágenes por producto (`producto` y `decoracion`), reemplazables individualmente y almacenadas en Cloudflare R2 privado.
- URL global de catálogo: generar, copiar, abrir, desactivar/reactivar y regenerar.
- Catálogo público editorial en `/catalogo-mobiliario/[publicCode]`, con banner, select de categorías, búsqueda por nombre/color/código y fichas alternadas.

## Reglas de negocio

- Todo producto nuevo comienza en borrador.
- Publicar exige categoría activa, las dos imágenes y al menos una presentación activa.
- El inventario inicial se define una sola vez al crear cada presentación; después solo cambia mediante movimientos auditables.
- Disponible actual = existencia total − unidades fuera de servicio.
- Una categoría con productos asociados no puede eliminarse.
- Un producto publicado no puede quedar sin las dos imágenes ni presentaciones activas.
- La URL anterior queda inválida inmediatamente cuando se regenera.
- El catálogo público nunca entrega SKU, precios, garantía, reposición, existencias ni disponibilidad.

## Persistencia y media

Tablas MariaDB en minúsculas y `utf8mb4_unicode_ci`: `mobiliario_categoria`, `mobiliario_producto`, `mobiliario_variante`, `mobiliario_movimiento`, `mobiliario_imagen` y `mobiliario_catalogo_publico`.

Las imágenes se validan por contenido real (JPEG, PNG o WebP, máximo 10 MB), se convierten con Sharp a `full.webp` de hasta 2000 px y `preview.webp` de hasta 640 px, conservando proporción. Se guardan en `mobiliario/{productoPublicCode}/{tipo}/{imagenPublicCode}/`. El acceso público usa una redirección a una URL R2 firmada de corta duración.

El backend toma el contenedor y las credenciales exclusivamente del entorno: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` y `R2_BUCKET_REGION`. No se envían credenciales al navegador ni se guardan en el repositorio.

Mobiliario no almacena precios, depósitos, reposición, unidades de medida comercial, paquetes ni cantidades mínimas. Los precios pertenecerán al flujo futuro de cotización de alquiler.

## Permisos

Las rutas administrativas requieren rol Admin mediante `x-altezza-user-id` y `x-altezza-user-role`. El catálogo y su media tienen endpoints públicos, pero solo exponen productos publicados completos.

## Rediseño del catálogo · septiembre 2026

- Banner con recursos locales: foto de montaje, patrón negro de la zona inferior de `banner_altezza.jpeg`, logo rosado y Engravers. La foto se desvanece en su último 20 % derecho. El diseño editorial específico (óvalo vertical, degradados, geometría y tipografía) sigue la referencia aprobada y se encapsula en variables/clases del catálogo; los controles administrativos reutilizan los tokens compartidos.
- Listado desktop de máximo 1024 px. La alternancia de fondo y orientación depende de la posición visible tras filtrar, empezando por el primer fondo. En móvil (<768 px) el contenido se apila. Medidas en bandas, color al pie; sin menú ni numeración de página.
- El botón «Colores catálogo», con icono de paleta junto a «Copiar URL», abre un modal para guardar `colorPrimario` y `colorSecundario` mediante selectores y campos hexadecimales de seis dígitos. Guardar cierra el modal tras éxito; Cancelar descarta el borrador. Valores iniciales: `#FFF7F7` y `#DDA08D`.
- `edicion` tiene formato `YYYY-MM`, se calcula en America/Bogota al generar/regenerar la URL y se conserva al reactivar. Migración de enlaces existentes: última regeneración o creación.
- Códigos de producto independientes de `publicCode` y SKU: prefijo permanente de categoría + consecutivo con mínimo dos dígitos. Ejemplos: `1001`, `1099`, `10100`. Visibles en catálogo, inventario y edición; buscables en público/admin.
- Prefijos base 10–18: Menaje de lujo, Backings, Centros de mesa, Portavelas, Bases florales, Mesas, Torteras, Accesorios y Sillas. Categorías nuevas: 19–99. Reordenar/renombrar no cambia prefijos. Se conservan las secuencias incluso al eliminar una categoría.
- Altas en borrador reciben código. Cambiar de categoría asigna el siguiente código del destino y no reutiliza el anterior. Migración de productos por `orden, id`. Asignación transaccional con restricciones únicas; nunca se calcula desde el número de filas existentes.
- API: `PATCH /mobiliario/catalogo-publico/estilo` requiere Admin y recibe ambos colores; responde `{ success: true, item }`. Errores 400 con `fields`, 403 sin permiso y 404 si falta generar el enlace. `GET /public/mobiliario/catalogo/:publicCode` devuelve `{ config: { colorPrimario, colorSecundario, edicion }, categories, products }`, incluso sin productos. Cada producto incorpora `codigo`; los SKU permanecen privados. Respuesta pública sin caché para reflejar estilos y revocación de enlaces en la siguiente carga.
- Migraciones backend: `20260911_006_mobiliario_codigos.js` y `20260911_007_mobiliario_catalogo_estilo.js`. Ejecutarlas en ese orden antes del backend y frontend nuevos. No ejecutar migraciones pendientes de otros módulos como parte de esta entrega.

### Validación

Estado funcional: implementado y verificado localmente. Estado UX/UI: revisión desktop/móvil realizada contra las referencias; pendiente de aceptación visual del usuario.

Pruebas automatizadas de integración en `backend-altezza/tests/mobiliario-catalogo.test.js`: usan una base efímera y necesitan un servidor MariaDB de pruebas con permiso para crear/eliminar bases. Se verificaron migración, concurrencia, cambio de categoría, continuidad de numeración, búsqueda, límite de prefijos, colores, edición en el cambio de mes de Colombia y ausencia de SKU en público.

Pruebas de navegador: filtros combinados y sin tildes, búsqueda por código/color, reinicio de alternancia, cero resultados, nombres largos, cero/tres/ocho medidas, ancho de 1024 px y viewports de 320/390/768/1024/1440 px. Formulario de colores: validación inline y envío de ambos valores con toast. Los casos múltiples y admin se probaron mediante respuestas interceptadas, sin insertar inventario.

Compilación de producción con `--no-lint`: correcta. ESLint sobre los archivos JS del cambio: correcto. El build normal se bloquea por Hooks condicionales preexistentes en `CountdownView.js` y `SaveTheDateCalendarView.js`, ajenos a este módulo.

### Refinamiento de composición

Franja de filtros a todo el ancho y sin márgenes verticales, con sombra inferior; controles centrados de ancho moderado (280/400 px en desktop), etiquetas solo accesibles y borde inferior. Fichas desktop 16:9 exactas, óvalo un 20 % menor (25,6 % del ancho de ficha), fotografía ambiental limitada al 40 % con transición en su último cuarto hacia el 60 % de fondo. Bandas de 40 px mínimos, separadas 16 px y ancladas abajo con el color al final; se elevan 32 px respecto al pie del óvalo y se extienden hasta su centro por detrás de la foto, con texto fuera de la zona superpuesta. Si hay muchas medidas, solo la lista de medidas tiene desplazamiento interno y el color permanece visible abajo. En móvil se conserva la composición apilada y la separación de 16 px.

## Orden de productos por categoría

El botón «Ordenar productos» aparece junto a «Categorías», ambos con icono de ordenar. Abre un modal con select de categoría y listado completo (sin límite de paginación), incluyendo código y estado. Las flechas Subir/Bajar modifican un borrador; «Guardar orden» persiste posiciones, cierra y actualiza inventario. Cancelar descarta cambios. Guardar antes de cambiar categoría; una respuesta de error permite recargar la lista.

API Admin: `GET /mobiliario/categorias/:id/productos/orden` devuelve `{ items }` con id/nombre/codigo/estado/orden. `PUT` en la misma ruta recibe `{ ids: number[] }` con todos los productos de esa categoría exactamente una vez y responde `{ success, items }`. Asignación transaccional 1…N sobre `mobiliario_producto.orden` existente; no requiere migración ni cambia códigos/SKU/estados. Rechaza duplicados (400), listas incompletas o productos ajenos (409) y categorías inexistentes (404). El catálogo conserva sus reglas de publicación y muestra el subconjunto público en ese orden.

Validación: integración MariaDB aislada para persistencia, códigos inalterados, rechazos sin escrituras parciales y orden de la respuesta pública. Navegador desktop/móvil con datos interceptados para mover, guardar, reabrir y categoría vacía; endpoint local comprobado y escritura sin rol rechazada (403). ESLint de archivos modificados correcto. Estado UX/UI: revisado localmente, pendiente de aceptación visual del usuario.
