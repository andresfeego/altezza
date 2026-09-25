import { HOTEL_FIREWORKS, FIREWORK_RISE_MS, FIREWORK_BLOOM_MS } from './dressCodeTransition';
import styles from './DressCodeTransitionLemoncello.module.scss';

export default function DressCodeTransitionLemoncello({ reverse = false, onComplete }) {
  return <div className={styles.transition} data-dress-transition={reverse ? 'return' : 'fireworks'} aria-hidden="true">
    {!reverse ? HOTEL_FIREWORKS.map(([x, y, targetX, targetY, delay], index) =>
      <div key={index} data-hotel-firework style={{
        '--launch-x': `${x}%`, '--launch-y': `${y}%`, '--burst-x': `${targetX}%`, '--burst-y': `${targetY}%`,
        '--launch-delay': `${delay}ms`, '--rise-duration': `${FIREWORK_RISE_MS}ms`,
        '--bloom-delay': `${delay + FIREWORK_RISE_MS}ms`, '--bloom-duration': `${FIREWORK_BLOOM_MS}ms`,
        '--trail-angle': `${(targetX - x) * .6}deg`,
      }}>
        <span className={styles.rocket} />
        <span className={styles.burst}>
          {Array.from({ length: 13 }, (_, ray) => <i key={ray} style={{
            '--ray-angle': `${ray * 360 / 13 + index * 11}deg`,
            '--ray-distance': `var(--ag-space-${(ray + index) % 3 ? 4 : 5})`,
          }} />)}
        </span>
      </div>) : null}
    {!reverse ? <div className={styles.glow} /> : null}
    <div className={`${styles.wash} ${reverse ? styles.returnWash : styles.arrivalWash}`}
      data-dress-wash onAnimationEnd={event => { if (event.target === event.currentTarget) onComplete(); }} />
  </div>;
}
