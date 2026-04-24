import { useEffect, useMemo, useRef, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { COLOMBIA_TIMEZONE, getDatePartsInColombia } from '@/components/utils/datetimeColombia';

const TOTAL_ANIMATION_MS = 3000;

function buildCalendarModel(date) {
  const weekdayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const parts = getDatePartsInColombia(date);
  if (!parts) return null;
  const year = parts.year;
  const month = parts.month - 1;
  const firstDay = new Date(year, month, 1);
  const firstDayMondayIndex = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let index = 0; index < firstDayMondayIndex; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const monthLabel = new Intl.DateTimeFormat('es-CO', { timeZone: COLOMBIA_TIMEZONE, month: 'long' })
    .format(date)
    .toUpperCase();

  return {
    weekdayLabels,
    cells,
    yearLabel: String(year),
    monthLabel,
    daysInMonth,
    selectedDay: parts.day,
  };
}

export default function SaveTheDateCalendarView({ data, styles }) {
  const moduleRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const eventDate = data?.eventDateIso ? new Date(data.eventDateIso) : null;
  const isValidDate = eventDate instanceof Date && !Number.isNaN(eventDate?.getTime?.());
  const [animatedValues, setAnimatedValues] = useState(null);

  if (!isValidDate) {
    return null;
  }

  const calendar = buildCalendarModel(eventDate);
  if (!calendar) return null;
  const dayList = useMemo(
    () => Array.from({ length: calendar.daysInMonth }, (_, index) => index + 1),
    [calendar.daysInMonth]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!moduleRef.current) return undefined;
    if (hasAnimatedRef.current) return undefined;

    const observer = new window.IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        observer.disconnect();

        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
        if (prefersReducedMotion) {
          setAnimatedValues(dayList.reduce((acc, day) => ({ ...acc, [day]: day }), {}));
          return;
        }

        const startTime = performance.now();

        const tick = (now) => {
          let hasPending = false;
          const nextValues = {};

          dayList.forEach((day) => {
            const settleAt = startTime + (TOTAL_ANIMATION_MS * day) / dayList.length;
            const initialValue = day * 2;
            const targetValue = day;

            if (now >= settleAt) {
              nextValues[day] = targetValue;
              return;
            }

            hasPending = true;
            const duration = Math.max(1, settleAt - startTime);
            const progress = Math.max(0, Math.min(1, (now - startTime) / duration));
            const eased = 1 - (1 - progress) ** 3;
            const remaining = Math.ceil((initialValue - targetValue) * (1 - eased));
            nextValues[day] = targetValue + Math.max(0, remaining);
          });
          setAnimatedValues(nextValues);

          if (hasPending) {
            animationFrameRef.current = window.requestAnimationFrame(tick);
          } else {
            animationFrameRef.current = null;
          }
        };

        animationFrameRef.current = window.requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    observer.observe(moduleRef.current);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dayList]);

  return (
    <section ref={moduleRef} className={`${styles.moduleCard} ${styles.saveTheDateCalendarModule}`}>
      <p className={styles.saveTheDateCalendarMessage}>{data.message}</p>
      <div className={styles.saveTheDateCalendarSurface}>
        <div className={styles.saveTheDateCalendarHeading}>
          <h3 className={styles.saveTheDateCalendarYear}>{calendar.yearLabel}</h3>
          <p className={styles.saveTheDateCalendarMonth}>{calendar.monthLabel}</p>
        </div>
        <div className={styles.saveTheDateCalendarWeekdays}>
          {calendar.weekdayLabels.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
        <div className={styles.saveTheDateCalendarGrid}>
          {calendar.cells.map((day, index) => {
            if (!day) {
              return <span key={`empty-${index}`} className={styles.saveTheDateCalendarCellEmpty} aria-hidden="true" />;
            }

            const isSelected = day === calendar.selectedDay;

            return (
              <span
                key={`day-${day}`}
                className={`${styles.saveTheDateCalendarCell} ${isSelected ? styles.saveTheDateCalendarCellSelected : ''}`}
              >
                {isSelected ? (
                  <span className={styles.saveTheDateCalendarHeart} aria-hidden="true">
                    <FaHeart />
                  </span>
                ) : null}
                <span key={`day-${day}-value-${animatedValues?.[day] ?? day}`} className={styles.saveTheDateCalendarCellNumber}>
                  {animatedValues?.[day] ?? day}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
