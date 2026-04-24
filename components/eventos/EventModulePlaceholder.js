import shellStyles from '@/components/home/AdminHome.module.scss';
import styles from './EventModulePlaceholder.module.scss';

export default function EventModulePlaceholder({ title, description, note }) {
  return (
    <div className={shellStyles.content}>
      <main className={styles.page}>
        <section className={styles.card}>
          <p className={styles.eyebrow}>Modulo en construccion</p>
          <h1>{title}</h1>
          <p className={styles.description}>{description}</p>
          {note ? <p className={styles.note}>{note}</p> : null}
        </section>
      </main>
    </div>
  );
}
