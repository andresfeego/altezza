import { formatDateInColombia } from '@/components/utils/datetimeColombia';

function getTargetDate(module, invitacion) {
  const target = module?.config?.target === 'fechaHoraRecepcion'
    ? invitacion?.fechaHoraRecepcion
    : invitacion?.fechaHoraCeremonia;

  return target ? new Date(target) : null;
}

export default function CountdownImageModule({ module, invitacion }) {
  const targetDate = getTargetDate(module, invitacion);
  const backgroundImage = String(module?.config?.backgroundImage || '').trim();

  if (!targetDate || !backgroundImage) {
    return null;
  }

  return {
    title: String(module?.config?.title || 'Cuenta regresiva').trim(),
    targetDate: targetDate.toISOString(),
    displayDate: formatDateInColombia(targetDate, {
      options: { year: 'numeric', month: 'long', day: 'numeric' },
    }),
    backgroundImage,
    enableConfetti: module?.config?.enableConfetti !== false,
  };
}
