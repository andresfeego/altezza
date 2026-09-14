import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';

const API_BASE = process.env.HOST_NAME;

function adminHeaders() {
  const user = useUsuarioStore.getState?.()?.dataUsuario || {};
  return {
    'x-altezza-user-id': String(user.id || ''),
    'x-altezza-user-role': String(user.rol || ''),
  };
}

async function request(endpoint, { method = 'GET', body, publicRequest = false } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(publicRequest ? {} : adminHeaders()),
    },
    ...(body === undefined ? {} : { body: isFormData ? body : JSON.stringify(body) }),
  });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const error = new Error(payload?.message || `Error HTTP ${response.status}`);
    error.status = response.status;
    error.data = payload;
    throw error;
  }
  return payload;
}

export const listMobiliarioCategories = () => request('/mobiliario/categorias');
export const createMobiliarioCategory = (body) => request('/mobiliario/categorias', { method: 'POST', body });
export const updateMobiliarioCategory = (id, body) => request(`/mobiliario/categorias/${id}`, { method: 'PUT', body });
export const deleteMobiliarioCategory = (id) => request(`/mobiliario/categorias/${id}`, { method: 'DELETE' });
export const reorderMobiliarioCategories = (ids) => request('/mobiliario/categorias/orden', { method: 'PUT', body: { ids } });

export function listMobiliarioProducts(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  return request(`/mobiliario/productos?${params.toString()}`);
}

export const getMobiliarioProduct = (id) => request(`/mobiliario/productos/${id}`);
export function createMobiliarioProduct(values) {
  const body = new FormData();
  body.append('nombre', values.nombre || '');
  body.append('categoriaId', String(values.categoriaId || ''));
  body.append('color', values.color || '');
  body.append('imagenProducto', values.imagenProducto);
  body.append('imagenDecoracion', values.imagenDecoracion);
  return request('/mobiliario/productos', { method: 'POST', body });
}
export const updateMobiliarioProduct = (id, body) => request(`/mobiliario/productos/${id}`, { method: 'PUT', body });
export const setMobiliarioProductState = (id, estado) => request(`/mobiliario/productos/${id}/estado`, { method: 'PATCH', body: { estado } });
export const createMobiliarioVariant = (productId, body) => request(`/mobiliario/productos/${productId}/variantes`, { method: 'POST', body });
export const updateMobiliarioVariant = (productId, variantId, body) => request(`/mobiliario/productos/${productId}/variantes/${variantId}`, { method: 'PUT', body });
export const setMobiliarioVariantState = (productId, variantId, activo) => request(`/mobiliario/productos/${productId}/variantes/${variantId}/estado`, { method: 'PATCH', body: { activo } });
export const listMobiliarioMovements = (variantId) => request(`/mobiliario/variantes/${variantId}/movimientos`);
export const createMobiliarioMovement = (variantId, body) => request(`/mobiliario/variantes/${variantId}/movimientos`, { method: 'POST', body });

export function replaceMobiliarioImage(productId, tipo, file) {
  const body = new FormData();
  body.append('imagen', file);
  return request(`/mobiliario/productos/${productId}/imagenes/${tipo}`, { method: 'PUT', body });
}
export const getMobiliarioCatalogConfig = () => request('/mobiliario/catalogo-publico');
export const generateMobiliarioCatalog = () => request('/mobiliario/catalogo-publico/generar', { method: 'POST', body: {} });
export const setMobiliarioCatalogState = (activo) => request('/mobiliario/catalogo-publico/estado', { method: 'PATCH', body: { activo } });
export const regenerateMobiliarioCatalog = () => request('/mobiliario/catalogo-publico/regenerar', { method: 'POST', body: {} });
export const getPublicMobiliarioCatalog = (publicCode) => request(`/public/mobiliario/catalogo/${encodeURIComponent(publicCode)}`, { publicRequest: true });

export const updateMobiliarioCatalogStyle = (body) => request('/mobiliario/catalogo-publico/estilo', { method: 'PATCH', body });

export const getMobiliarioProductOrder = (categoryId) => request(`/mobiliario/categorias/${categoryId}/productos/orden`);
export const saveMobiliarioProductOrder = (categoryId, ids) => request(`/mobiliario/categorias/${categoryId}/productos/orden`, { method: 'PUT', body: { ids } });
