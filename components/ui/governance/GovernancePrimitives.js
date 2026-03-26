import { FiMoreHorizontal } from 'react-icons/fi';
import styles from './GovernancePrimitives.module.scss';

export function GovernanceButton({ variant = 'primary', className = '', ...props }) {
  const variantMap = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    ghost: styles.buttonGhost,
    danger: styles.buttonDanger,
  };

  return (
    <button
      {...props}
      className={`${styles.button} ${variantMap[variant] || styles.buttonPrimary} ${className}`.trim()}
    />
  );
}

export function GovernanceField({
  label,
  hint,
  error,
  as = 'input',
  className = '',
  ...props
}) {
  const Comp = as;
  const inputClassMap = {
    input: error ? styles.inputError : styles.input,
    textarea: error ? styles.textareaError : styles.textarea,
    select: error ? styles.selectError : styles.select,
  };

  return (
    <label className={`${styles.field} ${className}`.trim()}>
      <span className={styles.label}>{label}</span>
      <Comp className={inputClassMap[as] || inputClassMap.input} {...props} />
      {error ? <span className={styles.errorText}>{error}</span> : hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}

export function GovernanceBadge({ tone = 'info', children }) {
  const toneMap = {
    success: styles.badgeSuccess,
    warning: styles.badgeWarning,
    danger: styles.badgeDanger,
    info: styles.badgeInfo,
  };

  return <span className={`${styles.badge} ${toneMap[tone] || styles.badgeInfo}`}>{children}</span>;
}

export function GovernanceActionMenu({ items = [] }) {
  return (
    <details className={styles.actionMenu}>
      <summary className={styles.menuButton}>
        <FiMoreHorizontal size={18} />
      </summary>
      <div className={styles.menuPanel}>
        {items.map((item) => (
          <button key={item.label} type="button" className={styles.menuItem} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </div>
    </details>
  );
}
