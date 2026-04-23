export default function DressCodeView({ data, styles }) {
  if (!data) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.dressCodeModule}`}>
      <h2 className={styles.dressCodeTitle}>Dress code</h2>
      {data.attireLabel ? <p className={styles.dressCodeData}>{data.attireLabel}</p> : null}
      <p className={styles.dressCodeSubtitle}>
        Queremos que cada uno de ustedes se sienta especial y luzca espectacular en nuestro dia
      </p>
      {data.imageSrc ? (
        <div className={styles.dressCodeIllustrationFrame}>
          <img className={styles.dressCodeIllustration} src={data.imageSrc} alt={data.imageAlt} />
        </div>
      ) : null}
      <p className={styles.dressCodeSubtitle}>Paleta de colores sugerida</p>
      {data.suggestedColors.length ? (
        <div className={styles.dressCodePalette}>
          {data.suggestedColors.map((color) => (
            <span key={`suggested-${color}`} className={styles.dressCodeChip} style={{ background: color }} />
          ))}
        </div>
      ) : null}
      <p className={styles.dressCodeSubtitle}>Evita estos colores</p>
      {data.avoidedColors.length ? (
        <div className={`${styles.dressCodePalette} ${styles.dressCodePaletteAvoided}`}>
          {data.avoidedColors.map((color) => (
            <span
              key={`avoided-${color}`}
              className={`${styles.dressCodeChip} ${styles.dressCodeChipAvoided}`}
              style={{ background: color }}
            >
              <span className={styles.dressCodeChipCross} aria-hidden="true">
                ×
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
