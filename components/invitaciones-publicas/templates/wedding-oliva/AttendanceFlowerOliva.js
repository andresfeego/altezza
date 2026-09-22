import flowerSrc from './assets/images/rsvp-flower-mask-v1-web-v1.webp';
import styles from './AttendanceFlowerOliva.module.scss';

export default function AttendanceFlowerOliva() {
  return (
    <span className={styles.flower} style={{ '--rsvp-flower-mask': `url(${JSON.stringify(flowerSrc)})` }} aria-hidden="true" data-rsvp-flower>
      <img className={styles.fallback} src={flowerSrc} alt="" width={1254} height={1254} />
      <span className={styles.relief}>
        <span className={styles.shadow}><span className={styles.mask} /></span>
        <span className={styles.light}><span className={styles.mask} /></span>
        <span className={`${styles.mask} ${styles.face}`} />
      </span>
    </span>
  );
}
