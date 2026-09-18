export function isPaletteImage(value) {
  if (typeof value !== 'string') return false;
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return /^https?:\/\//i.test(value);
  return /^(?:\/|\.\.?\/)/.test(value) || /\.(?:avif|webp|png|jpe?g|gif|svg)(?:[?#].*)?$/i.test(value);
}

function normalizeCrop(crop) {
  if (!crop || !['x', 'y', 'width', 'height'].every((key) => Number.isFinite(crop[key]))) return undefined;
  const { x, y, width, height } = crop;
  if (x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > 100 || y + height > 100) return undefined;
  return { x, y, width, height };
}

// Preserve legacy color strings. Objects add optional accessible labels and
// percentage crops for images; the original image file is never modified.
export function normalizeDressCodePalette(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      return trimmed && (!trimmed.includes(':') || isPaletteImage(trimmed)) ? [trimmed] : [];
    }
    if (!item || typeof item !== 'object') return [];
    const label = typeof item.label === 'string' ? item.label.trim() : '';
    if (typeof item.imageSrc === 'string' && isPaletteImage(item.imageSrc.trim())) {
      const crop = normalizeCrop(item.crop);
      return [{ imageSrc: item.imageSrc.trim(), label, ...(crop ? { crop } : {}) }];
    }
    const color = typeof item.color === 'string' ? item.color.trim() : '';
    return color && !isPaletteImage(color) && !color.includes(':') ? [{ color, label }] : [];
  });
}

export function describeDressCodeSwatch(item) {
  if (typeof item === 'string') return isPaletteImage(item) ? { imageSrc: item } : { color: item };
  return item;
}
