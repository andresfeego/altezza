import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';

const API_BASE = process.env.HOST_NAME;

function getAdminHeaders() {
  const state = useUsuarioStore.getState?.() || {};
  const dataUsuario = state.dataUsuario || {};

  return {
    'x-altezza-user-id': String(dataUsuario?.id || ''),
    'x-altezza-user-role': String(dataUsuario?.rol || ''),
  };
}

async function requestJson(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'same-origin',
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(payload?.message || `Error HTTP ${response.status}`);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
}

export function getShareGalleryAlbums(idEvento) {
  return requestJson(`/eventos/${idEvento}/fotos-compartidas/albums`);
}

export function createShareGalleryAlbum(idEvento, payload) {
  return requestJson(`/eventos/${idEvento}/fotos-compartidas/albums`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(payload),
  });
}

export function getPublicShareGallery(albumPublicCode, { page = 1, pageSize = 24 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return requestJson(`/public/share-gallery/${albumPublicCode}?${params.toString()}`);
}

export function signPublicShareGalleryUploads(albumPublicCode, payload) {
  return requestJson(`/public/share-gallery/${albumPublicCode}/uploads/sign`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function finalizePublicShareGalleryUploads(albumPublicCode, payload) {
  return requestJson(`/public/share-gallery/${albumPublicCode}/uploads/finalize`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function signAdminShareGalleryUploads({ idEvento, albumId, payload }) {
  return requestJson(`/eventos/${idEvento}/fotos-compartidas/albums/${albumId}/uploads/sign`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(payload),
  });
}

export function finalizeAdminShareGalleryUploads({ idEvento, albumId, payload }) {
  return requestJson(`/eventos/${idEvento}/fotos-compartidas/albums/${albumId}/uploads/finalize`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function putSignedFile(uploadTarget, blob) {
  const response = await fetch(uploadTarget.signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': uploadTarget.contentType,
    },
    body: blob,
  });

  if (!response.ok) {
    throw new Error(`No fue posible subir archivo a R2 (${response.status}).`);
  }
}
