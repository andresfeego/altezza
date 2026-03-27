import Link from 'next/link';
import styles from './FeedModulePreview.module.scss';

export default function FeedModulePreview({ title, description, href }) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Resumen del modulo</p>
        <h3>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.action}>Ver modulo</span>
      </div>
    </Link>
  );
}
