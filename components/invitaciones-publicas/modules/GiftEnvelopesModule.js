export default function GiftEnvelopesModule({ module }) {
  const imageSrc = String(module?.config?.imageSrc || '').trim();

  if (!imageSrc) {
    return null;
  }

  return {
    imageSrc,
    imageAlt: String(module?.config?.imageAlt || 'Lluvia de sobres').trim(),
    leadText: String(module?.config?.leadText || '').trim(),
  };
}
