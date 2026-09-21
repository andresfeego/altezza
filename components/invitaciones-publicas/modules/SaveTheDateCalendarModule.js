export default function SaveTheDateCalendarModule({ module, invitacion }) {
  const rawEventDate = invitacion?.fechaHoraCeremonia || null;
  const parsedDate = rawEventDate ? new Date(rawEventDate) : null;
  const isValidDate = parsedDate instanceof Date && !Number.isNaN(parsedDate.getTime());

  return {
    message: String(module?.config?.message || '').trim(),
    eventDateIso: isValidDate ? parsedDate.toISOString() : null,
  };
}
