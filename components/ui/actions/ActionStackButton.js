import styles from './ActionStackButton.module.scss';

function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

export default function ActionStackButton({
  icon,
  label,
  variant = 'neutral',
  onClick,
  disabled = false,
  className = '',
}) {
  const variantClass = variant === 'primary'
    ? styles.primary
    : variant === 'dangerSoft'
      ? styles.dangerSoft
      : styles.neutral;

  return (
    <button type="button" className={joinClasses(styles.button, variantClass, className)} onClick={onClick} disabled={disabled}>
      <span className={styles.iconBadge} aria-hidden="true">{icon}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
