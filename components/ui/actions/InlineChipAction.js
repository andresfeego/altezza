import styles from './InlineChipAction.module.scss';

export default function InlineChipAction({
  label,
  actionLabel,
  onAction,
  disabled = false,
}) {
  return (
    <span className={styles.chip}>
      <span>{label}</span>
      {actionLabel ? (
        <button type="button" className={styles.action} onClick={onAction} disabled={disabled}>
          {actionLabel}
        </button>
      ) : null}
    </span>
  );
}
