export default function GiftEnvelopesView({ data, styles }) {
  if (!data?.imageSrc) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.giftEnvelopesModule}`}>
      <div
        className={styles.giftEnvelopesBackground}
        aria-hidden="true"
      />
      <div className={styles.giftEnvelopesContent}>
        {data.leadText ? (
          <p className={styles.giftEnvelopesLead}>
            {data.leadText}
          </p>
        ) : null}
        <img className={styles.giftEnvelopesImage} src={data.imageSrc} alt={data.imageAlt} />
        <p className={styles.giftEnvelopesSubtitle}>Lluvia de sobres</p>
      </div>
    </section>
  );
}
