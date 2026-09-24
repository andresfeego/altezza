import AttendanceConfirmView from '../../module-views/AttendanceConfirmView';
import { formatDateInColombia } from '@/components/utils/datetimeColombia';
import styles from './AttendanceLemoncello.module.scss';

function Ribbon({ bottom = false }) {
  return <svg className={`${styles.ribbon} ${bottom ? styles.ribbonBottom : ''}`} viewBox="0 0 480 96" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0H480V16C396 2 342 62 240 42S84 10 0 60Z" />
    <path d="M0 19C102-12 146 77 254 55S393 12 480 41" />
    <path d="M0 39C87 1 150 92 258 68S393 28 480 57" />
  </svg>;
}

export default function AttendanceLemoncello({ data, attendanceState }) {
  const lastDay = data.deadline ? formatDateInColombia(new Date(new Date(data.deadline).getTime() - 1), {
    options: { day: 'numeric', month: 'long', year: 'numeric' }, fallback: '',
  }) : '';
  return <section className={styles.scene} aria-label="Confirmar asistencia" data-attendance-scene>
    <Ribbon />
    <div className={styles.scroll} data-attendance-scroll tabIndex={0} role="region" aria-label="Invitados y confirmación de asistencia">
      <div className={styles.content}>
        <AttendanceConfirmView data={data} styles={styles} attendanceState={attendanceState}
          introFooter={lastDay ? <p className={styles.deadline}>Confirma hasta el <span>{lastDay}</span></p> : null} />
      </div>
    </div>
    <Ribbon bottom />
  </section>;
}
