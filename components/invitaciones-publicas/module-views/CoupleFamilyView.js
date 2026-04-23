export default function CoupleFamilyView({ data, styles }) {
  function renderFamilyItem(item) {
    return (
      <li key={item.name}>
        <span>{item.name}</span>
        {item.isDeceased ? <span className={styles.familyCross} aria-label="Fallecido">†</span> : null}
      </li>
    );
  }

  return (
    <section className={`${styles.moduleCard} ${styles.coupleFamilyModule}`}>
      <div
        className={styles.coupleFamilyBackground}
        aria-hidden="true"
      />
      <div className={styles.familyGroup}>
        <p className={styles.familyLead}>{data.coupleLabel || 'Nuestra celebracion'}</p>
        <div className={styles.familyColumns}>
          <div className={styles.familyColumn}>
            <h3 data-heading="Padres de la novia">Padres de la novia</h3>
            {data.parentsBride.length ? (
              <ul>{data.parentsBride.map(renderFamilyItem)}</ul>
            ) : <p className={styles.emptyText}>Pendiente por definir.</p>}
          </div>
          <div className={styles.familyColumn}>
            <h3 data-heading="Padres del novio">Padres del novio</h3>
            {data.parentsGroom.length ? (
              <ul>{data.parentsGroom.map(renderFamilyItem)}</ul>
            ) : <p className={styles.emptyText}>Pendiente por definir.</p>}
          </div>
          {data.godparents.length ? (
            <div className={styles.familyColumn}>
              <h3 data-heading="Padrinos">Padrinos</h3>
              <ul>{data.godparents.map(renderFamilyItem)}</ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
