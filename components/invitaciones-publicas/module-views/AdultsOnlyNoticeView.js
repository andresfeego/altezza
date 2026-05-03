export default function AdultsOnlyNoticeView({ data, styles }) {
  if (!data?.title && !data?.imageSrc && !data?.text) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.adultsOnlyNoticeModule}`}>
      <div className={styles.adultsOnlyNoticeBackground} aria-hidden="true" />
      <div className={styles.adultsOnlyNoticeContent}>
        {data.title ? <h2 className={styles.adultsOnlyNoticeTitle}>{data.title}</h2> : null}
        {data.imageSrc ? (
          <img className={styles.adultsOnlyNoticeImage} src={data.imageSrc} alt={data.imageAlt} />
        ) : null}
        {data.text ? <p className={styles.adultsOnlyNoticeText}>{data.text}</p> : null}
      </div>
    </section>
  );
}
