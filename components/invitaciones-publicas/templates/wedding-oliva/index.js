import { useCallback, useRef, useState } from 'react';
import { GiLinkedRings } from 'react-icons/gi';
import { PiCheersThin } from 'react-icons/pi';
import { FiArrowUpRight, FiHeart } from 'react-icons/fi';
import AttendanceConfirmView from '../../module-views/AttendanceConfirmView';
import MusicPlayerView from '../../module-views/MusicPlayerView';
import ModuleSurface from '../../ModuleSurface';
import { formatDateInColombia, formatTimeInColombiaStable } from '@/components/utils/datetimeColombia';
import BotanicalArt from './BotanicalArt';
import AttendanceFlowerOliva from './AttendanceFlowerOliva';
import EnvelopeOliva from './EnvelopeOliva';
import EnvelopeLightTrial, { LIGHT_TRIAL_DURATION_MS } from './EnvelopeLightTrial';
import EnvelopeLiftTrial, { LIFT_TRIAL_DURATION_MS } from './EnvelopeLiftTrial';
import liftTrialStyles from './EnvelopeLiftTrial.module.scss';
import HeroOliva from './HeroOliva';
import CoupleNamesOliva from './CoupleNamesOliva';
import BiblicalQuoteOliva from './BiblicalQuoteOliva';
import InstantPhotosOliva from './InstantPhotosOliva';
import useTextRevealOliva from './useTextRevealOliva';
import revealStyles from './TextRevealOliva.module.scss';
import { CalendarOliva, CountdownOliva } from './DateModulesOliva';
import templateStyles from './index.module.scss';
import interiorStyles from './interior.module.scss';
import { COMMON_MODULE_VIEWS } from '../../registry/commonModuleViews';
import HeroImage2ClassicView from '../../module-views/HeroImage2ClassicView';
import portableStyles from '../../module-views/portable.module.scss';
import debugStyles from './debug.module.scss';

// Keep the finished envelope's root palette and styles independent of the interior.
const styles = { ...portableStyles, ...templateStyles, ...interiorStyles };

// Set to false to hide module names and boundaries, as in Classic and Terracota.
const TEMPLATE_DEBUG = false;

// Temporary trials: 'lift', 'light', or false for the checkpoint's instant opening.
const ENVELOPE_EXIT_TRIAL = 'lift';

function ModuleFrame({ name, children }) {
  return (
    <div className={debugStyles.moduleFrame} data-oliva-module={name} data-debug-module={TEMPLATE_DEBUG ? name : undefined}>
      {TEMPLATE_DEBUG ? <span className={debugStyles.debugModuleLabel} aria-hidden="true">{name}</span> : null}
      {children}
    </div>
  );
}

const dateLabel = (value) => formatDateInColombia(value, {
  options: { day: 'numeric', month: 'long', year: 'numeric' }, fallback: '',
});
const timeLabel = formatTimeInColombiaStable;
function Family({ data }) {
  const groups = [
    ['Padres de la novia', data.parentsBride],
    ['Padres del novio', data.parentsGroom],
    ['Padrinos', data.godparents],
  ].filter(([, people]) => people.length);
  return (
    <section className={styles.family} aria-label="Nuestra familia">
      {data.coupleLabel ? <p className={styles.familyLead}>{data.coupleLabel}</p> : null}
      {data.title ? <h2 className={styles.sectionTitle}>{data.title}</h2> : null}
      <div className={styles.familyGroups}>
        {groups.map(([label, people]) => (
          <div className={styles.familyGroup} key={label}>
            <h3>{label}</h3>
            <ul>{people.map((person) => <li key={person.name}>{person.name}{person.isDeceased ? <span aria-label="Fallecido"> †</span> : null}</li>)}</ul>
          </div>
        ))}
      </div>
      <FiHeart className={styles.familyHeart} aria-hidden="true" />
    </section>
  );
}

function Details({ data }) {
  const invitation = data.invitacion || {};
  const events = [
    data.showCeremony && { name: 'Ceremonia', Icon: GiLinkedRings, date: invitation.fechaHoraCeremonia, place: invitation.lugarCeremonia, address: data.ceremonyAddress, map: data.ceremonyMapUrl, message: data.ceremonyMessage },
    data.showReception && { name: 'Recepción', Icon: PiCheersThin, date: invitation.fechaHoraRecepcion, place: invitation.lugarRecepcion, address: data.receptionAddress, map: data.receptionMapUrl, message: data.receptionMessage },
  ].filter(Boolean);
  return (
    <section className={styles.details} aria-label="Lugares y horarios">
      {data.backgroundVideo ? <video className={styles.detailsVideo} src={data.backgroundVideo} autoPlay muted loop playsInline aria-hidden="true" /> : null}
      {data.title ? <p className={styles.eyebrow}>{data.title}</p> : null}
      {events.map((event) => (
        <article className={styles.event} key={event.name}>
          <event.Icon className={styles.eventIcon} aria-hidden="true" />
          {event.date ? <time className={styles.eventTime} dateTime={event.date}>{timeLabel(event.date)}<span className={styles.eventDate}>{dateLabel(event.date)}</span></time> : null}
          <h2 className={styles.eventTitle}>{event.name}</h2>
          <h3 className={styles.place}>{event.place}</h3>
          {event.address ? <p className={styles.address}>{event.address}</p> : null}
          {event.message ? <p className={styles.eventMessage}>{event.message}</p> : null}
          {event.map ? <a className={styles.mapLink} href={event.map} target="_blank" rel="noreferrer">Ver ubicación <FiArrowUpRight aria-hidden="true" /><span className={styles.srOnly}> de {event.name.toLowerCase()}</span></a> : null}
        </article>
      ))}
    </section>
  );
}

function Attendance({ data, attendanceState }) {
  const lastDay = data.deadline ? dateLabel(new Date(new Date(data.deadline).getTime() - 1)) : '';
  return (
    <section className={styles.rsvp} aria-label="Confirmar asistencia">
      <AttendanceFlowerOliva />
      <AttendanceConfirmView
        data={data}
        styles={styles}
        attendanceState={attendanceState}
        introFooter={lastDay ? <p className={styles.deadline}>Confirma hasta el <span>{lastDay}</span></p> : null}
      />
    </section>
  );
}

function Closing({ data }) {
  return (
    <footer className={styles.footer}>
      {data.showFrame !== false ? (data.frameImage ? <img className={styles.footerFlorals} src={data.frameImage} alt={data.frameImageAlt} /> : <BotanicalArt className={styles.footerFlorals} />) : null}
      <p className={styles.closingText}>{data.message}</p>
    </footer>
  );
}

export const MODULE_COMPONENTS = {
  ...COMMON_MODULE_VIEWS,
  envelop_intro: EnvelopeOliva,
  hero_image_1: HeroOliva,
  hero_image_2: HeroImage2ClassicView,
  biblical_quote: BiblicalQuoteOliva,
  couple_family: Family,
  couple_names: CoupleNamesOliva,
  countdown: CountdownOliva,
  save_the_date_calendar: CalendarOliva,
  event_details: Details,
  attendance_confirm: Attendance,
  closing_message: Closing,
  instant_photos: InstantPhotosOliva,
};

export default function WeddingOlivaTemplate({ resolvedModules, attendanceState }) {
  const envelope = resolvedModules.find((module) => module.type === 'envelop_intro');
  const music = resolvedModules.find((module) => module.type === 'music_player');
  const [opened, setOpened] = useState(!envelope);
  const [lightOrigin, setLightOrigin] = useState(null);
  const [lifting, setLifting] = useState(false);
  const openingRef = useRef(false);
  const contentRef = useRef(null);
  const envelopeData = envelope?.data || {};
  useTextRevealOliva(contentRef, opened);

  const openInvitation = useCallback(() => {
    setOpened(true);
    requestAnimationFrame(() => {
      contentRef.current?.querySelector('[data-oliva-title]')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, []);

  const finishLightTrial = useCallback(() => setLightOrigin(null), []);
  const finishLiftTrial = useCallback(() => {
    setLifting(false);
    openInvitation();
  }, [openInvitation]);

  function startOpening(event) {
    if (openingRef.current) return;
    openingRef.current = true;
    // Keep music activation in the user's gesture, before any animation timer.
    window.dispatchEvent(new Event('envelopIntro:open'));
    if (!ENVELOPE_EXIT_TRIAL || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      openInvitation();
      return;
    }
    if (ENVELOPE_EXIT_TRIAL === 'lift') {
      setLifting(true);
      return;
    }
    const button = event.currentTarget;
    const { left: x, top: y } = button.getBoundingClientRect();
    setLightOrigin({
      x,
      y,
      diameter: Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 3.4,
      color: window.getComputedStyle(button).getPropertyValue('--oliva-paper').trim(),
    });
  }

  return (
    <main className={`${styles.page} ${!opened ? styles.pageEnvelope : styles.pageOpen} ${lifting ? liftTrialStyles.page : ''}`}>
      {music ? <ModuleSurface background={music.config?.sectionBackground}><MusicPlayerView data={music.data} styles={styles} /></ModuleSurface> : null}
      {!opened ? (
        <div className={lifting ? liftTrialStyles.stage : undefined}>
          <ModuleFrame name="envelop_intro">
            <ModuleSurface background={envelope?.config?.sectionBackground}>
              <EnvelopeOliva data={envelopeData} onOpen={startOpening} opening={lifting || Boolean(lightOrigin)} openingVariant={ENVELOPE_EXIT_TRIAL} openingDuration={lifting ? LIFT_TRIAL_DURATION_MS : LIGHT_TRIAL_DURATION_MS} />
            </ModuleSurface>
          </ModuleFrame>
        </div>
      ) : null}
      <div ref={contentRef} hidden={!opened && !lifting} inert={lifting ? '' : undefined} aria-hidden={lifting || undefined} className={`${styles.paper} ${revealStyles.scope}`}>
        {resolvedModules.filter((module) => !['envelop_intro', 'music_player'].includes(module.type)).map((module) => {
          const View = MODULE_COMPONENTS[module.type];
          if (!View) return null;
          return (
            <ModuleFrame key={`${module.type}-${module.order}`} name={module.type}>
              <ModuleSurface background={module.config?.sectionBackground}>
                <View data={module.data} styles={styles} attendanceState={attendanceState} />
              </ModuleSurface>
            </ModuleFrame>
          );
        })}
      </div>
      {lightOrigin ? <EnvelopeLightTrial origin={lightOrigin} onCovered={openInvitation} onComplete={finishLightTrial} /> : null}
      {lifting ? <EnvelopeLiftTrial onComplete={finishLiftTrial} /> : null}
    </main>
  );
}
