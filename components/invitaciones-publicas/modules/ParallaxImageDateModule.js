function getTargetDate(module, invitacion) {
  const target = module?.config?.target === 'fechaHoraRecepcion'
    ? invitacion?.fechaHoraRecepcion
    : invitacion?.fechaHoraCeremonia;

  return target ? new Date(target) : null;
}

function buildDatePairs(dateValue) {
  const date = dateValue ? new Date(dateValue) : null;
  if (!date) return [];

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return [day, month, year].map((pair) => pair.split(''));
}

export default function ParallaxImageDateModule({ module, invitacion }) {
  const targetDate = getTargetDate(module, invitacion);
  const backgroundImage = String(module?.config?.backgroundImage || '').trim();

  if (!targetDate || !backgroundImage) {
    return null;
  }

  return {
    backgroundImage,
    datePairs: buildDatePairs(targetDate.toISOString()),
  };
}
