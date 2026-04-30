import { useEffect, useMemo, useState } from 'react';

export default function HeroImage1View({ data, styles }) {
  const leaves = Array.from({ length: 21 }, (_, index) => index);
  const textSequence = useMemo(
    () => [
      data.text1 ? { key: 'eyebrow', value: data.text1, className: styles.heroImageEyebrow } : null,
      data.text2 ? { key: 'date', value: data.text2, className: styles.heroImageDate } : null,
    ].filter(Boolean),
    [data.text1, data.text2, styles.heroImageDate, styles.heroImageEyebrow]
  );
  const [activeTextIndex, setActiveTextIndex] = useState(0);

  useEffect(() => {
    setActiveTextIndex(0);
  }, [textSequence.length]);

  useEffect(() => {
    if (textSequence.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveTextIndex((current) => (current + 1) % textSequence.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [textSequence.length]);

  return (
    <section className={`${styles.moduleCard} ${styles.heroImageModule}`}>
      <img
        className={styles.heroImageBackground}
        src={data.backgroundImage}
        alt="Imagen principal de la tarjeta"
      />
      <div className={styles.heroImageOverlay} />
      <div className={styles.heroImageLeaves} aria-hidden="true">
        {leaves.map((leaf) => (
          <span key={leaf} className={styles.heroImageLeaf} />
        ))}
      </div>
      <div className={styles.heroImageContent}>
        {data.logoImage ? (
          <div className={styles.heroImageLogo}>
            <img src={data.logoImage} alt="Logo del evento" />
          </div>
        ) : null}
        {textSequence.length ? (
          <div className={styles.heroImageTextStage}>
            {textSequence.map((item, index) => (
              <div
                key={item.key}
                className={`${styles.heroImageTextSlide} ${index === activeTextIndex ? styles.heroImageTextSlideActive : ''}`}
              >
                {item.key === 'date' ? (
                  <p className={item.className}>{item.value}</p>
                ) : (
                  <span className={item.className}>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        ) : null}
        {data.text3 ? (
          <h2 className={styles.heroImageTitle} data-heading={data.text3} aria-label={data.text3}>
            {data.text3}
          </h2>
        ) : null}
      </div>
    </section>
  );
}
