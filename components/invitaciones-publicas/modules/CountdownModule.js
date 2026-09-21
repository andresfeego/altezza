function getTargetDate(module, invitacion) {
  const target = module?.config?.target === 'fechaHoraRecepcion'
    ? invitacion?.fechaHoraRecepcion
    : invitacion?.fechaHoraCeremonia;

  const parsed = target ? new Date(target) : null;
  return parsed && Number.isFinite(parsed.getTime()) ? parsed : null;
}

export default function CountdownModule({ module, invitacion }) {
  const targetDate = getTargetDate(module, invitacion);
  const targetDateIso = targetDate ? targetDate.toISOString() : null;

  return {
    message: String(module?.config?.message || '').trim(),
    completedMessage: String(module?.config?.completedMessage || '').trim(),
    title: String(module?.config?.title || '').trim(),
    showDate: module?.config?.showDate === true,
    completed: false,
    targetDate: targetDateIso,
    items: [
      { label: 'Dias', value: 0 },
      { label: 'Horas', value: 0 },
      { label: 'Minutos', value: 0 },
      { label: 'Segundos', value: 0 },
    ],
  };
}
