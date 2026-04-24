export default function CountdownView({ data, styles }) {
  if (!data.targetDate) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.moduleCardAccent}`}>
      <div className={styles.sectionHeading}>
        <span className={styles.sectionEyebrow}>Cuenta regresiva</span>
        <h2 className={styles.moduleTitle}>{data.title}</h2>
      </div>
      <p className={styles.moduleText}>
        {data.completed
          ? 'El momento esperado ya llego.'
          : 'Cada instante nos acerca a compartir este dia contigo.'}
      </p>
      <div className={styles.countdownGrid}>
        {data.items.map((item) => (
          <div key={item.label} className={styles.countdownItem}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
