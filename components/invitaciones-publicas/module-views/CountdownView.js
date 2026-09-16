import { useEffect, useState } from 'react';

const EMPTY_ITEMS = [
  { label: 'Días', value: 0 },
  { label: 'Horas', value: 0 },
  { label: 'Minutos', value: 0 },
  { label: 'Segundos', value: 0 },
];

function buildCountdownItems(targetDateValue) {
  const targetDate = targetDateValue ? new Date(targetDateValue) : null;
  if (!targetDate) return EMPTY_ITEMS;

  const remaining = targetDate.getTime() - Date.now();
  const safeRemaining = remaining > 0 ? remaining : 0;

  return [
    { label: 'Días', value: Math.floor(safeRemaining / (1000 * 60 * 60 * 24)) },
    { label: 'Horas', value: Math.floor((safeRemaining / (1000 * 60 * 60)) % 24) },
    { label: 'Minutos', value: Math.floor((safeRemaining / (1000 * 60)) % 60) },
    { label: 'Segundos', value: Math.floor((safeRemaining / 1000) % 60) },
  ];
}

export default function CountdownView({ data, styles }) {
  const [items, setItems] = useState(EMPTY_ITEMS);
  const [completed, setCompleted] = useState(Boolean(data.completed));

  useEffect(() => {
    if (!data?.targetDate) return undefined;

    const updateCountdown = () => {
      const nextItems = buildCountdownItems(data.targetDate);
      setItems(nextItems);
      setCompleted(nextItems.every((item) => item.value === 0));
    };

    updateCountdown();

    const intervalId = window.setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [data?.targetDate]);

  if (!data.targetDate) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.moduleCardAccent}`}>
      {data.title ? <h2 className={styles.moduleTitle}>{data.title}</h2> : null}
      {(completed ? data.completedMessage : data.message) ? (
        <p className={styles.moduleText}>{completed ? data.completedMessage : data.message}</p>
      ) : null}
      <div className={styles.countdownGrid}>
        {items.map((item) => (
          <div key={item.label} className={styles.countdownItem}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
