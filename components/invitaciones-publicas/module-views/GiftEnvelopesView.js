export default function GiftEnvelopesView({ data, styles }) {
  if (!data?.imageSrc) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.giftEnvelopesModule}`} data-gift-envelopes>
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
        {data.title ? <p className={styles.giftEnvelopesSubtitle}>{data.title}</p> : null}
      </div>
    </section>
  );
}
