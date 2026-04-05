import styles from './Button.module.scss';

function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

export default function Button({
  as = 'button',
  type = 'button',
  href,
  target,
  rel,
  iconLeading,
  children,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const Component = as;
  const variantClass = variant === 'secondary'
    ? styles.secondary
    : variant === 'ghost'
      ? styles.ghost
      : styles.primary;

  const props = as === 'a'
    ? { href, target, rel, onClick, ...rest }
    : { type, disabled, onClick, ...rest };

  return (
    <Component
      className={joinClasses(styles.button, variantClass, fullWidth ? styles.fullWidth : '', className)}
      {...props}
    >
      {iconLeading ? <span className={styles.icon} aria-hidden="true">{iconLeading}</span> : null}
      <span className={styles.label}>{children}</span>
    </Component>
  );
}
