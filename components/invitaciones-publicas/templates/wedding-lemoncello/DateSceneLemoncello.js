import { FiHeart } from 'react-icons/fi';
import CountdownView from '../../module-views/CountdownView';
import SaveTheDateCalendarView from '../../module-views/SaveTheDateCalendarView';
import tiles from './assets/images/date-maiolica-v1.webp';
import branch from './assets/images/date-lemon-branch-v1.webp';
import styles from './DateSceneLemoncello.module.scss';

const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const padValue = value => String(value).padStart(2, '0');
const src = asset => typeof asset === 'string' ? asset : asset.src;

export function CountdownLemoncello({ data }) {
  return <CountdownView data={data} styles={styles} formatValue={padValue} />;
}

export function CalendarLemoncello({ data }) {
  return <SaveTheDateCalendarView data={data} styles={styles} weekdayLabels={WEEKDAYS} HeartIcon={FiHeart} animateNumbers={false} />;
}

export function StationerySceneLemoncello({ children, className = '', variant = 'date' }) {
  return <div className={`${styles.scene} ${className}`} data-stationery-scene={variant} data-date-scene={variant === 'date' ? '' : undefined}>
    <img className={`${styles.tiles} ${styles.topTiles}`} src={src(tiles)} alt="" data-invitation-preload />
    <div className={styles.writing} data-date-content>{children}</div>
    <img className={`${styles.tiles} ${styles.bottomTiles}`} src={src(tiles)} alt="" data-invitation-preload />
    <img className={styles.branch} src={src(branch)} alt="" data-date-branch data-invitation-preload />
  </div>;
}

export default function DateSceneLemoncello({ children }) {
  return <StationerySceneLemoncello>{children}</StationerySceneLemoncello>;
}
