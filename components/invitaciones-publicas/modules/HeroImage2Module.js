import terracotaHeroBackgroundAsset from '../templates/wedding-terracota/assets/images/fondo_hero.webp';

const TERRACOTA_HERO_BACKGROUND = (
  typeof terracotaHeroBackgroundAsset === 'string'
    ? terracotaHeroBackgroundAsset
    : terracotaHeroBackgroundAsset?.src || ''
);

export default function HeroImage2Module({ module, evento, invitacion }) {
  const isTerracotaTemplate = String(evento?.templateKey || '').trim() === 'wedding_terracota';
  const backgroundImage = String(
    (isTerracotaTemplate ? TERRACOTA_HERO_BACKGROUND : '') ||
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
