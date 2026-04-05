import { FiMoreHorizontal } from 'react-icons/fi';
import styles from './ActionMenu.module.scss';

function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

export default function ActionMenu({
  open = false,
  onToggle,
  align = 'right',
  items = [],
  triggerLabel = 'Abrir acciones',
  className = '',
}) {
  const alignClass = align === 'left' ? styles.left : styles.right;

  return (
    <div className={joinClasses(styles.wrap, className)}>
      <button
        type="button"
        className={styles.trigger}
        onClick={onToggle}
        aria-label={triggerLabel}
      >
        <FiMoreHorizontal size={16} />
      </button>

      {open ? (
        <div className={joinClasses(styles.panel, alignClass)}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.item}
              onClick={item.onClick}
              disabled={item.disabled}
            >
              {item.icon ? <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span> : null}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
