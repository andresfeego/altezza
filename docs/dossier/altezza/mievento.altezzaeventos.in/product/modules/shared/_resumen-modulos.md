# Resumen de módulos (según menús / roles)

Fuente principal: `components/navigation/menuItems.js` + roles en `components/constants/roles.js`.

> Nota: los íconos muestran tooltip cuando el menú está colapsado (`components/ui/MenuItem.js`). El tooltip por defecto es el `label` del item.

## Roles
- **ADMIN_WEDDING (1)**
- **CLIENTE (2)**
- **ORGANIZADOR (3)**
- **COLABORADOR (4)**

## Módulos por rol

### Admin (ADMIN_WEDDING)
- Home → `/home/admin`
- Eventos → `/admin/eventos`
- Mobiliario → `/admin/mobiliario`
- Alquiler → `/admin/alquiler`
- Cotizador → `/admin/cotizador`
- Frases → `/admin/frases`
- Usuarios → `/admin/usuarios`

### Cliente (CLIENTE)
> Items con `needsEventoId=true` usan `idEventoAsignado` del usuario para construir la URL.

- Feed del evento → `/evento/feed/<idEvento>`
- Datos del evento → `/evento/datos_evento/<idEvento>`
- Calculador de trago → `/evento/calculador_trago/calculador-trago`
- Decoración → `/evento/decoracion/decoracion`
- Fotos compartidas → `/evento/fotos_compartidas/fotos-compartidas`
- Inspiración → `/evento/inspiracion/inspiracion`
- Invitados → `/evento/invitados/invitados`
- Paletas de colores → `/evento/paletas_de_colores/paletas-de-colores`
- Pastel → `/evento/pastel/pastel`
- Pendientes → `/evento/pendientes/pendientes`
- Timming → `/evento/timming/timming`
- Tips de boda → `/evento/tips_boda/tips-boda`
- Wedding day → `/evento/wedding_day/wedding-day`

### Organizador (ORGANIZADOR)
Actualmente apunta a placeholders:
- Organizador → `/url_vacia`
- Agenda → `/url_vacia`
- Pendientes → `/url_vacia`
- Ajustes → `/url_vacia`

### Colaborador (COLABORADOR)
Actualmente apunta a placeholders:
- Colaborador → `/url_vacia`
- Agenda → `/url_vacia`
- Pendientes → `/url_vacia`
- Ajustes → `/url_vacia`
