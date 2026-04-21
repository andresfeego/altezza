function normalizeColorList(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}

export default function DressCodeModule({ module }) {
  const attireLabel = String(module?.config?.attireLabel || '').trim();
  const imageSrc = String(module?.config?.imageSrc || '').trim();
  const imageAlt = String(module?.config?.imageAlt || 'Referencia de dress code').trim();
  const suggestedColors = normalizeColorList(module?.config?.suggestedColors);
  const avoidedColors = normalizeColorList(module?.config?.avoidedColors);

  if (!attireLabel && !imageSrc && !suggestedColors.length && !avoidedColors.length) {
    return null;
  }

  return {
    attireLabel,
    imageSrc,
    imageAlt,
    suggestedColors,
    avoidedColors,
  };
}
