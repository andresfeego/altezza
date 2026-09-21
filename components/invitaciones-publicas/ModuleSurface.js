import styles from './ModuleSurface.module.scss';

export function normalizeSectionBackground(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const imageSrc = typeof value.imageSrc === 'string' ? value.imageSrc.trim() : '';
  if (!imageSrc || /[\u0000-\u001f\u007f\\]/.test(imageSrc)) return null;
  const relative = imageSrc.startsWith('/') && !imageSrc.startsWith('//');
  if (!relative) {
    try {
      if (!['https:', 'http:'].includes(new URL(imageSrc).protocol)) return null;
    } catch { return null; }
  }
  const overlayOpacity = typeof value.overlayOpacity === 'number' && Number.isFinite(value.overlayOpacity)
    ? Math.min(1, Math.max(0, value.overlayOpacity)) : .8;
  return { imageSrc, overlayOpacity };
}

// Optional presentation shared by every template; absent config adds no markup.
export default function ModuleSurface({ background, children }) {
  const config = normalizeSectionBackground(background);
  if (!config) return children;
  return (
    <div
      className={styles.surface}
      data-section-background={config.imageSrc}
      style={{
        '--module-background-image': `url(${JSON.stringify(config.imageSrc)})`,
        '--module-background-opacity': config.overlayOpacity,
      }}
    >
      {children}
    </div>
  );
}
