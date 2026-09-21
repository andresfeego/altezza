# Resumen temporal: módulo Fotos Compartidas

Fecha de levantamiento: 2026-06-12

## Alcance de búsqueda

Se revisaron referencias del módulo en la documentación de producto, dossier, frontend y backend local:

- `docs/product/modules/cliente-fotos-compartidas.md`
- `docs/product/base-desarrollo.md`
- `docs/product/README.md`
- `docs/dossier/altezza/mievento.altezzaeventos.in/product/modules/cliente/cliente_fotos_compartidas.md`
- `docs/dossier/altezza/mievento.altezzaeventos.in/product/modules/shared/_resumen-modulos.md`
- `pages/evento/fotos_compartidas/fotos-compartidas.js`
- `components/constants/clientModules.js`
- `components/eventos/feed/FeedEvento.js`
- `pages/manual/index.js`
- `pages/manual/[...slug].js`
- `/Volumes/02_SSD_1TB/Negocios/Altezza/Web/backend-altezza/server/dbAltezza/general.js`

## Resumen funcional esperado

El módulo **Fotos Compartidas** está pensado para centralizar las fotos tomadas por invitados durante el evento. La propuesta de producto indica que el evento tendrá un hashtag oficial y un QR público para que los asistentes entren a un álbum, suban fotos y compartan recuerdos del evento.

Fuente: `docs/product/modules/cliente-fotos-compartidas.md`.

## Funciones documentadas

- Definir el hashtag oficial del evento.
- Generar un QR del álbum público del evento.
- Permitir que invitados suban fotos al álbum del evento.
- Mostrar una galería de fotos del evento.
- Permitir que el cliente descargue todas las fotos del evento en un ZIP.

Fuente: `docs/product/modules/cliente-fotos-compartidas.md`.

## Flujo documentado

1. Administrador o cliente define el hashtag del evento.
2. El sistema genera el QR del álbum público.
3. El QR puede incluirse en invitaciones o mostrarse durante el evento.
4. Los invitados acceden al álbum público y suben fotos.
5. Las fotos se almacenan en **Cloudflare R2**.

Fuente: `docs/product/modules/cliente-fotos-compartidas.md`.

## Reglas documentadas

- Las fotos deben tener tiempo límite de conservación, con ejemplo de dos semanas.
- Después del tiempo definido, las fotos pueden eliminarse automáticamente.
- Debe existir una página pública del álbum del evento.
- En la página pública solo se permite visualizar fotos.
- No se permite descarga individual desde la página pública.
- La descarga masiva en ZIP solo está disponible dentro del módulo del cliente.

Fuente: `docs/product/modules/cliente-fotos-compartidas.md`.

## Estado actual según dossier

El dossier reconoce el módulo para rol **Cliente**, con label `Fotos compartidas` y ruta `/evento/fotos_compartidas/fotos-compartidas`. Sin embargo, marca el objetivo, datos, reglas de negocio, API, estados y permisos como `TODO`. También indica explícitamente que la pantalla es placeholder y no hay lógica de datos visible en el código actual.

Fuente: `docs/dossier/altezza/mievento.altezzaeventos.in/product/modules/cliente/cliente_fotos_compartidas.md`.

## Estado actual según roadmap/base de desarrollo

El módulo aparece en la **Fase 6: Contenido complementario del cliente**, después de `Inspiración` y antes de `Paletas Colores`. La razón indicada es que este grupo tiene bajo acoplamiento con el núcleo transaccional.

En la sección de estado por módulo se indica:

- Código actual: placeholder `Hola mundo`.
- Acción requerida: construir galería, carga y visualización compartida.

Fuente: `docs/product/base-desarrollo.md`.

## Estado actual en frontend

La página real del módulo existe en `pages/evento/fotos_compartidas/fotos-compartidas.js`, pero solo renderiza `Hola mundo`.

Fuente: `pages/evento/fotos_compartidas/fotos-compartidas.js`.

El catálogo de módulos del cliente registra:

- `key`: `fotos_compartidas`
- `label`: `Fotos compartidas`
- `url`: `/evento/fotos_compartidas/fotos-compartidas`

Fuente: `components/constants/clientModules.js`.

El feed del evento tiene copy de preview para este módulo: “Consulta la galeria compartida del evento cuando este modulo haga parte de la experiencia activa.”

Fuente: `components/eventos/feed/FeedEvento.js`.

La documentación manual lo lista como módulo cliente con enlace `/manual/modules/cliente-fotos-compartidas`.

Fuentes: `pages/manual/index.js`, `pages/manual/[...slug].js`, `docs/product/README.md`.

## Estado actual en backend

El backend registra `fotos_compartidas` dentro del catálogo de módulos cliente como módulo no requerido:

- `key`: `fotos_compartidas`
- `label`: `Fotos compartidas`
- `required`: `false`

Fuente: `/Volumes/02_SSD_1TB/Negocios/Altezza/Web/backend-altezza/server/dbAltezza/general.js`.

No se encontró implementación backend específica para álbum, carga de fotos, Cloudflare R2, ZIP, expiración, hashtag o QR del módulo. La única referencia backend encontrada es su presencia en el catálogo de módulos configurables.

Fuente: búsqueda global en `/Volumes/02_SSD_1TB/Negocios/Altezza/Web/backend-altezza`.

## Brechas identificadas

- Falta contrato de datos del módulo: evento, álbum, fotos, autor/invitado, fechas, visibilidad, expiración y estado.
- Falta API backend para crear/configurar álbum, listar fotos, subir fotos, generar ZIP y aplicar expiración.
- Falta integración con almacenamiento externo; producto menciona Cloudflare R2, pero no hay implementación visible.
- Falta página pública del álbum.
- Falta generación o persistencia de QR.
- Falta UI cliente para galería, carga, estado vacío, descarga ZIP y reglas de visibilidad.
- Falta separar permisos: invitado público solo visualiza/sube según regla definida; cliente puede descargar ZIP.

## Conclusión operativa

Fotos Compartidas está definido a nivel de intención de producto y registrado en navegación/configuración de módulos, pero no está implementado funcionalmente. El estado real es placeholder en frontend y catálogo configurable en backend. Para construirlo sin inventar contratos, el siguiente paso debería ser definir primero el contrato mínimo de datos y endpoints, especialmente porque el producto ya fija decisiones relevantes: álbum público, QR, subida por invitados, almacenamiento en Cloudflare R2, expiración y descarga ZIP solo para cliente.
