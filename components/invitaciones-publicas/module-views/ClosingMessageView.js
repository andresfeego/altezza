export default function ClosingMessageView({ data, styles }) {
  if (!data?.message || !data?.frameImage) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.closingMessageModule}`}>
      <img
        className={styles.closingMessageFrame}
        src={data.frameImage}
        alt=""
        aria-hidden="true"
      />
      <div className={styles.closingMessageContent}>
        <p className={styles.closingMessageText}>{data.message}</p>
      </div>
    </section>
  );
}
