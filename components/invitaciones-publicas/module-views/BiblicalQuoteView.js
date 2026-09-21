export default function BiblicalQuoteView({ data, styles, backgroundDecoration }) {
  if (!data?.passageText && !data?.passageReference) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.biblicalQuoteModule}`}>
      {backgroundDecoration}
      {data.passageText ? <p className={styles.biblicalQuoteText}>{data.passageText}</p> : null}
      {data.passageReference ? <p className={styles.biblicalQuoteReference}>{data.passageReference}</p> : null}
    </section>
  );
}
