function firstLetter(value) {
  const normalized = String(value || '').trim();
  return normalized ? normalized.charAt(0).toUpperCase() : '';
}

function splitCoupleNames(rawCoupleName = '') {
  const raw = String(rawCoupleName || '').trim();
  if (!raw) return { brideName: '', groomName: '' };
  const parts = raw.split('&').map((part) => String(part || '').trim()).filter(Boolean);
  return {
    brideName: parts[0] || '',
    groomName: parts[1] || '',
  };
}

function formatEventDateShort(rawDate) {
  if (!rawDate) return '';
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return '';

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

export default function EnvelopIntroModule({ module, evento, invitacion }) {
  const fallback = splitCoupleNames(evento?.nombre || invitacion?.nombreEvento || '');
  const brideName = String(module?.config?.brideName || fallback.brideName).trim();
  const groomName = String(module?.config?.groomName || fallback.groomName).trim();
  const initials = `${firstLetter(brideName)}${firstLetter(groomName)}`.trim();

  return {
    brideName,
    groomName,
    initials,
    eventDate: formatEventDateShort(invitacion?.fechaHoraCeremonia),
    invitationLabel: String(module?.config?.invitationLabel || invitacion?.label || '').trim(),
  };
}
