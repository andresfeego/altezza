export default function ClosingMessageModule({ module }) {
  const message = String(module?.config?.message || '').trim();
  const frameImage = String(module?.config?.frameImage || '').trim();

  if (!message) {
    return null;
  }

  return {
    message,
    frameImage,
    showFrame: module?.config?.showFrame !== false,
    frameImageAlt: String(module?.config?.frameImageAlt || 'Marco ornamental').trim(),
  };
}
