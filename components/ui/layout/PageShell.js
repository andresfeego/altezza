import styles from './PageShell.module.scss';

function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

export default function PageShell({
  children,
  surface = 'admin',
  className = '',
  contentClassName = '',
}) {
  const surfaceClass = surface === 'basic'
    ? styles.basic
    : surface === 'home'
      ? styles.home
      : surface === 'event'
        ? styles.event
        : styles.admin;

  return (
    <div className={joinClasses(styles.shell, className)}>
      <div className={joinClasses(styles.content, surfaceClass, contentClassName)}>
        {children}
      </div>
    </div>
  );
}
