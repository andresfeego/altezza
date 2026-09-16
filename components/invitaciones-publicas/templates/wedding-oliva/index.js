import { useRef, useState } from 'react';
import { GiLinkedRings } from 'react-icons/gi';
import { PiCheersThin } from 'react-icons/pi';
import { BsCalendarHeart } from 'react-icons/bs';
import { FiArrowUpRight, FiHeart } from 'react-icons/fi';
import AttendanceConfirmView from '../../module-views/AttendanceConfirmView';
import CountdownView from '../../module-views/CountdownView';
import MusicPlayerView from '../../module-views/MusicPlayerView';
import PhotoSliderView from '../../module-views/PhotoSliderView';
import SimpleImageView from '../../module-views/SimpleImageView';
import WelcomeMessageView from '../../module-views/WelcomeMessageView';
import { formatDateInColombia, formatTimeInColombiaStable, getDatePartsInColombia } from '@/components/utils/datetimeColombia';
import BotanicalArt from './BotanicalArt';
import EnvelopeOliva from './EnvelopeOliva';
import templateStyles from './index.module.scss';
import interiorStyles from './interior.module.scss';
import debugStyles from './debug.module.scss';

// Keep the finished envelope's root palette and styles independent of the interior.
const styles = { ...templateStyles, ...interiorStyles };

// Set to false to hide module names and boundaries, as in Classic and Terracota.
const TEMPLATE_DEBUG = true;

function ModuleFrame({ name, children }) {
  return (
    <div className={debugStyles.moduleFrame} data-debug-module={TEMPLATE_DEBUG ? name : undefined}>
      {TEMPLATE_DEBUG ? <span className={debugStyles.debugModuleLabel} aria-hidden="true">{name}</span> : null}
      {children}
    </div>
  );
}

const dateLabel = (value) => formatDateInColombia(value, {
  options: { day: 'numeric', month: 'long', year: 'numeric' }, fallback: '',
});
const timeLabel = formatTimeInColombiaStable;
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function EditorialDate({ value }) {
  const date = getDatePartsInColombia(value);
  if (!date) return null;

  return (
    <time className={styles.heroDate} dateTime={value} aria-label={dateLabel(value)}>
      <span className={styles.dateMonth}>{MONTHS[date.month - 1]}</span>
      <span className={styles.dateDay}>{date.dayLabel}</span>
      <span className={styles.dateYear}>{date.year}</span>
    </time>
  );
}

function Hero({ data }) {
  return (
    <header className={styles.hero}>
      <BotanicalArt className={styles.heroFlorals} eager />
      <p className={styles.eyebrow}>Nos casamos</p>
      <h1 tabIndex={-1} data-oliva-title className={styles.coupleNames}>
        {data.brideName && data.groomName ? <>{data.brideName}<em>&</em>{data.groomName}</> : data.coupleNames}
      </h1>
      <EditorialDate value={data.date} />
      <span className={styles.rule} aria-hidden="true" />
      {data.message ? <p className={styles.heroMessage}>{data.message}</p> : null}
      {data.imageSrc ? <img className={styles.heroPhoto} src={data.imageSrc} alt={data.imageAlt} /> : null}
      <p className={styles.smallLabel}>Una vida en común</p>
      <BotanicalArt className={styles.heroBottomFlorals} />
    </header>
  );
}

function Family({ data }) {
  const groups = [
    ['Padres de la novia', data.parentsBride],
    ['Padres del novio', data.parentsGroom],
    ['Padrinos', data.godparents],
  ].filter(([, people]) => people.length);
  return (
    <section className={styles.family} aria-label="Nuestra familia">
      <p className={styles.eyebrow}>Con quienes nos han acompañado</p>
      <h2 className={styles.sectionTitle}>Nuestras raíces</h2>
      <div className={styles.familyGroups}>
        {groups.map(([label, people]) => (
          <div className={styles.familyGroup} key={label}>
            <h3>{label}</h3>
            <ul>{people.map((person) => <li key={person.name}>{person.name}{person.isDeceased ? <span aria-label="Fallecido"> †</span> : null}</li>)}</ul>
          </div>
        ))}
      </div>
      {data.message ? <p className={styles.familyMessage}>{data.message}</p> : null}
      <FiHeart className={styles.familyHeart} aria-hidden="true" />
    </section>
  );
}

function Details({ data }) {
  const invitation = data.invitacion || {};
  const events = [
    data.showCeremony && { name: 'Ceremonia', Icon: GiLinkedRings, date: invitation.fechaHoraCeremonia, place: invitation.lugarCeremonia, address: data.ceremonyAddress, map: data.ceremonyMapUrl || invitation.ceremonyMapUrl, message: data.ceremonyMessage },
    data.showReception && { name: 'Recepción', Icon: PiCheersThin, date: invitation.fechaHoraRecepcion, place: invitation.lugarRecepcion, address: data.receptionAddress, map: data.receptionMapUrl || invitation.receptionMapUrl, message: data.receptionMessage },
  ].filter(Boolean);
  return (
    <section className={styles.details} aria-label="Lugares y horarios">
      <BotanicalArt variant="sprig" className={styles.detailsSprig} />
      <p className={styles.eyebrow}>El día que soñamos</p>
      {events.map((event) => (
        <article className={styles.event} key={event.name}>
          <event.Icon className={styles.eventIcon} aria-hidden="true" />
          {event.date ? <time className={styles.eventTime} dateTime={event.date}>{timeLabel(event.date)}</time> : null}
          <h2 className={styles.eventTitle}>{event.name}</h2>
          <h3 className={styles.place}>{event.place}</h3>
          {event.address ? <p className={styles.address}>{event.address}</p> : null}
          {event.message ? <p className={styles.eventMessage}>{event.message}</p> : null}
          {event.map ? <a className={styles.mapLink} href={event.map} target="_blank" rel="noreferrer">Ver ubicación <FiArrowUpRight aria-hidden="true" /><span className={styles.srOnly}> de {event.name.toLowerCase()}</span></a> : null}
        </article>
      ))}
      <BotanicalArt className={styles.detailsFlorals} />
    </section>
  );
}

function Attendance({ data, attendanceState }) {
  const lastDay = data.deadline ? dateLabel(new Date(new Date(data.deadline).getTime() - 1)) : '';
  return (
    <section className={styles.rsvp}>
      <BsCalendarHeart className={styles.rsvpIcon} aria-hidden="true" />
      <p className={styles.eyebrow}>Nos encantará verte</p>
      {data.introMessage ? <p className={styles.rsvpMessage}>{data.introMessage}</p> : null}
      {lastDay ? <p className={styles.deadline}>Confirma hasta el {lastDay}</p> : null}
      <AttendanceConfirmView data={data} styles={styles} attendanceState={attendanceState} />
    </section>
  );
}

const MODULE_COMPONENTS = {
  hero_image_1: Hero,
  couple_family: Family,
  event_details: Details,
  countdown: CountdownView,
  attendance_confirm: Attendance,
  photo_slider: PhotoSliderView,
  simple_image: SimpleImageView,
  welcome_message: WelcomeMessageView,
};

export default function WeddingOlivaTemplate({ resolvedModules, attendanceState, evento }) {
  const envelope = resolvedModules.find((module) => module.type === 'envelop_intro');
  const music = resolvedModules.find((module) => module.type === 'music_player');
  const [opened, setOpened] = useState(!envelope);
  const contentRef = useRef(null);
  const envelopeData = envelope?.data || {};

  function openInvitation() {
    setOpened(true);
    window.dispatchEvent(new Event('envelopIntro:open'));
    requestAnimationFrame(() => {
      contentRef.current?.querySelector('[data-oliva-title]')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }

  return (
    <main className={`${styles.page} ${!opened ? styles.pageEnvelope : styles.pageOpen}`}>
      {music ? <MusicPlayerView data={music.data} styles={styles} /> : null}
      {!opened ? (
        <ModuleFrame name="envelop_intro">
          <EnvelopeOliva data={envelopeData} onOpen={openInvitation} />
        </ModuleFrame>
      ) : null}
      <div ref={contentRef} hidden={!opened} className={styles.paper}>
        {resolvedModules.filter((module) => !['envelop_intro', 'music_player'].includes(module.type)).map((module) => {
          const View = MODULE_COMPONENTS[module.type];
          if (!View) return null;
          return (
            <ModuleFrame key={`${module.type}-${module.order}`} name={module.type}>
              <View data={module.data} styles={styles} attendanceState={attendanceState} />
            </ModuleFrame>
          );
        })}
        <ModuleFrame name="footer">
          <footer className={styles.footer}>
            <BotanicalArt className={styles.footerFlorals} />
            <p className={styles.eyebrow}>Con mucho cariño</p>
            <p className={styles.footerNames}>{evento?.nombre}</p>
            <span className={styles.smallLabel}>Altezza · Eventos inolvidables</span>
          </footer>
        </ModuleFrame>
      </div>
    </main>
  );
}
