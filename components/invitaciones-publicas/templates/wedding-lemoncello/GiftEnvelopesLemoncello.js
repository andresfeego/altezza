import couple from './assets/images/gift-dancing-silhouette-v1.webp';
import styles from './GiftEnvelopesLemoncello.module.scss';

const src = asset => typeof asset === 'string' ? asset : asset.src;

export default function GiftEnvelopesLemoncello({ data }) {
  if (!data?.imageSrc) return null;
  return <section className={styles.gifts} data-gift-envelopes aria-label={data.title || 'Lluvia de sobres'}>
    <div className={styles.lights} aria-hidden="true" data-sky-spotlights>
      {[0, 1, 2, 3].map(index => <div className={styles.spotlight} key={index}><span /></div>)}
    </div>
    <div className={styles.content}>
      {data.title ? <h2 className={styles.title}>{data.title}</h2> : null}
      <img className={styles.envelope} src={data.imageSrc} alt={data.imageAlt} data-invitation-preload />
      {data.leadText ? <p className={styles.message}>{data.leadText}</p> : null}
    </div>
    <div className={styles.dancers} aria-hidden="true" data-gift-dancers>
      <div className={styles.silhouette} style={{ '--couple-mask': `url("${src(couple)}")` }} />
      <img className={styles.preload} src={src(couple)} alt="" data-invitation-preload />
    </div>
  </section>;
}
