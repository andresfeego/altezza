import { useEffect, useMemo, useState } from 'react';
import Filtered from '../../ui/media/Filtered';

const MANUAL_IMAGE_ADJUSTMENTS = {
  /* 'slide_01.jpeg': { positionX: 50, positionY: 50, zoom: 1.1 },
  'slide_02.jpeg': { positionX: 50, positionY: 50, zoom: 1 },
  'slide_03.jpeg': { positionX: 50, positionY: 50, zoom: 1 },
  'slide_04.jpeg': { positionX: 50, positionY: 50, zoom: 1 },
  'slide_05.jpeg': { positionX: 50, positionY: 50, zoom: 1 },
  'slide_06.jpeg': { positionX: 50, positionY: 50, zoom: 1 },
  'slide_07.jpeg': { positionX: 50, positionY: 0, zoom: 1 },
  'slide_08.jpeg': { positionX: 50, positionY: 50, zoom: 1 },
  'slide_09.jpeg': { positionX: 50, positionY: 50, zoom: 1.1 }, */
};

function getImageKey(image) {
  return String(image || '').split('?')[0].split('/').pop() || '';
}

function getImageAdjustment(image, index, configAdjustments = {}) {
  const imageKey = getImageKey(image);
  const indexKey = String(index);
  const source = configAdjustments[imageKey]
    || configAdjustments[image]
    || configAdjustments[indexKey]
    || MANUAL_IMAGE_ADJUSTMENTS[imageKey]
    || MANUAL_IMAGE_ADJUSTMENTS[image]
    || MANUAL_IMAGE_ADJUSTMENTS[indexKey]
    || {};

  const rawPositionX = source.positionX ?? source.positionx ?? source.x ?? 50;
  const rawPositionY = source.positionY ?? source.positiony ?? source.y ?? 50;
  const rawZoom = source.zoom ?? source.scale ?? source.z ?? 1;

  const positionX = Number.isFinite(Number(rawPositionX)) ? Number(rawPositionX) : 50;
  const positionY = Number.isFinite(Number(rawPositionY)) ? Number(rawPositionY) : 50;
  const zoom = Number.isFinite(Number(rawZoom)) ? Number(rawZoom) : 1;

  return {
    positionX: Math.max(0, Math.min(100, positionX)),
    positionY: Math.max(0, Math.min(100, positionY)),
    zoom: Math.max(0.5, Math.min(2.5, zoom)),
    translateX: (50 - Math.max(0, Math.min(100, positionX))) * 0.6,
  };
}

export default function ImageSliderSepiaView({ data, styles }) {
  const images = useMemo(() => (Array.isArray(data?.images) ? data.images.filter(Boolean) : []), [data?.images]);
  const intervalMs = Number(data?.intervalMs) > 0 ? Number(data.intervalMs) : 2000;
  const configAdjustments = data?.imageAdjustments && typeof data.imageAdjustments === 'object'
    ? data.imageAdjustments
    : {};
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, intervalMs]);

  useEffect(() => {
    setActiveIndex(0);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.sepiaSliderModule || ''}`}>
      {data?.title ? (
        <div className={styles.sectionHeading}>
          <h2 className={styles.moduleTitle}>{data.title}</h2>
        </div>
      ) : null}
      <Filtered as="div" filter="none" className={styles.sepiaSliderFrame || ''}>
        {images.map((image, index) => {
          const adjustment = getImageAdjustment(image, index, configAdjustments);

          return (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`Foto ${index + 1}`}
              style={{
                objectPosition: `${adjustment.positionX}% ${adjustment.positionY}%`,
                transform: `translateX(${adjustment.translateX}%) scale(${adjustment.zoom})`,
              }}
              className={`${styles.sepiaSliderImage || ''} ${activeIndex === index ? styles.sepiaSliderImageActive || '' : ''}`}
            />
          );
        })}
      </Filtered>
    </section>
  );
}
