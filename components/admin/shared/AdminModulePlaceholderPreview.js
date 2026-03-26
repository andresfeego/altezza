import Link from 'next/link';
import styles from '@/components/admin/dashboard/AdminDashboard.module.scss';

export default function AdminModulePlaceholderPreview({
  href,
  icon,
  title,
  message = 'Preview temporal. Modulo en construccion.',
}) {
  return (
    <Link href={href} className={styles.previewCard}>
      <div className={styles.previewTop}>
        <span className={styles.previewIcon}>{icon}</span>
        <span className={styles.previewState}>Temporal</span>
      </div>
      <h3>{title}</h3>
      <p className={styles.previewText}>{message}</p>
    </Link>
  );
}
