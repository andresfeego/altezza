import { formatDateInColombia } from '@/components/utils/datetimeColombia';

// Share/SEO covers may contain baked-in copy: never use them as hero backgrounds.
// Only an explicit background or a template-owned decoration belongs behind live text.
export default function HeroImage1Module({ module, evento, invitacion }) {
  return {
    backgroundImage: String(module?.config?.backgroundImage || '').trim(),
    logoImage: String(module?.config?.logoImage || '').trim(),
    text1: String(module?.config?.text1 || '').trim(),
    text2: invitacion?.fechaHoraCeremonia ? formatDateInColombia(invitacion.fechaHoraCeremonia, {
      options: { year: 'numeric', month: 'long', day: 'numeric' }, fallback: '',
    }) : '',
    text3: String(evento?.nombre || invitacion?.nombreEvento || '').trim(),
  };
}
