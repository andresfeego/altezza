export default function GiftEnvelopesView({ data, styles }) {
  if (!data?.imageSrc) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.giftEnvelopesModule}`}>
      <div
        className={styles.giftEnvelopesBackground}
        aria-hidden="true"
      />
      <div className={styles.giftEnvelopesContent}>
        <p className={styles.giftEnvelopesLead}>
          Tu presencia es nuestro mejor regalo, pero si esta dentro de tus posibilidades y deseas hacernos un presente te dejamos esta opcion.
        </p>
        <img className={styles.giftEnvelopesImage} src={data.imageSrc} alt={data.imageAlt} />
        <p className={styles.giftEnvelopesSubtitle}>Lluvia de sobres</p>
      </div>
    </section>
  );
}
