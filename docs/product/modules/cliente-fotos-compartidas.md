← Volver al índice: [docs/product/README.md](../README.md)

# 📸 Fotos Compartidas

## Descripción

Módulo que permite centralizar las fotos y videos tomados por los invitados durante el evento. En la primera versión no se usa hashtag: un usuario admin crea álbumes para el evento y cada álbum genera una URL pública abierta con código aleatorio y QR para que los asistentes puedan subir sus recuerdos.

## Funciones

- Crear álbumes desde administración del evento
- Generar URL pública y QR del álbum del evento
- Permitir a invitados subir fotos y videos al álbum del evento
- Pedir opcionalmente el nombre de quien sube archivos
- Mostrar galería pública optimizada con carga progresiva
- Identificar al visitante con cookie anónima de 1 mes para mostrar primero sus archivos

Flujo de uso:

1. El administrador crea un álbum para el evento.
2. El sistema genera un código público no adivinable, la URL abierta del álbum y su QR.
3. El QR se imprime en menús físicos o piezas del evento.
4. Los invitados escanean el QR, ven la galería y suben fotos/videos.
5. Los archivos se suben directo a **Cloudflare R2** con URL firmada y luego se registran en backend.

Estructura R2:

- Bucket separado por ambiente: `dev`, `lab`, `prod`.
- Prefijo por evento y módulo: `{idEvento}/mod_share_gallery/{albumPublicCode}/`.
- Originales: `originals/{mediaPublicCode}.{ext}`.
- Miniaturas: `thumbs/{mediaPublicCode}.webp`.
- Posters de video: `posters/{mediaPublicCode}.webp`.

Reglas del sistema:

- La URL pública es abierta para cualquier persona que tenga el QR.
- El sistema guarda fecha/hora de subida y, cuando el navegador lo permita, metadatos como dimensiones, duración y fecha del archivo.
- La cookie pública `share_gallery_visitor` dura 1 mes y permite identificar los archivos propios sin login.
- No hay moderación/aprobación en v1: los archivos quedan visibles al finalizar la subida.
- Límites iniciales: hasta 50 archivos por lote, fotos de hasta 25 MB y videos de hasta 500 MB.

Visibilidad:

- El sistema genera una **página pública del álbum del evento** donde cualquier invitado puede ver la galería y subir archivos.
- La galería pública muestra primero los archivos del visitante actual cuando existan.
- Después muestra la galería completa con carga progresiva.

Cliente:
Desde el módulo dentro de Altezza el cliente puede:

- visualizar los álbumes del evento
- abrir la URL pública del álbum

Nota técnica: la descarga masiva ZIP queda fuera de esta primera implementación funcional y debe agregarse como mejora posterior si se requiere.
