import InstantPhotosView from '../../module-views/InstantPhotosView';
import FloralReliefOliva from './FloralReliefOliva';
import heroStyles from './HeroOliva.module.scss';
import photoStyles from './InstantPhotosOliva.module.scss';

export default function InstantPhotosOliva({ data, styles }) {
  return (
    <InstantPhotosView
      data={data}
      styles={{ ...styles, ...photoStyles }}
      backgroundDecoration={data.reliefImageSrc ? <>
        <FloralReliefOliva imageSrc={data.reliefImageSrc} loading="lazy" />
        <span className={heroStyles.movingLight} aria-hidden="true" />
      </> : null}
    />
  );
}
