import terracotaHeroBackgroundAsset from '../templates/wedding-terracota/assets/images/fondo_hero.png';

const TERRACOTA_HERO_BACKGROUND = (
  typeof terracotaHeroBackgroundAsset === 'string'
    ? terracotaHeroBackgroundAsset
    : terracotaHeroBackgroundAsset?.src || ''
);

export default function HeroImage1Module({ module, evento, invitacion }) {
  const isTerracotaTemplate = String(evento?.templateKey || '').trim() === 'wedding_terracota';
  const backgroundImage = String(
    (isTerracotaTemplate ? TERRACOTA_HERO_BACKGROUND : '') ||
      module?.config?.backgroundImage ||
      evento?.seo?.image ||
      evento?.imagenPrincipal ||
      invitacion?.imagenPrincipal ||
      ''
  ).trim();
  const logoImage = String(module?.config?.logoImage || '').trim();

  if (!backgroundImage) {
    return null;
  }

  const eventDate = invitacion?.fechaHoraCeremonia
    ? new Date(invitacion.fechaHoraCeremonia).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return {
    backgroundImage,
    logoImage,
    text1: String(module?.config?.text1 || '').trim(),
    text2: eventDate,
    text3: String(evento?.nombre || invitacion?.nombreEvento || '').trim(),
  };
}
