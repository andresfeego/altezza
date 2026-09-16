import sealSrc from './assets/images/sello-lacre-abrir-v1.png';
import styles from './EnvelopeOliva.module.scss';

export default function EnvelopeOliva({ data, onOpen }) {
  const names = [data.brideName, data.groomName].filter(Boolean).join(' y ');

  return (
    <section className={styles.scene} aria-label="Sobre de la invitación">
      {data.backgroundSrc ? (
        <picture className={styles.backdrop}>
          {data.backgroundDesktopSrc ? <source media="(min-width: 1024px)" srcSet={data.backgroundDesktopSrc} /> : null}
          <img className={styles.backdropImage} src={data.backgroundSrc} alt="" aria-hidden="true" />
        </picture>
      ) : null}
      <button
        type="button"
        className={styles.envelope}
        onClick={onOpen}
        aria-label={names ? `Abrir invitación de ${names}` : 'Abrir invitación'}
      >
        <span className={styles.artwork} aria-hidden="true">
          {data.envelopeSrc ? <img className={styles.envelopeImage} src={data.envelopeSrc} alt="" /> : null}
        </span>
        {data.monogramSrc ? (
          <span
            className={`${styles.monogram} ${data.envelopeSrc ? styles.monogramEmbossed : ''}`}
            style={{ '--monogram-mask': `url(${JSON.stringify(data.monogramSrc)})` }}
            aria-hidden="true"
          >
            <img className={styles.monogramFallback} src={data.monogramSrc} alt="" />
            {data.envelopeSrc ? (
              <span className={styles.monogramRelief}>
                <span className={styles.monogramShadow}><span className={styles.monogramMask} /></span>
                <span className={styles.monogramLight}><span className={styles.monogramMask} /></span>
                <span className={`${styles.monogramMask} ${styles.monogramFace}`}>
                  <img className={styles.envelopeImage} src={data.envelopeSrc} alt="" />
                </span>
              </span>
            ) : null}
          </span>
        ) : <span className={styles.initials} aria-hidden="true">{data.initials}</span>}
        <img className={styles.openSeal} src={sealSrc} width={1254} height={1254} alt="" aria-hidden="true" />
        <span className={styles.details}>
          {data.invitationLabel ? <span className={styles.invitationLabel}>{data.invitationLabel}</span> : null}
          {data.eventDate ? <span className={styles.date}>{data.eventDate}</span> : null}
        </span>
      </button>
    </section>
  );
}
