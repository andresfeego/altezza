export default function ClosingMessageModule({ module }) {
  const message = String(module?.config?.message || '').trim();
  const frameImage = String(module?.config?.frameImage || '').trim();

  if (!message) {
    return null;
  }

  return {
    message,
    imageSrc: String(module?.config?.imageSrc || '').trim(),
    imageAlt: String(module?.config?.imageAlt || '').trim(),
    frameImage,
    showFrame: module?.config?.showFrame !== false,
    frameImageAlt: String(module?.config?.frameImageAlt || 'Marco ornamental').trim(),
  };
}
