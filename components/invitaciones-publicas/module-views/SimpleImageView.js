export default function SimpleImageView({ data, styles }) {
  if (!data?.imageSrc) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.simpleImageModule}`}>
      <div className={styles.simpleImageFrame}>
        <img src={data.imageSrc} alt={data.alt} />
      </div>
    </section>
  );
}
