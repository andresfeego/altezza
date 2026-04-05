import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import styles from './ModalShell.module.scss';

function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

export default function ModalShell({
  eyebrow,
  title,
  description,
  onClose,
  footer,
  size = 'md',
  className = '',
  bodyClassName = '',
  children,
}) {
  const sizeClass = size === 'lg' ? styles.lg : styles.md;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={joinClasses(styles.modal, sizeClass, className)} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerCopy}>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            <h2 className={styles.title}>{title}</h2>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
            <FiX size={18} />
          </button>
        </div>

        <div className={joinClasses(styles.body, bodyClassName)}>{children}</div>

        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
