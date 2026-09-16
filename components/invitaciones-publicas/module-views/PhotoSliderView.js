export default function PhotoSliderView({ data, styles }) {
  if (!data.images.length) return null;

  const [lead, ...rest] = data.images;

  return (
    <section className={`${styles.moduleCard} ${styles.moduleCardMedia}`}>
      {data.title ? <h2 className={styles.moduleTitle}>{data.title}</h2> : null}
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
