// Names are invitation content; no template or event-title text is injected.
export default function CoupleNamesModule({ module }) {
  const config = module?.config || {};
  const brideName = typeof config.brideName === 'string' ? config.brideName.trim() : '';
  const groomName = typeof config.groomName === 'string' ? config.groomName.trim() : '';
  if (!brideName && !groomName) return null;
  return { brideName, groomName };
}
