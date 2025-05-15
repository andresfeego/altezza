export async function setDB(endpoint, data = {}, options = {}) {
  const url = process.env.HOST_NAME + endpoint;

  const isFormData = data instanceof FormData;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: isFormData
        ? { 'Accept': 'application/json', ...options.headers }
        : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
          },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!res.ok) {
      const raw = await res.text();
      console.error(`[setDB] ❌ Error HTTP ${res.status} en ${endpoint} → ${raw}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`[setDB] 🧨 Fallo al hacer fetch a ${url}:`, error);
    return null;
  }
}
