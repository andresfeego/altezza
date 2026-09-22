// A resource is ready only after successful preparation. A deadline is an error,
// never permission to show partially loaded content.
export const MEDIA_PREPARATION_TIMEOUT_MS = 90000;

function aborted(signal) {
  if (signal?.aborted) throw signal.reason || new DOMException('Cancelled', 'AbortError');
}

export function withAbort(promise, signal) {
  return new Promise((resolve, reject) => {
    const cancel = () => { cleanup(); reject(signal.reason || new DOMException('Cancelled', 'AbortError')); };
    const cleanup = () => signal?.removeEventListener('abort', cancel);
    if (signal?.aborted) { cancel(); return; }
    signal?.addEventListener('abort', cancel, { once: true });
    Promise.resolve(promise).then((value) => { cleanup(); resolve(value); }, (error) => { cleanup(); reject(error); });
  });
}

export function waitForImage(image, signal) {
  aborted(signal);
  return withAbort(new Promise((resolve, reject) => {
    let decoding = false;
    const cleanup = () => {
      image.removeEventListener('load', loaded);
      image.removeEventListener('error', failed);
      signal?.removeEventListener('abort', cleanup);
    };
    const failed = () => { cleanup(); reject(new Error(`No se pudo cargar la imagen: ${image.currentSrc || image.src}`)); };
    const loaded = () => {
      if (decoding) return;
      if (!image.naturalWidth) { failed(); return; }
      decoding = true;
      cleanup();
      Promise.resolve().then(() => typeof image.decode === 'function' ? image.decode() : undefined).then(resolve, reject);
    };
    image.addEventListener('load', loaded);
    image.addEventListener('error', failed);
    signal?.addEventListener('abort', cleanup, { once: true });
    if (image.complete) loaded();
  }), signal);
}

export function waitForMediaData(element, signal) {
  aborted(signal);
  return withAbort(new Promise((resolve, reject) => {
    const cleanup = () => {
      for (const event of ['loadeddata', 'canplay']) element.removeEventListener(event, check);
      element.removeEventListener('error', failed);
      signal?.removeEventListener('abort', cleanup);
    };
    const failed = () => { cleanup(); reject(new Error(`No se pudo preparar ${element.tagName.toLowerCase()}.`)); };
    const check = () => {
      if (element.error) failed();
      else if (element.readyState >= 2) { cleanup(); resolve(); }
    };
    for (const event of ['loadeddata', 'canplay']) element.addEventListener(event, check);
    element.addEventListener('error', failed);
    signal?.addEventListener('abort', cleanup, { once: true });
    element.preload = 'auto';
    check();
  }), signal);
}

export async function prepareInvitationMedia(manifest, { view = window, signal, onProgress = () => {}, concurrency = 4 } = {}) {
  aborted(signal);
  const controller = new AbortController();
  const forwardAbort = () => controller.abort(signal.reason);
  signal?.addEventListener('abort', forwardAbort, { once: true });
  const taskSignal = controller.signal;
  const blobs = {};
  const images = [];
  const resources = [...new Map(manifest.map((item) => [`${item.kind}:${item.src}`, item])).values()];
  let cursor = 0;
  let completed = 0;
  const dispose = () => { Object.values(blobs).forEach((src) => view.URL.revokeObjectURL(src)); images.length = 0; };
  const worker = async () => {
    while (cursor < resources.length) {
      aborted(taskSignal);
      const item = resources[cursor++];
      if (item.kind === 'image') {
        const image = new view.Image();
        images.push(image); // Retain decoded resources until the invitation unmounts.
        image.src = item.src;
        await waitForImage(image, taskSignal);
      } else {
        const response = await view.fetch(item.src, { signal: taskSignal });
        if (!response.ok) throw new Error(`No se pudo descargar ${item.kind}: HTTP ${response.status}`);
        const blob = await response.blob();
        aborted(taskSignal);
        if (!blob.size) throw new Error('El archivo multimedia está vacío.');
        blobs[item.src] = view.URL.createObjectURL(blob);
      }
      aborted(taskSignal);
      onProgress({ completed: ++completed, total: resources.length });
    }
  };
  const workers = Array.from({ length: Math.min(concurrency, resources.length) }, worker);
  try {
    await Promise.all(workers);
    return { blobs, images, dispose };
  } catch (error) {
    controller.abort(error);
    await Promise.allSettled(workers);
    dispose();
    throw error;
  } finally { signal?.removeEventListener('abort', forwardAbort); }
}

export async function waitForMountedMedia(root, { signal, view = window } = {}) {
  const images = [...root.querySelectorAll('img')].filter((image) => image.getAttribute('src') || image.currentSrc);
  for (const image of images) image.loading = 'eager';
  await Promise.all([
    ...images.map((image) => waitForImage(image, signal)),
    ...[...root.querySelectorAll('video[src], audio[src]')].map((element) => waitForMediaData(element, signal)),
  ]);
  // Let React's loadeddata handlers and the decoded media reach a paint before
  // removing the opaque loading layer.
  await withAbort(new Promise((resolve) => view.requestAnimationFrame(() => view.requestAnimationFrame(resolve))), signal);
}
