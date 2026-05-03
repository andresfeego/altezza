export default function AdultsOnlyNoticeModule({ module }) {
  const title = String(module?.config?.title || '').trim();
  const imageSrc = String(module?.config?.imageSrc || '').trim();
  const imageAlt = String(module?.config?.imageAlt || title || 'Evento solo para adultos').trim();
  const text = String(module?.config?.text || '').trim();

  if (!title && !imageSrc && !text) {
    return null;
  }

  return {
    title,
    imageSrc,
    imageAlt,
    text,
  };
}
