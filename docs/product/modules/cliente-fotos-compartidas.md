← Volver al índice: [docs/product/README.md](../README.md)

# 📸 Fotos Compartidas

Descripción:
Módulo que permite centralizar las fotos tomadas por los invitados durante el evento. El sistema utiliza un **hashtag del evento y un QR público** para que los asistentes puedan subir sus fotos fácilmente y compartir los recuerdos del evento.

Funciones:

- Definir hashtag oficial del evento
- Generar QR del álbum del evento
- Permitir a invitados subir fotos al álbum del evento
- Mostrar galería de fotos del evento
- Permitir al cliente descargar todas las fotos del evento en un solo archivo ZIP

Flujo de uso:

1. El administrador o cliente define el **hashtag del evento**.
2. El sistema genera un **QR del álbum público del evento**.
3. El QR puede incluirse en invitaciones o mostrarse durante el evento.
4. Los invitados acceden al álbum público y pueden subir fotos.
5. Las fotos se almacenan en **Cloudflare R2**.

Reglas del sistema:

- Las fotos se almacenan con **tiempo límite de conservación** (por ejemplo 2 semanas).
- Después del tiempo definido las fotos pueden eliminarse automáticamente.

Visibilidad:

- El sistema genera una **página pública del álbum del evento** donde cualquier invitado puede ver las fotos.
- En la página pública **solo se permite visualizar las fotos**.
- **No se permite descarga individual** de imágenes desde la página pública.

Cliente:
Desde el módulo dentro de Altezza el cliente puede:

- visualizar el álbum
- descargar **todas las fotos del evento en un solo paquete ZIP**.

La descarga masiva **solo está disponible dentro del módulo del cliente** y no en la página pública del álbum.
