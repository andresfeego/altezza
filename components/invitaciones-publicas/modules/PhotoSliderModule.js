export default function PhotoSliderModule({ module, invitacion, evento }) {
  const configImages = Array.isArray(module?.config?.images) ? module.config.images.filter(Boolean) : [];
  const fallbackImages = [invitacion?.imagenPrincipal, evento?.imagenPrincipal].filter(Boolean);
  const images = [...new Set([...configImages, ...fallbackImages])];

  return {
    images,
  };
}
