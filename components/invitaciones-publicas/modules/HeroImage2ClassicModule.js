export default function HeroImage2ClassicModule({ module, evento, invitacion }) {
  const backgroundImage = String(
    module?.config?.backgroundImage ||
      evento?.seo?.image ||
      evento?.imagenPrincipal ||
      invitacion?.imagenPrincipal ||
      ''
  ).trim();

  if (!backgroundImage) {
    return null;
  }

  return {
    backgroundImage,
    logoImage: String(module?.config?.logoImage || '').trim(),
    imageSrc: String(module?.config?.imageSrc || '').trim(),
    imageAlt: String(module?.config?.imageAlt || 'Imagen principal de la invitacion').trim(),
    coupleNames: String(
      module?.config?.coupleNames ||
      evento?.nombre ||
      invitacion?.nombreEvento ||
      ''
    ).trim(),
  };
}
