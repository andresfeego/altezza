import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './EnvelopeLightTrial.module.scss';

// Temporary presentation trial. No module configuration or shared template changes.
export const LIGHT_TRIAL_DURATION_MS = 1200;

export default function EnvelopeLightTrial({ origin, onCovered, onComplete }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Swap the envelope for the hero at the opaque midpoint of the light.
    const covered = window.setTimeout(onCovered, LIGHT_TRIAL_DURATION_MS * .5);
    const complete = window.setTimeout(onComplete, LIGHT_TRIAL_DURATION_MS);
    return () => {
      window.clearTimeout(covered);
      window.clearTimeout(complete);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCovered, onComplete]);

  return createPortal(
    <div
      className={styles.light}
      data-envelope-light-trial
      aria-hidden="true"
      style={{
        '--light-x': `${origin.x}px`,
        '--light-y': `${origin.y}px`,
        '--light-diameter': `${origin.diameter}px`,
        '--light-color': origin.color,
        '--light-duration': `${LIGHT_TRIAL_DURATION_MS}ms`,
      }}
    >
      <div className={styles.bloom} />
      <div className={styles.wash} />
    </div>,
    document.body,
  );
}
