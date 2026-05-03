import { formatDateInColombia } from '@/components/utils/datetimeColombia';

export default function HeroImage1ClassicModule({ module, evento, invitacion }) {
  const backgroundImage = String(
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
    ? formatDateInColombia(invitacion.fechaHoraCeremonia, {
      options: { year: 'numeric', month: 'long', day: 'numeric' },
      fallback: '',
    })
    : '';

  return {
    backgroundImage,
    logoImage,
    text1: String(module?.config?.text1 || '').trim(),
    text2: eventDate,
    text3: String(evento?.nombre || invitacion?.nombreEvento || '').trim(),
  };
}
