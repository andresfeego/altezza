import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './EnvelopeLiftTrial.module.scss';

export const LIFT_TRIAL_DURATION_MS = 2000;

// The original envelope animates in place over the hero; this layer only guards input.
export default function EnvelopeLiftTrial({ onComplete }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const complete = window.setTimeout(onComplete, LIFT_TRIAL_DURATION_MS);
    return () => {
      window.clearTimeout(complete);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return createPortal(
    <div className={styles.blocker} data-envelope-lift-trial aria-hidden="true" />,
    document.body,
  );
}
