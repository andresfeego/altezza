import styles from './HeroOliva.module.scss';

export default function HeroOliva({ data }) {
  const names = data.text3.split('&').map((name) => name.trim());

  return (
    <header className={styles.hero}>
      {data.backgroundImage ? (
        <div
          className={styles.relief}
          style={{ '--hero-artwork': `url(${JSON.stringify(data.backgroundImage)})` }}
          aria-hidden="true"
        >
          <img className={styles.artworkFallback} src={data.backgroundImage} alt="" />
          <span className={styles.artworkShadow}><span className={styles.artworkMask} /></span>
          <span className={styles.artworkLight}><span className={styles.artworkMask} /></span>
          <span className={`${styles.artworkFace} ${styles.artworkMask}`} />
        </div>
      ) : null}
      {data.text1 ? <p className={styles.eyebrow}>{data.text1}</p> : null}
      <h1 tabIndex={-1} data-oliva-title className={styles.identity}>
        {data.logoImage ? (
          <img className={styles.monogram} src={data.logoImage} alt={data.text3 || 'Monograma del evento'} />
        ) : (
          <span className={styles.names}>
            {names.length === 2 ? <>{names[0]}<em>&</em>{names[1]}</> : data.text3}
          </span>
        )}
      </h1>
      {data.text2 ? <p className={styles.date}>{data.text2}</p> : null}
    </header>
  );
}
