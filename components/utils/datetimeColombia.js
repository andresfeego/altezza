export const COLOMBIA_TIMEZONE = 'America/Bogota';

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function formatDateInColombia(value, {
  locale = 'es-CO',
  options = {},
  fallback = 'Sin definir',
} = {}) {
  const parsed = toDate(value);
  if (!parsed) return fallback;

  return parsed.toLocaleDateString(locale, {
    timeZone: COLOMBIA_TIMEZONE,
    ...options,
  });
}

export function formatDateTimeInColombia(value, {
  locale = 'es-CO',
  options = {},
  fallback = 'Sin definir',
} = {}) {
  const parsed = toDate(value);
  if (!parsed) return fallback;

  return parsed.toLocaleString(locale, {
    timeZone: COLOMBIA_TIMEZONE,
    ...options,
  });
}

export function getDatePartsInColombia(value) {
  const parsed = toDate(value);
  if (!parsed) return null;

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: COLOMBIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(parsed);

  const byType = parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  const year = Number(byType.year);
  const month = Number(byType.month);
  const day = Number(byType.day);

  if (!year || !month || !day) return null;

  return {
    year,
    month,
    day,
    dayLabel: String(day).padStart(2, '0'),
    monthLabel: String(month).padStart(2, '0'),
    shortYearLabel: String(year).slice(-2),
  };
}

// Build punctuation ourselves: Safari and Node can use different day-period
// strings ("p.m." versus "p. m."), which breaks server/client hydration.
export function formatTimeInColombiaStable(value, fallback = '') {
  const parsed = toDate(value);
  if (!parsed) return fallback;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: COLOMBIA_TIMEZONE,
    numberingSystem: 'latn',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(parsed);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value) % 24;
  const minute = parts.find((part) => part.type === 'minute')?.value;
  if (!Number.isFinite(hour) || minute === undefined) return fallback;
  return `${hour % 12 || 12}:${minute.padStart(2, '0')} ${hour >= 12 ? 'p. m.' : 'a. m.'}`;
}
