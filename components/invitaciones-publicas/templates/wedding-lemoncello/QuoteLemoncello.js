import board from './assets/images/quote-ivory-easel-v2.webp';
import ornament from './assets/images/quote-lemon-ornament-v1.webp';
import styles from './QuoteLemoncello.module.scss';

const src = image => typeof image === 'string' ? image : image.src;

// The board is presentation only; content is the shared biblical_quote contract.
export default function QuoteLemoncello({ data = {} }) {
  return <div className={styles.quote}>
    <div className={styles.board} data-quote-easel>
      <img className={styles.artwork} src={src(board)} alt="" data-invitation-preload />
      <div className={styles.writing}>
        {data.passageText ? <p className={styles.message}>{data.passageText}</p> : null}
        {data.passageReference ? <p className={styles.reference}>{data.passageReference}</p> : null}
        {data.passageText || data.passageReference ? <img className={styles.ornament} src={src(ornament)} alt="" data-invitation-preload /> : null}
      </div>
    </div>
  </div>;
}
