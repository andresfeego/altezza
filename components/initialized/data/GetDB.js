export async function getDB(endpoint, options = {}) {
    const url = process.env.HOST_NAME + endpoint;
    const method = options.method || 'POST';
  
    const config = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  
    if (method !== 'GET' && method !== 'HEAD' && options.body) {
      config.body = JSON.stringify(options.body);
    }
  
    // Log de inicio de la petición
    console.log(`[getDB] 🌐 Fetching: ${method} ${url}`);
    if (config.body) console.log(`[getDB] 📦 Body:`, config.body);
  
    try {
      const res = await fetch(url, config);
      const contentType = res.headers.get('content-type');
      let responseJson = null;
      let responseText = null;

      if (contentType && contentType.includes('application/json')) {
        responseJson = await res.json();
      } else {
        responseText = await res.text();
      }
  
      // ⚠️ Error HTTP (por ejemplo 500, 404, etc.)
      if (!res.ok) {
        const error = new Error(`[getDB] ❗ HTTP ${res.status} ${res.statusText} → ${url}`);
        error.status = res.status;
        error.data = responseJson;
        error.raw = responseText;
        console.error(error.message, responseJson || responseText || '');
        throw error;
      }

      // ⚠️ Respuesta no es JSON
      if (!responseJson) {
        const msg = `[getDB] ⚠️ Respuesta no-JSON en ${url}\nContenido crudo:\n${responseText}`;
        console.error(msg);
        throw new Error(msg);
      }
  
      // ✅ Todo OK
      return responseJson;
  
    } catch (err) {
      const msg = `[getDB] 🧨 Error general al hacer fetch a ${url} → ${err.message || err}`;
      console.error(msg);
      if (err instanceof Error) {
        err.message = msg;
        throw err;
      }
      throw new Error(msg);
    }
  }
  
