import canopy from './assets/images/parasol-overhead-v1.webp';
import { umbrellaLayout } from './umbrellaTransition';
import styles from './UmbrellaTransitionLemoncello.module.scss';

export default function UmbrellaTransitionLemoncello({ running, width, height, onCovered, onComplete }) {
  return <div className={`${styles.transition} ${running ? styles.running : ''}`}
    data-umbrella-transition data-running={running} aria-hidden="true"
    onAnimationEnd={event => { if (event.target === event.currentTarget) onComplete(); }}>
    <span className={styles.coverCue} onAnimationEnd={event => {
      if (event.target === event.currentTarget) onCovered();
    }} />
    {umbrellaLayout(width, height).map((item, index) => <div key={index} className={styles.track}
      data-umbrella style={{ left: item.x, top: item.y, width: item.diameter, height: item.diameter,
        '--umbrella-x': `${item.offset.x}px`, '--umbrella-y': `${item.offset.y}px`,
        '--umbrella-exit-x': `${-item.offset.x}px`, '--umbrella-exit-y': `${-item.offset.y}px`,
        '--umbrella-angle': `${item.angle}deg`, '--umbrella-turn': `${item.direction * 240}deg`,
      }}>
      <img src={typeof canopy === 'string' ? canopy : canopy.src} alt="" data-invitation-preload />
    </div>)}
  </div>;
}
