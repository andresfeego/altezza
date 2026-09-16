export default function HeroImage2Module({ module, evento, invitacion }) {
  const backgroundImage = String(module?.config?.backgroundImage || '').trim();

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
