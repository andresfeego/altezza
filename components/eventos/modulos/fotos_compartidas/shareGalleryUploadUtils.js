export const SHARE_GALLERY_MAX_FILES = 50;
export const SHARE_GALLERY_PHOTO_MAX_BYTES = 25 * 1024 * 1024;
export const SHARE_GALLERY_VIDEO_MAX_BYTES = 500 * 1024 * 1024;

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm']);

export function getMediaType(file) {
  if (IMAGE_TYPES.has(file.type)) return 'image';
  if (VIDEO_TYPES.has(file.type)) return 'video';
  return 'unknown';
}

export function validateFiles(files) {
  if (!files.length) return 'Selecciona al menos un archivo.';
  if (files.length > SHARE_GALLERY_MAX_FILES) return `Solo puedes subir ${SHARE_GALLERY_MAX_FILES} archivos por lote.`;

  for (const file of files) {
    const mediaType = getMediaType(file);
    if (mediaType === 'unknown') return `${file.name} no es un tipo permitido.`;
    const maxBytes = mediaType === 'image' ? SHARE_GALLERY_PHOTO_MAX_BYTES : SHARE_GALLERY_VIDEO_MAX_BYTES;
    if (file.size > maxBytes) {
      return mediaType === 'image'
        ? `${file.name} supera el limite de 25 MB para fotos.`
        : `${file.name} supera el limite de 500 MB para videos.`;
    }
  }

  return '';
}

export function fileToSignPayload(file) {
  return {
    originalFilename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    mediaType: getMediaType(file),
  };
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No fue posible leer la imagen.'));
    };
    img.src = url;
  });
}

function canvasToWebp(canvas, quality = 0.76) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/webp', quality);
  });
}

export async function getImageMetadata(file) {
  const img = await loadImageFromFile(file);
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
    fileLastModifiedAt: file.lastModified ? new Date(file.lastModified).toISOString() : null,
  };
}

export async function createImageThumb(file, maxSize = 720) {
  const img = await loadImageFromFile(file);
  const ratio = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvasToWebp(canvas);
}

export function getVideoMetadata(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadedmetadata = () => {
      const metadata = {
        width: video.videoWidth || null,
        height: video.videoHeight || null,
        durationSeconds: Number.isFinite(video.duration) ? video.duration : null,
        fileLastModifiedAt: file.lastModified ? new Date(file.lastModified).toISOString() : null,
      };
      cleanup();
      resolve(metadata);
    };

    video.onerror = () => {
      cleanup();
      resolve({
        fileLastModifiedAt: file.lastModified ? new Date(file.lastModified).toISOString() : null,
      });
    };

    video.src = url;
  });
}

export async function createVideoPoster(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadeddata = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(1, 720 / Math.max(video.videoWidth || 1, video.videoHeight || 1));
        canvas.width = Math.max(1, Math.round((video.videoWidth || 1) * ratio));
        canvas.height = Math.max(1, Math.round((video.videoHeight || 1) * ratio));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await canvasToWebp(canvas);
        cleanup();
        resolve(blob);
      } catch (error) {
        cleanup();
        resolve(null);
      }
    };

    video.onerror = () => {
      cleanup();
      resolve(null);
    };

    video.src = url;
  });
}
