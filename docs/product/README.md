# Altezza (MiEvento) — Documentación de producto (LAB)

> **Fuente canónica de este documento:** `uploads/andres/inbox/2026-03-07T00-05-16-051Z__altezza_modulos_panel.md` (panel de diseño de módulos).
>
> Objetivo: describir **módulos, roles, flujos y comportamientos del sistema** tal como están definidos en ese archivo.
>
> Regla: aquí no se inventa funcionalidad. Si algo no está explícito en la fuente, se marca como **[POR DEFINIR]**.

---

## Roles

- **ADMIN**: administra el sistema, crea eventos, gestiona usuarios, proveedores, mobiliario, alquileres, cotizaciones, frases, etc. Además puede entrar a cualquier evento en “modo admin”.
- **CLIENTE**: dueño(s) del evento. Accede a un evento asignado y ve únicamente los módulos habilitados por el admin para ese evento.
- **ORGANIZADOR (propuesto)**: organizadores externos que usan el sistema para alquiler de mobiliario propio de Altezza.
- **COLABORADOR (propuesto)**: personal operativo de campo para checklists y agenda del día del evento.

---

## Módulos por rol

### ADMIN
- 🏠 Admin Home → `modules/admin-home.md`
- 🎉 Admin Eventos → `modules/admin-eventos.md`
- 🎨 Decoración (solo admin dentro de evento) → `modules/admin-decoracion.md`
- 🪑 Admin Mobiliario → `modules/admin-mobiliario.md`
- 📦 Admin Alquiler → `modules/admin-alquiler.md`
- 💰 Admin Cotizador → `modules/admin-cotizador.md`
- 🧑‍🍳 Admin Proveedores → `modules/admin-proveedores.md`
- 💬 Admin Frases → `modules/admin-frases.md`
- 👤 Admin Usuarios → `modules/admin-usuarios.md`

### CLIENTE
- 📰 Feed Evento → `modules/cliente-feed-evento.md`
- 📋 Datos Evento → `modules/cliente-datos-evento.md`
- 🍹 Calculador Trago → `modules/cliente-calculador-trago.md`
- 📸 Fotos Compartidas → `modules/cliente-fotos-compartidas.md`
- 💡 Inspiración → `modules/cliente-inspiracion.md`
- 👥 Invitados → `modules/cliente-invitados.md`
- 💌 Invitaciones → `modules/cliente-invitaciones.md`
- 🪑 Acomodación → `modules/cliente-acomodacion.md`
- 🎨 Paletas Colores → `modules/cliente-paletas-colores.md`
- 🎂 Pastel → `modules/cliente-pastel.md`
- ✅ Pendientes → `modules/cliente-pendientes.md`
- ⏱️ Timming → `modules/cliente-timming.md`
- 💍 Tips Boda → `modules/cliente-tips-boda.md`
- 📅 Wedding Day → `modules/cliente-wedding-day.md`

### ORGANIZADOR (PROPUESTO)
- 📊 Organizador Dashboard → `modules/organizador-dashboard.md`
- 🪑 Organizador Alquiler Mobiliario → `modules/organizador-alquiler-mobiliario.md`

### COLABORADOR (PROPUESTO)
- 📊 Colaborador Dashboard → `modules/colaborador-dashboard.md`
- 🧰 Colaborador Checklist Montaje → `modules/colaborador-checklist-montaje.md`
- 📦 Colaborador Checklist Recogida → `modules/colaborador-checklist-recogida.md`
- 🗓️ Colaborador Agenda → `modules/colaborador-agenda.md`

---

## Comportamientos del sistema

- Acceso del administrador a eventos → `system/comportamientos.md#1-acceso-del-administrador-a-eventos`
- Asignación de usuarios a eventos → `system/comportamientos.md#2-asignación-de-usuarios-a-eventos`
- Acceso del usuario después del login (rol Cliente) → `system/comportamientos.md#3-acceso-del-usuario-después-del-login`
- Sincronización en tiempo real de módulos operativos → `system/comportamientos.md#4-sincronización-en-tiempo-real-de-módulos-operativos`

---

## Funcionalidad opcional

- Event Mode → `system/event-mode.md`
