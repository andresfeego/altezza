import styles from './PageHeader.module.scss';

function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = 'right',
  className = '',
}) {
  const alignClass = align === 'left' ? styles.left : styles.right;

  return (
    <header className={joinClasses(styles.header, alignClass, className)}>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
