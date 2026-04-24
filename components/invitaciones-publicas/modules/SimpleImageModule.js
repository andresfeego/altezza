export default function SimpleImageModule({ module, invitacion, evento }) {
  const imageSrc = String(
    module?.config?.imageSrc || invitacion?.imagenPrincipal || evento?.imagenPrincipal || ''
  ).trim();

  if (!imageSrc) {
    return null;
  }

  return {
    imageSrc,
    alt: String(module?.config?.alt || 'Imagen de la invitacion').trim(),
  };
}
