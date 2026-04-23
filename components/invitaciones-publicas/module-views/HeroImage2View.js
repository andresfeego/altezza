export default function HeroImage2View({ data, styles }) {
  const renderCoupleNames = (value) => {
    const raw = String(value || '');
    if (!raw.includes('&')) return raw;

    const parts = raw.split('&');
    return parts.reduce((acc, part, index) => {
      if (index > 0) {
        acc.push(<br key={`br-${index}`} />);
        acc.push(
          <span key={`amp-${index}`} className={styles.heroImage2Ampersand}>
            &
          </span>
        );
      }
      acc.push(<span key={`part-${index}`}>{part}</span>);
      return acc;
    }, []);
  };

  return (
    <section className={`${styles.moduleCard} ${styles.heroImage2Module}`}>
      <img
        className={styles.heroImage2Background}
        src={data.backgroundImage}
        alt="Fondo del modulo principal"
      />
      <div className={styles.heroImage2Overlay} />
      <div className={styles.heroImage2Content}>
        {data.logoImage ? (
          <div className={styles.heroImage2Logo}>
            <img src={data.logoImage} alt="Logo del evento" />
          </div>
        ) : null}
        <div className={styles.heroImage2Dome}>
          {data.imageSrc ? (
            <div className={styles.heroImage2Photo}>
              <img src={data.imageSrc} alt={data.imageAlt} />
            </div>
          ) : null}
          {data.coupleNames ? (
            <h2 className={styles.heroImage2Title} aria-label={data.coupleNames}>
              {renderCoupleNames(data.coupleNames)}
            </h2>
          ) : null}
        </div>
      </div>
    </section>
  );
}
