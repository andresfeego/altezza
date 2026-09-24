import styles from './FireworkTransitionLemoncello.module.scss';

// A single warm ember, no flash or repeated fireworks. Decorative only.
export default function FireworkTransitionLemoncello() {
  return <div className={styles.transition} aria-hidden="true" data-event-spark>
    <span className={styles.ember} />
    <span className={styles.burst}>
      {[0, 38, 76, 119, 157, 201, 239, 281, 324].map((angle, i) =>
        <i key={angle} style={{ '--ray-angle': `${angle}deg`, '--ray-distance': `var(--ag-space-${i % 2 ? 3 : 4})` }} />)}
    </span>
  </div>;
}
