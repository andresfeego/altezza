import shellStyles from './AdminHome.module.scss';
import styles from './RoleHomePlaceholder.module.scss';

export default function RoleHomePlaceholder({ title, description }) {
  return (
    <div className={shellStyles.content}>
      <main className={styles.page}>
        <section className={styles.card}>
          <p className={styles.eyebrow}>Superficie en preparacion</p>
          <h1>{title}</h1>
          <p className={styles.description}>{description}</p>
        </section>
      </main>
    </div>
  );
}
