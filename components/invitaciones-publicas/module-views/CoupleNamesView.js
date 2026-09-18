export default function CoupleNamesView({ data, styles, decoration = null }) {
  if (!data?.brideName && !data?.groomName) return null;
  const label = [data.brideName, data.groomName].filter(Boolean).join(' & ');

  return (
    <section className={styles.coupleNamesModule} data-couple-names="true">
      {decoration}
      <h2 className={styles.coupleNamesTitle} aria-label={label}>
        {data.brideName ? <span className={styles.coupleName}>{data.brideName}</span> : null}
        {data.brideName && data.groomName ? <span className={styles.coupleNamesAmpersand}>&amp;</span> : null}
        {data.groomName ? <span className={styles.coupleName}>{data.groomName}</span> : null}
      </h2>
    </section>
  );
}
