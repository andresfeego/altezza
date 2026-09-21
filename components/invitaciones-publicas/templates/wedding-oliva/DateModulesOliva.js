import { FiHeart } from 'react-icons/fi';
import CountdownView from '../../module-views/CountdownView';
import SaveTheDateCalendarView from '../../module-views/SaveTheDateCalendarView';
import styles from './DateModulesOliva.module.scss';

const padValue = (value) => String(value).padStart(2, '0');
const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

export function CountdownOliva({ data }) {
  return <CountdownView data={data} styles={styles} formatValue={padValue} />;
}

export function CalendarOliva({ data }) {
  return <SaveTheDateCalendarView data={data} styles={styles} weekdayLabels={WEEKDAYS} HeartIcon={FiHeart} animateNumbers={false} />;
}
