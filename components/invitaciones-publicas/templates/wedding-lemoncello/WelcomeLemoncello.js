import board from './assets/images/welcome-board-v1.webp';
import styles from './WelcomeLemoncello.module.scss';

export default function WelcomeLemoncello({ data = {} }) {
  const message = data.personalizedMessage || data.subtitle;
  return <div className={styles.welcome}>
    <div className={styles.board}>
      <img className={styles.artwork} src={typeof board === 'string' ? board : board.src} alt="" data-invitation-preload />
      <div className={styles.writing}>
        {data.title ? <h2 className={styles.title}>{data.title}</h2> : null}
        {data.inviteeName ? <p className={styles.invitee}>Para {data.inviteeName}</p> : null}
        {message ? <p className={styles.message}>{message}</p> : null}
      </div>
    </div>
  </div>;
}
