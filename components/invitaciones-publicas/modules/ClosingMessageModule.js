export default function ClosingMessageModule({ module }) {
  const message = String(module?.config?.message || '').trim();
  const frameImage = String(module?.config?.frameImage || '').trim();

  if (!message || !frameImage) {
    return null;
  }

  return {
    message,
    frameImage,
    frameImageAlt: String(module?.config?.frameImageAlt || 'Marco ornamental').trim(),
  };
}
