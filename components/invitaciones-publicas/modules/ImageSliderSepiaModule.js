function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function pickNumber(source, keys, fallback) {
  for (const key of keys) {
    if (source?.[key] === undefined || source?.[key] === null) continue;
    const parsed = Number(source[key]);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeAdjustments(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.entries(value).reduce((acc, [key, settings]) => {
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return acc;

    const rawPositionX = pickNumber(settings, ['positionX', 'positionx', 'x'], 50);
    const rawPositionY = pickNumber(settings, ['positionY', 'positiony', 'y'], 50);
    const rawZoom = pickNumber(settings, ['zoom', 'scale', 'z'], 1);

    acc[String(key)] = {
      positionX: clampNumber(rawPositionX, 0, 100, 50),
      positionY: clampNumber(rawPositionY, 0, 100, 50),
      zoom: clampNumber(rawZoom, 0.5, 2.5, 1),
    };
    return acc;
  }, {});
}

export default function ImageSliderSepiaModule({ module }) {
  const configImages = Array.isArray(module?.config?.images) ? module.config.images.filter(Boolean) : [];
  const images = [...new Set(configImages)];

  if (!images.length) {
    return null;
  }

  return {
    images,
    intervalMs: Number(module?.config?.intervalMs) > 0 ? Number(module.config.intervalMs) : 2000,
    title: String(module?.config?.title || '').trim(),
    imageAdjustments: normalizeAdjustments(module?.config?.imageAdjustments),
  };
}
