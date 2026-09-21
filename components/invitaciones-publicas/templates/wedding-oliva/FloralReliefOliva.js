import styles from './HeroOliva.module.scss';

// The hero and photo keepsake share the same relief; their surface owns its tone.
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
