import { describeDressCodeSwatch } from '../modules/dressCodePalette';

function Palette({ items, avoided = false, styles }) {
  return (
    <div className={`${styles.dressCodePalette} ${avoided ? styles.dressCodePaletteAvoided : ''}`} data-dresscode-palette={avoided ? 'avoided' : 'suggested'}>
      {items.map((item, index) => {
        const { imageSrc, color, label, crop } = describeDressCodeSwatch(item);
        const accessibleLabel = label || (imageSrc ? `Muestra de tela ${index + 1}` : color);
        const cropStyle = crop ? {
          '--swatch-image-width': `${10000 / crop.width}%`,
          '--swatch-image-height': `${10000 / crop.height}%`,
          '--swatch-image-x': `${-100 * crop.x / crop.width}%`,
          '--swatch-image-y': `${-100 * crop.y / crop.height}%`,
        } : undefined;
        return (
          <span
            key={`${imageSrc || color}-${index}`}
            className={`${styles.dressCodeChip} ${imageSrc ? styles.dressCodeChipWithImage : ''} ${avoided ? styles.dressCodeChipAvoided : ''}`}
            style={imageSrc ? cropStyle : { background: color }}
            role="img"
            aria-label={accessibleLabel}
            title={accessibleLabel}
          >
            {imageSrc ? <img className={styles.dressCodeChipImage} src={imageSrc} alt="" loading="lazy" decoding="async" /> : null}
            {avoided ? <span className={styles.dressCodeChipCross} aria-hidden="true">×</span> : null}
          </span>
        );
      })}
    </div>
  );
}

export default function DressCodeView({ data, styles }) {
  if (!data) return null;

  return (
    <section className={`${styles.moduleCard} ${styles.dressCodeModule}`} data-dresscode>
      {data.title ? <h2 className={styles.dressCodeTitle}>{data.title}</h2> : null}
      {data.attireLabel ? <p className={styles.dressCodeData}>{data.attireLabel}</p> : null}
      {data.message ? <p className={styles.dressCodeSubtitle}>{data.message}</p> : null}
      {data.imageSrc ? (
        <div className={styles.dressCodeIllustrationFrame}>
          <img className={styles.dressCodeIllustration} src={data.imageSrc} alt={data.imageAlt} />
        </div>
      ) : null}
      {data.suggestedColors.length ? (
        <>
          {data.suggestedColorsTitle ? <p className={styles.dressCodeSubtitle}>{data.suggestedColorsTitle}</p> : null}
          <Palette items={data.suggestedColors} styles={styles} />
        </>
      ) : null}
      {data.avoidedColors.length ? (
        <>
          {data.avoidedColorsTitle ? <p className={styles.dressCodeSubtitle}>{data.avoidedColorsTitle}</p> : null}
          <Palette items={data.avoidedColors} avoided styles={styles} />
        </>
      ) : null}
    </section>
  );
}
