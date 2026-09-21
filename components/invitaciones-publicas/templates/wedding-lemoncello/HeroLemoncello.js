import { useState } from 'react';
import coast from './assets/images/hero-coast.webp';
import balcony from './assets/images/hero-balcony.webp';
import bird from './assets/images/hero-bird-flight-v1.webp';
import styles from './HeroLemoncello.module.scss';

const src = asset => typeof asset === 'string' ? asset : asset.src;

export default function HeroLemoncello({ data = {} }) {
  const [failedLogo, setFailedLogo] = useState('');
  return <header className={styles.hero}>
    <div className={styles.painting} aria-hidden="true">
      <img className={styles.coast} src={data.backgroundImage || src(coast)} alt="" data-invitation-preload />
    </div>
    <div className={styles.bird} aria-hidden="true">
      <div className={styles.birdWindow}>
        <img className={styles.birdFrames} src={src(bird)} alt="" data-invitation-preload />
      </div>
    </div>
    <div className={`${styles.painting} ${styles.foreground}`} aria-hidden="true">
      <img className={styles.balcony} src={src(balcony)} alt="" data-invitation-preload />
      <img className={styles.branch} src={src(balcony)} alt="" data-invitation-preload />
    </div>
    <div className={styles.copy}>
      {data.text1 ? <p className={styles.eyebrow}>{data.text1}</p> : null}
      <h1 className={styles.identity}>
        {data.logoImage && failedLogo !== data.logoImage ? <span className={styles.monogram}
          style={{ '--hero-monogram-mask': `url(${JSON.stringify(data.logoImage)})` }}>
          <img src={data.logoImage} alt={data.text3 || 'Monograma del evento'} onError={() => setFailedLogo(data.logoImage)} data-invitation-preload />
          <span className={styles.monogramInk} aria-hidden="true" />
        </span> : <span className={styles.names}>{data.text3}</span>}
      </h1>
      {data.text2 ? <p className={styles.date}>{data.text2}</p> : null}
    </div>
  </header>;
}
