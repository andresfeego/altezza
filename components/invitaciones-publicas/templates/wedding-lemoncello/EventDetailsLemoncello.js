import { FiArrowUpRight } from 'react-icons/fi';
import { formatDateInColombia, formatTimeInColombiaStable } from '@/components/utils/datetimeColombia';
import styles from './EventDetailsLemoncello.module.scss';

const dateLabel = value => formatDateInColombia(value, {
  options: { day: 'numeric', month: 'long', year: 'numeric' }, fallback: '',
});

export default function EventDetailsLemoncello({ data, eventStage }) {
  const invitation = data.invitacion || {};
  const events = [
    data.showCeremony && { key: 'ceremony', name: 'Ceremonia', date: invitation.fechaHoraCeremonia, place: invitation.lugarCeremonia, address: data.ceremonyAddress, map: data.ceremonyMapUrl, message: data.ceremonyMessage },
    data.showReception && { key: 'reception', name: 'Recepción', date: invitation.fechaHoraRecepcion, place: invitation.lugarRecepcion, address: data.receptionAddress, map: data.receptionMapUrl, message: data.receptionMessage },
  ].filter(event => event && (!eventStage || event.key === eventStage));
  const sameDate = events.length > 0 && events.every(event => dateLabel(event.date) === dateLabel(events[0].date));

  return <section className={styles.details} aria-label={eventStage === 'ceremony' ? 'Ceremonia' : eventStage === 'reception' ? 'Recepción' : 'Lugares y horarios'}
    data-event-details data-single-event={Boolean(eventStage)}>
    {data.backgroundVideo ? <video className={styles.backgroundVideo} src={data.backgroundVideo} autoPlay muted loop playsInline aria-hidden="true" /> : null}
    {data.title ? <h2 className={styles.title}>{data.title}</h2> : null}
    {sameDate && events[0].date ? <p className={styles.date}>{dateLabel(events[0].date)}</p> : null}
    <div className={styles.events}>
      {events.map(event => <article className={styles.event} key={event.key} data-event={event.key}>
        <h3 className={styles.name}>{event.name}</h3>
        {event.date ? <time className={styles.time} dateTime={event.date}>
          {formatTimeInColombiaStable(event.date)}
          {!sameDate ? <span className={styles.date}>{dateLabel(event.date)}</span> : null}
        </time> : null}
        {event.place ? <p className={styles.place}>{event.place}</p> : null}
        {event.address ? <p className={styles.address}>{event.address}</p> : null}
        {event.message ? <p className={styles.message}>{event.message}</p> : null}
        {event.map ? <a className={styles.mapLink} href={event.map} target="_blank" rel="noreferrer" aria-label={`Ver ubicación de ${event.name.toLowerCase()}`}>
          Ver ubicación <FiArrowUpRight aria-hidden="true" />
        </a> : null}
      </article>)}
    </div>
  </section>;
}
