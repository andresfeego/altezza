import styles from './HeroOliva.module.scss';

// Each section shares the same relief; its surface owns the paper tone.
export default function FloralReliefOliva({ imageSrc, loading }) {
  if (!imageSrc) return null;

  return (
    <div className={styles.relief} style={{ '--hero-artwork': `url(${JSON.stringify(imageSrc)})` }} aria-hidden="true" data-floral-relief>
      <img className={styles.artworkFallback} src={imageSrc} alt="" loading={loading} />
      <span className={styles.artworkShadow}><span className={styles.artworkMask} /></span>
      <span className={styles.artworkLight}><span className={styles.artworkMask} /></span>
      <span className={`${styles.artworkFace} ${styles.artworkMask}`} />
    </div>
  );
}
