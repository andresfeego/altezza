export default function PhotoSliderView({ data, styles }) {
  if (!data.images.length) return null;

  const [lead, ...rest] = data.images;

  return (
    <section className={`${styles.moduleCard} ${styles.moduleCardMedia}`}>
      <div className={styles.sectionHeading}>
        <span className={styles.sectionEyebrow}>Momentos</span>
        <h2 className={styles.moduleTitle}>Nuestra historia en imagenes</h2>
      </div>
      <div className={styles.gallery}>
        <div className={styles.galleryLead}>
          <img src={lead} alt="Foto principal de la invitacion" />
        </div>
        {rest.length ? (
          <div className={styles.galleryThumbs}>
            {rest.slice(0, 3).map((image, index) => (
              <div key={`${image}-${index}`} className={styles.galleryThumb}>
                <img src={image} alt={`Foto secundaria ${index + 1}`} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
