function getTargetDate(module, invitacion) {
  const target = module?.config?.target === 'fechaHoraRecepcion'
    ? invitacion?.fechaHoraRecepcion
    : invitacion?.fechaHoraCeremonia;

  return target ? new Date(target) : null;
}

export default function CountdownModule({ module, invitacion }) {
  const targetDate = getTargetDate(module, invitacion);
  const now = new Date();
  const remaining = targetDate ? targetDate.getTime() - now.getTime() : null;
  const safeRemaining = remaining && remaining > 0 ? remaining : 0;

  const days = Math.floor(safeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeRemaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safeRemaining / (1000 * 60)) % 60);
  const seconds = Math.floor((safeRemaining / 1000) % 60);

  return {
    title: String(module?.config?.title || 'Cuenta regresiva').trim(),
    completed: Boolean(targetDate && remaining <= 0),
    targetDate,
    items: [
      { label: 'Dias', value: days },
      { label: 'Horas', value: hours },
      { label: 'Minutos', value: minutes },
      { label: 'Segundos', value: seconds },
    ],
  };
}
