import { useState } from 'react';
import coast from './assets/images/closing-coast-night-v1.webp';
import ClosingWater from './ClosingWater';
import styles from './ClosingLemoncello.module.scss';

const src = asset => typeof asset === 'string' ? asset : asset.src;

export default function ClosingLemoncello({ data, sceneActive = false }) {
  const [failedImage, setFailedImage] = useState('');
  if (!data?.message) return null;
  return <footer className={styles.scene} data-closing-scene aria-label="Mensaje final">
    <img className={styles.landscape} src={src(coast)} alt="" aria-hidden="true" data-closing-landscape data-invitation-preload />
    {sceneActive ? <ClosingWater source={src(coast)} className={styles.landscape} /> : null}
    {data.showFrame !== false && data.frameImage ? <img className={styles.frame} src={data.frameImage} alt="" aria-hidden="true" data-invitation-preload /> : null}
    <div className={styles.copy}>
      {data.imageSrc && failedImage !== data.imageSrc ? <span className={styles.monogram}
        style={{ '--closing-image-mask': `url(${JSON.stringify(data.imageSrc)})` }}>
        <img src={data.imageSrc} alt={data.imageAlt || ''} onError={() => setFailedImage(data.imageSrc)} data-invitation-preload />
        <span className={styles.ink} aria-hidden="true" />
      </span> : null}
      <p className={styles.message}>{data.message}</p>
    </div>
  </footer>;
}
