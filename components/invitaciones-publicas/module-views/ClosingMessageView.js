export default function ClosingMessageView({ data, styles }) {
  if (!data?.message) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.closingMessageModule}`}>
      {data.showFrame !== false && data.frameImage ? <img
        className={styles.closingMessageFrame}
        src={data.frameImage}
        alt=""
        aria-hidden="true"
      /> : null}
      <div className={styles.closingMessageContent}>
        <p className={styles.closingMessageText} style={{ whiteSpace: 'pre-line' }}>{data.message}</p>
      </div>
    </section>
  );
}
