export const INITIAL_ASSET_WAIT_MS = 3000;

// The first screen and explicitly required animated-scene assets can delay entry.
// Other hidden sections and lazy images must not block the invitation.
export function waitForInitialAssets(root, { timeoutMs = INITIAL_ASSET_WAIT_MS, signal } = {}) {
  return new Promise((resolve) => {
    const cleanups = [];
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanups.forEach((cleanup) => cleanup());
      resolve();
    };
    const timer = setTimeout(finish, timeoutMs);
    cleanups.push(() => clearTimeout(timer));
    if (signal?.aborted) { finish(); return; }
    signal?.addEventListener('abort', finish, { once: true });
    cleanups.push(() => signal?.removeEventListener('abort', finish));

    try {
      const doc = root?.ownerDocument;
      const view = doc?.defaultView;
      const pending = [];
      // The deadline covers fonts AND images, including a stalled decode.
      if (doc?.fonts?.ready) pending.push(Promise.resolve(doc.fonts.ready).catch(() => undefined));

      const images = root ? Array.from(root.querySelectorAll('img')) : [];
      images.filter((img) => {
        if (img.loading === 'lazy' || img.closest('[hidden]')) return false;
        // Moving scenes begin with some required layers outside the viewport;
        // unloaded auto-height artwork can also have a zero-height bounding box.
        if (img.hasAttribute?.('data-invitation-preload')) return true;
        const rect = img.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0
          && rect.top < view.innerHeight && rect.left < view.innerWidth;
      }).forEach((img) => {
        const decode = () => img.naturalWidth > 0 && typeof img.decode === 'function'
          ? img.decode().catch(() => undefined) : undefined;
        // complete is also true for a failed image: its error event has already fired.
        if (img.complete) { pending.push(Promise.resolve().then(decode)); return; }
        pending.push(new Promise((done) => {
          const remove = () => {
            img.removeEventListener('load', loaded);
            img.removeEventListener('error', failed);
          };
          const loaded = () => { remove(); Promise.resolve().then(decode).then(done, done); };
          const failed = () => { remove(); done(); };
          img.addEventListener('load', loaded, { once: true });
          img.addEventListener('error', failed, { once: true });
          cleanups.push(remove);
          if (img.complete) loaded();
        }));
      });
      Promise.all(pending).then(finish, finish);
    } catch (_error) {
      finish();
    }
  });
}
