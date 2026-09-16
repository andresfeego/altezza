import garland from './assets/images/floral-garland-v1.png';
import sprig from './assets/images/floral-sprig-v1.png';

export default function BotanicalArt({ variant = 'garland', className, eager = false }) {
  const artwork = variant === 'sprig'
    ? { src: sprig, width: 1024, height: 1536 }
    : { src: garland, width: 2172, height: 724 };

  return (
    <img
      src={artwork.src}
      width={artwork.width}
      height={artwork.height}
      alt=""
      aria-hidden="true"
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
