export default function MusicPlayerModule({ module }) {
  const audioSrc = String(module?.config?.audioSrc || '').trim();

  if (!audioSrc) {
    return null;
  }

  return {
    title: String(module?.config?.title || 'Nuestra cancion').trim(),
    trackLabel: String(module?.config?.trackLabel || '').trim(),
    audioSrc,
    autoplay: Boolean(module?.config?.autoplay),
    initiallyMuted: Boolean(module?.config?.initiallyMuted),
  };
}
