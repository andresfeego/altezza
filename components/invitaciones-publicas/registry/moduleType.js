// Compatibility for saved cards created before the neutral slider name.
export function normalizeModuleType(value) {
  const type = String(value || '').trim();
  return type === 'image_slider_sepia' ? 'image_slider_1' : type;
}
