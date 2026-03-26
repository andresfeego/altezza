export async function setDB(endpoint, data = {}, options = {}) {
  const url = process.env.HOST_NAME + endpoint;

  const isFormData = data instanceof FormData;
  const method = options.method || 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: isFormData
        ? { 'Accept': 'application/json', ...options.headers }
        : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    const contentType = res.headers.get('content-type');
    let responseJson = null;
    let responseText = null;

    if (contentType && contentType.includes('application/json')) {
      responseJson = await res.json();
    } else {
      responseText = await res.text();
    }

    if (!res.ok) {
      const error = new Error(`[setDB] ❌ Error HTTP ${res.status} en ${endpoint}`);
      error.status = res.status;
      error.data = responseJson;
      error.raw = responseText;
      console.error(error.message, responseJson || responseText || '');
      throw error;
    }

    if (!responseJson) {
      const msg = `[setDB] ⚠️ Respuesta no-JSON en ${endpoint}\nContenido crudo:\n${responseText}`;
      console.error(msg);
      throw new Error(msg);
    }

    return responseJson;
  } catch (error) {
    console.error(`[setDB] 🧨 Fallo al hacer fetch a ${url}:`, error);
    throw error;
  }
}
