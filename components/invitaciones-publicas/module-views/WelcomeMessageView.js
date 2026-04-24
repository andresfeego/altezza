export default function WelcomeMessageView({ data, styles }) {
  return (
    <section className={`${styles.moduleCard} ${styles.moduleCardSoft}`}>
      <span className={styles.sectionEyebrow}>Una invitacion para ti</span>
      <h2 className={styles.moduleTitle}>{data.title}</h2>
      {data.inviteeName ? <p className={styles.moduleLead}>Para {data.inviteeName}</p> : null}
      {data.personalizedMessage ? (
        <p className={styles.moduleText}>{data.personalizedMessage}</p>
      ) : data.subtitle ? (
        <p className={styles.moduleText}>{data.subtitle}</p>
      ) : null}
    </section>
  );
}
