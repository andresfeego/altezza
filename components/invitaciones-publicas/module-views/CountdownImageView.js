import { useEffect, useRef, useState } from 'react';

const EMPTY_COUNTDOWN_ITEMS = [
  { label: 'Dias', value: 0 },
  { label: 'Horas', value: 0 },
  { label: 'Minutos', value: 0 },
  { label: 'Segundos', value: 0 },
];

function buildCountdownItems(targetDateValue) {
  const targetDate = targetDateValue ? new Date(targetDateValue) : null;
  if (!targetDate) return [];

  const remaining = targetDate.getTime() - Date.now();
  const safeRemaining = remaining > 0 ? remaining : 0;

  return [
    { label: 'Dias', value: Math.floor(safeRemaining / (1000 * 60 * 60 * 24)) },
    { label: 'Horas', value: Math.floor((safeRemaining / (1000 * 60 * 60)) % 24) },
    { label: 'Minutos', value: Math.floor((safeRemaining / (1000 * 60)) % 60) },
    { label: 'Segundos', value: Math.floor((safeRemaining / 1000) % 60) },
  ];
}

export default function CountdownImageView({ data, styles }) {
  const [items, setItems] = useState(EMPTY_COUNTDOWN_ITEMS);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isConfettiReady, setIsConfettiReady] = useState(false);
  const canvasRef = useRef(null);
  const confettiRef = useRef(null);
  const triggerRef = useRef(null);
  const hasFiredRef = useRef(false);
  useEffect(() => {
    let isMounted = true;

    if (!canvasRef.current) return undefined;

    import('canvas-confetti').then(({ default: confetti }) => {
      if (!canvasRef.current || !isMounted) return;

      confettiRef.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });
      setIsConfettiReady(true);
    });

    return () => {
      isMounted = false;
      confettiRef.current?.reset?.();
      confettiRef.current = null;
      setIsConfettiReady(false);
    };
  }, []);

  useEffect(() => {
    if (!data?.targetDate) return undefined;

    const updateCountdown = () => {
      const nextItems = buildCountdownItems(data.targetDate);
      setItems(nextItems);
      setIsCompleted(nextItems.every((item) => item.value === 0));
    };

    updateCountdown();

    const intervalId = window.setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [data?.targetDate]);

  useEffect(() => {
    if (!triggerRef.current || !isConfettiReady) return undefined;

    const observer = new window.IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || hasFiredRef.current || !confettiRef.current) return;

        hasFiredRef.current = true;

        const fire = confettiRef.current;
        const sharedOptions = {
          particleCount: 75,
          spread: 60,
          startVelocity: 45,
          scalar: 0.9,
          ticks: 140,
          gravity: 1.05,
          drift: 0,
          colors: [
            '#80808080',
            '#00000080',
            '#ffffff80',
          ],
        };

        fire({
          ...sharedOptions,
          angle: 58,
          origin: { x: 0, y: 1 },
        });

        fire({
          ...sharedOptions,
          angle: 122,
          origin: { x: 1, y: 1 },
        });
      },
      {
        threshold: 0.95,
      }
    );

    observer.observe(triggerRef.current);

    return () => observer.disconnect();
  }, [isConfettiReady]);

  if (!data?.backgroundImage || !data?.targetDate) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.countdownImageModule}`}>
      <canvas
        ref={canvasRef}
        className={styles.countdownImageConfettiCanvas}
        aria-hidden="true"
      />
      <img
        className={styles.countdownImageBackground}
        src={data.backgroundImage}
        alt=""
        aria-hidden="true"
      />
      <div className={styles.countdownImageOverlay} />
      <div className={styles.countdownImageContent}>
        <p className={styles.countdownImageDate}>{data.displayDate}</p>
        <div className={styles.countdownImageGrid}>
          {items.map((item) => (
            <div key={item.label} className={styles.countdownImageItem}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        {isCompleted ? <p className={styles.countdownImageCaption}>El momento esperado ya llego.</p> : null}
      </div>
      <span ref={triggerRef} className={styles.countdownImageScrollTrigger} aria-hidden="true" />
    </section>
  );
}
