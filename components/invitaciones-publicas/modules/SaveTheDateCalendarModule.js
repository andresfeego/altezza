const DEFAULT_MESSAGE = 'Tenemos el gusto de invitarlos a nuestra boda , esperamos que nos acompañen en este momento inolvidable';

export default function SaveTheDateCalendarModule({ module, invitacion }) {
  const rawEventDate = invitacion?.fechaHoraCeremonia || null;
  const parsedDate = rawEventDate ? new Date(rawEventDate) : null;
  const isValidDate = parsedDate instanceof Date && !Number.isNaN(parsedDate.getTime());

  return {
    message: String(module?.config?.message || DEFAULT_MESSAGE).trim() || DEFAULT_MESSAGE,
    eventDateIso: isValidDate ? parsedDate.toISOString() : null,
  };
}
