export default function GiftEnvelopesModule({ module }) {
  const imageSrc = String(module?.config?.imageSrc || '').trim();

  if (!imageSrc) {
    return null;
  }

  return {
    title: String(module?.config?.title || '').trim(),
    imageSrc,
    imageAlt: String(module?.config?.imageAlt || 'Lluvia de sobres').trim(),
    leadText: String(module?.config?.leadText || '').trim(),
  };
}
