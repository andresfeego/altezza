import { formatDateInColombia, getDatePartsInColombia } from '@/components/utils/datetimeColombia';

export default function CountdownDate({ value, styles }) {
  const parts = getDatePartsInColombia(value);
  if (!parts) return null;
  const weekday = formatDateInColombia(value, { options: { weekday: 'long' }, fallback: '' });
  const month = formatDateInColombia(value, { options: { month: 'long' }, fallback: '' });
  const label = `${weekday}, ${parts.day} de ${month} de ${parts.year}`;

  return (
    <time className={styles.countdownDate} dateTime={value} aria-label={label} data-countdown-date="true">
      <span className={styles.countdownDateMonth} aria-hidden="true">{month}</span>
      <span className={styles.countdownDateWeekday} aria-hidden="true">{weekday}</span>
      <span className={styles.countdownDateDay} aria-hidden="true">{parts.dayLabel}</span>
      <span className={styles.countdownDateYear} aria-hidden="true">{parts.year}</span>
    </time>
  );
}
