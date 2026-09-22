import { useEffect, useState } from 'react';
import styles from './EnvelopeBackground.module.scss';

// Shared media behavior; each template owns the scene and its visual treatment.
export default function EnvelopeBackground({ data, className = '', active = true, prepared = false }) {
  const imageSrc = data?.backgroundSrc || data?.backgroundDesktopSrc || '';
  const videoSrc = data?.backgroundVideoSrc || '';
  const [reducedMotion, setReducedMotion] = useState(true);
  const [playingSrc, setPlayingSrc] = useState('');
  const [failedSrc, setFailedSrc] = useState('');

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  if (!imageSrc && !videoSrc) return null;
  const playVideo = active && !reducedMotion && videoSrc && (prepared || failedSrc !== videoSrc);

  return (
    <div className={`${styles.backdrop} ${className}`} aria-hidden="true" data-envelope-background>
      {imageSrc ? (
        <picture>
          {data.backgroundDesktopSrc ? <source media="(min-width: 1024px)" srcSet={data.backgroundDesktopSrc} /> : null}
          <img className={styles.media} src={imageSrc} alt="" />
        </picture>
      ) : null}
      {playVideo ? (
        <video
          key={videoSrc}
          className={`${styles.media} ${playingSrc === videoSrc ? styles.playing : styles.waiting}`}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={prepared ? imageSrc : undefined}
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => setPlayingSrc(videoSrc)}
          onLoadedData={prepared ? () => setPlayingSrc(videoSrc) : undefined}
          onError={() => { setFailedSrc(videoSrc); setPlayingSrc(''); }}
        />
      ) : null}
    </div>
  );
}
