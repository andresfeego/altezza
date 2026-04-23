import {
  FaCalendarAlt,
  FaChurch,
  FaGlassCheers,
  FaLocationArrow,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const CARD_TIMEZONE = 'America/Bogota';

function formatDateTime(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const dateKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: CARD_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  const timeKey = new Intl.DateTimeFormat('en-GB', {
    timeZone: CARD_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return {
    date: date.toLocaleDateString('es-CO', {
      timeZone: CARD_TIMEZONE,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('es-CO', {
      timeZone: CARD_TIMEZONE,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    dateKey,
    timeKey,
  };
}

export default function EventDetailsView({ data, styles }) {
  const ceremonia = formatDateTime(data.invitacion?.fechaHoraCeremonia);
  const recepcion = formatDateTime(data.invitacion?.fechaHoraRecepcion);
  const ceremonyLocation = String(data.invitacion?.lugarCeremonia || '').trim();
  const receptionLocation = String(data.invitacion?.lugarRecepcion || '').trim();

  const samePlace = Boolean(ceremonyLocation) && ceremonyLocation === receptionLocation;
  const sameDate = Boolean(ceremonia?.dateKey) && ceremonia?.dateKey === recepcion?.dateKey;
  const sharedMapUrl = data.invitacion?.ceremonyMapUrl || data.invitacion?.receptionMapUrl || null;

  return (
    <section className={`${styles.moduleCard} ${styles.eventDetailsModule}`}>
      {data.backgroundVideo ? (
        <video
          className={styles.eventDetailsBackground}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={data.backgroundVideo} type="video/mp4" />
        </video>
      ) : null}
      <div className={styles.eventDetailsContent}>
        <div className={styles.detailsGrid}>
          <article className={styles.detailSurface}>
            <dl className={styles.detailSummary}>
              {data.showCeremony ? (
                <div>
                  <dt>
                    <span className={styles.detailLabel}>
                      <FaChurch className={styles.detailLabelIcon} aria-hidden="true" />
                      <span>Ceremonia</span>
                    </span>
                  </dt>
                  <dd>{ceremonia?.time || 'Pendiente por definir'}</dd>
                </div>
              ) : null}
              {data.showReception ? (
                <div>
                  <dt>
                    <span className={styles.detailLabel}>
                      <FaGlassCheers className={styles.detailLabelIcon} aria-hidden="true" />
                      <span>Recepcion</span>
                    </span>
                  </dt>
                  <dd>{recepcion?.time || 'Pendiente por definir'}</dd>
                </div>
              ) : null}
              <div>
                <dt>
                  <span className={styles.detailLabel}>
                    <FaCalendarAlt className={styles.detailLabelIcon} aria-hidden="true" />
                    <span>Fecha</span>
                  </span>
                </dt>
                <dd>
                  {sameDate
                    ? (ceremonia?.date || recepcion?.date || 'Pendiente por definir')
                    : `Ceremonia: ${ceremonia?.date || 'Pendiente'} · Recepcion: ${recepcion?.date || 'Pendiente'}`}
                </dd>
              </div>
              <div>
                <dt>
                  <span className={styles.detailLabel}>
                    <FaMapMarkerAlt className={styles.detailLabelIcon} aria-hidden="true" />
                    <span>Lugar</span>
                  </span>
                </dt>
                <dd>
                  {samePlace
                    ? (ceremonyLocation || receptionLocation || 'Pendiente por definir')
                    : `Ceremonia: ${ceremonyLocation || 'Pendiente'} · Recepcion: ${receptionLocation || 'Pendiente'}`}
                </dd>
              </div>
              <div>
                <dt>
                  <span className={styles.detailLabel}>
                    <FaLocationArrow className={styles.detailLabelIcon} aria-hidden="true" />
                    <span>Ubicacion</span>
                  </span>
                </dt>
                <dd className={styles.detailValueWithAction}>
                  {samePlace && sharedMapUrl ? (
                    <a
                      className={styles.detailAction}
                      href={sharedMapUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Como llegar
                    </a>
                  ) : (
                    <>
                      {data.invitacion?.ceremonyMapUrl ? (
                        <a
                          className={styles.detailAction}
                          href={data.invitacion.ceremonyMapUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ceremonia
                        </a>
                      ) : null}
                      {data.invitacion?.receptionMapUrl ? (
                        <a
                          className={styles.detailAction}
                          href={data.invitacion.receptionMapUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Recepcion
                        </a>
                      ) : null}
                    </>
                  )}
                </dd>
              </div>
            </dl>

          </article>
        </div>
      </div>
    </section>
  );
}
