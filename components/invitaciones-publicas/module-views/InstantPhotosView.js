export default function InstantPhotosView({ data, styles, backgroundDecoration }) {
  if (data?.images?.length !== 2) return null;

  return (
    <section className={`${styles.instantPhotosModule}${data.message ? ` ${styles.instantPhotosWithMessage}` : ''}`} data-instant-photos aria-label="Recuerdos en fotografías">
      {backgroundDecoration}
      <div className={styles.instantPhotosComposition}>
        {data.images.map((image, index) => (
          <figure className={styles.instantPhoto} key={index}>
            <img className={styles.instantPhotoImage} src={image.imageSrc} alt={image.imageAlt} loading="lazy" decoding="async" />
          </figure>
        ))}
        {data.sealImageSrc ? (
          <img className={styles.instantPhotosSeal} src={data.sealImageSrc} alt={data.sealImageAlt} loading="lazy" decoding="async" width="384" height="384" />
        ) : null}
      </div>
      {data.message ? <p className={styles.instantPhotosMessage} data-instant-photos-message>{data.message}</p> : null}
    </section>
  );
}
