function getTargetDate(module, invitacion) {
  const target = module?.config?.target === 'fechaHoraRecepcion'
    ? invitacion?.fechaHoraRecepcion
    : invitacion?.fechaHoraCeremonia;

  return target ? new Date(target) : null;
}

export default function CountdownModule({ module, invitacion }) {
  const targetDate = getTargetDate(module, invitacion);
  const targetDateIso = targetDate ? targetDate.toISOString() : null;

  return {
    title: String(module?.config?.title || 'Cuenta regresiva').trim(),
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
