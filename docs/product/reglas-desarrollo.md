# Reglas de desarrollo

## Objetivo

Este archivo fija reglas operativas para trabajar el producto entre frontend, backend y base de datos.

## Reglas base

- `docs/product` es la fuente de verdad funcional.
- Para trabajo de UI en este repo, el punto de entrada operativo es `.codex/skills/altezza-ui-governance/SKILL.md`, pero las reglas activas de desarrollo y diseno se leen primero aqui en `docs/product/reglas-desarrollo.md`.
- El backend y el frontend no deben inventar contratos fuera de esa base sin dejarlo documentado.
- Si un cambio afecta datos, primero se revisa esquema y contrato antes de tocar UI.

## Backend

- Todo cambio de esquema debe salir como migracion.
- No hacer cambios manuales a la base si ese cambio debe repetirse en otros entornos.
- Las rutas nuevas deben usar HTTP semantico real.
- Las respuestas deben ser consistentes y faciles de consumir desde frontend.
- Si un modulo depende de tablas incompletas, primero se crea la migracion, luego el endpoint.

## Frontend

- No mostrar rutas falsas o placeholders como si fueran funcionalidades reales.
- El menu debe respetar el manual de producto.
- La navegacion por rol y por evento debe pasar por una sola regla central.
- Si un endpoint aun no existe, usar placeholder explicito o dejar el modulo fuera del menu.
- Cada vez que un flujo ya sea funcional, dejar una lista minima de pruebas manuales para validar en pagina.
- Un modulo funcional no se considera cerrado hasta tener revision UX/UI y estado de diseño aprobado.
- En `base-desarrollo.md` cada punto debe reflejar dos estados:
  - estado funcional
  - estado UX/UI
- En formularios, el patron base es:
  - `toast` para resultado general de la accion
  - error `inline` para problemas especificos de campos
- La autovalidacion de campos no hace parte del baseline actual hasta que se implemente formalmente.
- La navegacion movil base entre modulos usa drawer lateral.
- Si una pantalla necesita acciones contextuales en la esquina superior derecha, llamaremos ese patron `Boton de acciones de pantalla`.

## Refinamientos UI Governance

- La skill `altezza-ui-governance` debe aplicarse en cualquier trabajo de UI: componentes, pantallas, layouts, dashboards, formularios, modales, landings e interfaz visual web o mobile.
- Los modulos administrativos deben reutilizar un shell transversal de modulo para contenedor interno, encabezado, titulo principal, bloque resumen, accion primaria y card base de seccion. No duplicar estas bases por modulo.
- Los modulos cliente tambien deben reutilizar un shell transversal de modulo para encabezado principal, resumen, toolbar, estados vacios y piezas base de seccion. La base actual para Fase 1 debe construirse desde `EventClientModuleShell` y no desde headers locales por modulo.
- Las rutas de modulos administrativos deben entrar por un contenedor transversal de seccion. Regla base actual: desktop con compensacion lateral del menu; en `<=1024px`, `margin-left: 0` y `padding: 56px 16px 16px`.
- El contenedor transversal de seccion no debe redefinirse por modulo salvo necesidad justificada. La base debe vivir en una capa compartida.
- La interfaz debe priorizar fondos planos claros. Evitar gradientes decorativos como base de pantalla.
- La jerarquia visual debe salir de composicion, espaciado, cards y sombras suaves, no de fondos recargados.
- Las cards deben mantenerse blancas o casi blancas, con bordes suaves y sombras muy sutiles.
- Evitar tonos amarillos o calidos excesivos en superficies generales. El color de marca debe usarse con medida.
- La direccion visual aprobada por ahora es sobria, moderna, simple y limpia.
- En movil, las tablas pueden usar scroll horizontal si eso conserva claridad.
- En tablas con scroll horizontal, la columna de acciones no debe romperse en pilas verticales si eso empeora la lectura.
- La validacion visual final de formularios, focos y errores no debe cerrarse mientras existan estilos globales agresivos que contaminen inputs y botones.
- Antes de convertir una decision visual en regla definitiva, revisar si el resultado esta afectado por herencia global desde `stylesGlobal.scss`.
- Los titulos principales de modulo o seccion no deben ir dentro de cards visuales.
- No usar badges decorativos de contexto como parte fija del encabezado de un modulo.
- No usar textos de contexto redundantes sobre el `h1` cuando el titulo principal ya explica suficientemente la vista. Ejemplos a evitar: `Modulo cliente`, `Invitacion actual`, `Gestion de ...` como eyebrow por defecto sin valor real.
- Los titulos principales de modulo o seccion deben alinearse a la derecha y ocupar aproximadamente el `80%` del ancho visual disponible del encabezado, con respiracion derecha basada en la escala de espaciado.
- Los titulos principales de modulo o seccion deben tener tambien respiracion inferior basada en la escala, para separarse del bloque resumen o del contenido inmediato.
- Los titulos de seccion internos como `h2` tambien deben salir de clases transversales del shell compartido. No resolver `h2` por modulo con estilos aislados si la estructura es la misma.
- Los resumenes cortos de una seccion deben ser minimalistas, pequenos y preferiblemente concentrados en una sola pieza visual, no en varias cards pesadas.
- Las cards de resumen del `feed` deben ser especialmente sobrias. Regla base:
  - no usar eyebrow tipo `Resumen del modulo`
  - no usar descripcion larga si las metricas ya explican el estado
  - no usar CTA textual fijo como `Ver modulo` cuando toda la card ya es clickeable
  - priorizar titulo + metricas + jerarquia limpia
  - el espaciado interno entre titulo y bloque de metricas debe ser compacto; baseline actual para previews del feed: `gap: var(--ag-space-3)` en el contenedor principal de la card
- En modales y detalles internos, evitar la composicion `card sobre card sobre card`. La regla base es una sola superficie principal por nivel; dentro de ella, listas y textos deben resolverse con divisores, bloques planos o panels suaves solo cuando sean realmente necesarios.
- En listas verticales de items, acciones o modulos, usar una sola estrategia de separacion. Regla base: solo separador superior en el item siguiente. No duplicar separador inferior + superior entre dos bloques consecutivos.
- En listas internas de modales o detalles, la preferencia es visual tipo lista o tabla editorial: filas limpias, un solo divisor entre items, sin fondo diferenciado por fila salvo necesidad funcional.
- Cuando una lista secundaria dentro de un modal pueda crecer demasiado, no expandirla completa por defecto. Regla base: usar acordeon o seccion colapsable y limitar la altura visible con scroll interno.
- No usar textos descriptivos del tipo "desde aqui puedes..." o "filtra, revisa..." dentro de las interfaces finales.
- En flujos administrativos de crear o editar, priorizar modal sobre formulario incrustado cuando eso limpie mejor la lectura de la pantalla principal.
- En formularios, evitar ayudas textuales de relleno bajo toggles, switches o campos cuando el control ya es autoexplicativo. Solo dejar microcopy adicional si resuelve una duda funcional real.
- Los switches deben verse como control directo sobre fondo limpio. No envolver toggles simples dentro de cards o superficies de otro color si eso agrega ruido visual.
- La escala de espaciado del proyecto debe usar secuencias basadas en `8px`, pero la unidad minima de uso general en UI sera `16px`.
- Los valores permitidos de espaciado son `0, 8, 16, 24, 32, 40, 48, 64`. `96` y `128` solo deben usarse en secciones grandes y justificadas.
- En espaciado quedan prohibidos valores arbitrarios como `10px`, `14px`, `18px`, `22px` o `30px`.
- Esta regla aplica a `margin`, `padding`, `gap`, separacion de grid y padding de contenedores.
- En pantallas menores a `512px`, paddings y margenes deben seguir estrictamente la escala y no bajar de `16px` como valor general.
- En homes y secciones principales, el padding superior debe ser de al menos `56px` para no quedar debajo de controles flotantes.
- Los bloques de resumen interno de un modulo deben concentrarse en una sola pieza compacta, idealmente a 3 columnas cuando el contenido lo permita.
- Los bloques de resumen transversales deben resolverse como una grid de `3` columnas. Si hay mas items, deben caer en las filas necesarias manteniendo centrados los items dentro de la card.
- Los bloques de filtros en interfaces deben dejar separacion inferior de `32px` respecto al contenido siguiente.
- Las cards deben iniciar con un `h3` como titulo principal de la pieza. Regla visual actual para cards: `h3` alrededor de `1.2rem`, proporcionado por debajo del `h2` de seccion.
- La accion principal de un modulo administrativo debe presentarse como boton primario lleno, de ancho disponible, y puede incluir icono al inicio cuando ayude a lectura.
- Todo preview de `Home` o `Dashboard` debe vivir en un componente aparte. La regla es mantener el preview junto al dominio del modulo o de la superficie, no incrustado dentro del componente general del home/dashboard.
- En listas administrativas largas para asignar entidades, no usar `select` cuando el volumen vuelva opaca la busqueda. Regla base: usar input de filtrado y lista scrollable con acciones por fila.
- Cuando una fila administrativa combine identidad y acciones, usar esta jerarquia:
  - primera linea: nombre principal y metadato corto alineado a la derecha
  - segunda linea: identificador secundario pequeno
  - tercera linea: acciones de contacto o acceso
  - cuarta linea: estado a la izquierda y menu de acciones a la derecha
- Los modales deben cerrar con icono `X` en la esquina superior derecha con separacion basada en `16px`.
- El boton de cerrar de los modales debe ir en `position: absolute` respecto al modal, con `top: 8px` y `right: 8px`.
- El bloque de titulo del modal debe tener respiracion superior basada en la escala. Regla actual: `16px`.
- En modales, los botones de accion deben alinearse horizontalmente y repartirse segun el ancho disponible del contenedor.
- En modales, el bloque de acciones debe tener separacion superior de `64px` y separacion inferior de `32px`.
- En mobile, las listas verticales de cards deben usar un gap mas amplio; regla actual: `24px`.
- Mapa de densidad responsive:
  - mobile `<640px`: padding de contenedor `16`, gaps `16`, separacion de secciones `24-32`
  - tablet `>=768px`: padding `24`, gaps `24`, secciones `32-48`
  - desktop `>=1024px`: padding `32`, gaps `32`, secciones `48-64`
  - large `>=1440px`: padding `48`, gaps `40-48`, secciones `64-96`
- Heuristicas base:
  - label + input: `8px`
  - entre campos de formulario: `16px`
  - dentro de cards: `16px`
  - entre cards: `16-24px`
  - entre secciones principales: `32-64px`
  - modal: `16px` en mobile pequeno, `24px` en mobile/tablet y `32px` en desktop
- La tipografia del sistema debe tender a esta escala: `12, 14, 16, 20, 24, 32, 40, 48` con line-heights `16, 20, 24, 32, 40, 48, 56, 64` y pesos `400, 500, 600, 700`.
- En tipografia se evitan tamanos `13px`, `15px`, `17px` y pesos `300` o `800+` salvo necesidad justificada.
- Todo `h1`, `h2`, `h3` y `h4` nuevo debe usar tokens oficiales del proyecto. No definir headings nuevos con tamanos quemados.
- Todo icono nuevo en la app debe tomar su tamano desde tokens tipograficos y su contenedor desde tokens de espaciado. No dejar `width`, `height` o `font-size` quemados para iconografia nueva.
- Todo color nuevo en pantallas, componentes o modulos debe salir de tokens del proyecto. No asignar colores quemados en codigo nuevo.
- Los badges por categoria deben construirse solo con tokens semanticos y, si hace falta matiz, con `color-mix(...)` derivado de esos mismos tokens. No inventar colores por valor especifico del dato.
- Los badges de estado deben expresar la semantica del dato con familia de tokens del sistema: `success`, `warning`, `danger`, `info` o neutrales. No usar color solo por decoracion.
- Cuando un estado sea neutro o no confirmado, usar la escala `--ag-gray-*` del sistema en vez de improvisar grises por mezcla si el caso requiere una lectura claramente neutral.
- En grupos de iconos de estado o acciones compactas dentro de una misma fila, todos los iconos deben compartir la misma geometria base: tamano, borde, radio, hover y sombra. Solo debe cambiar el tono semantico.
- Para iconos compactos con significado no obvio, usar tooltip visual del sistema en desktop hover. Evitar `title` nativo del navegador cuando ya exista una capa de tooltip por CSS o componente.
- Los badges o pills informativos que no sean accionables no deben tomar cursor de texto ni parecer enlaces. Sobrescribir su cursor a un estado neutro si hace falta.
- Motion baseline:
  - duraciones permitidas: `150ms`, `200ms`, `250ms`, `300ms`
  - easing recomendado: `ease-out` o `cubic-bezier(0.4, 0, 0.2, 1)`
  - no usar animaciones infinitas en UI critica
  - respetar `prefers-reduced-motion`
- Antes de cerrar cualquier UI, validar:
  - spacing en multiplos de `8`
  - padding y gaps correctos por breakpoint
  - tipografia dentro de la escala acordada
  - motion funcional y no decorativo
  - soporte para `prefers-reduced-motion`
  - que no haya textos redundantes en encabezados
  - que no existan superficies anidadas sin justificacion
  - que menus de acciones cierren al abrir otro, al ejecutar accion y al hacer click fuera

## Front y back al mismo tiempo

- Primero se define el flujo funcional.
- Luego se define el contrato request/response.
- Luego se ajusta base de datos si hace falta.
- Despues se implementa backend.
- Finalmente se conecta frontend.

## Base de datos

- Usar migraciones siempre.
- Crear migraciones pequenas y enfocadas.
- Probar primero en local.
- Aplicar luego en los otros entornos siguiendo el mismo orden.

## Admin Usuarios

Para este modulo el orden acordado es:

1. migracion base de `usuarioSistema`
2. endpoints backend
3. UI admin
4. asignacion usuario-evento
5. mejoras UX como WhatsApp y estados mas completos

## Validacion manual

- Toda entrega funcional debe cerrar con una lista corta de pruebas manuales.
- Las pruebas deben enfocarse en lo minimo que debe verse correcto en la pagina.
- Si hay backend involucrado, incluir al menos:
  - caso feliz
  - caso de validacion
  - caso de error visible
- Si se cambia backend local, reiniciar el proceso antes de validar el flujo en la pagina.
