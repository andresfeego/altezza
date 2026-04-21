function formatDateTime(value) {
  if (!value) return null;

  const date = new Date(value);
  return {
    date: date.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: date.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
}

export default function EventDetailsView({ data, styles }) {
  const ceremonia = formatDateTime(data.invitacion?.fechaHoraCeremonia);
  const recepcion = formatDateTime(data.invitacion?.fechaHoraRecepcion);

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
          {data.showCeremony ? (
            <article className={styles.detailSurface}>
              <h3>Ceremonia</h3>
              <dl>
                <div>
                  <dt>Lugar</dt>
                  <dd>{data.invitacion?.lugarCeremonia || 'Pendiente por definir'}</dd>
                </div>
                <div>
                  <dt>Fecha</dt>
                  <dd>{ceremonia?.date || 'Pendiente por definir'}</dd>
                </div>
                <div>
                  <dt>Hora</dt>
                  <dd className={styles.detailValueWithAction}>
                    <span>{ceremonia?.time || 'Pendiente por definir'}</span>
                    {data.invitacion?.ceremonyMapUrl ? (
                      <a
                        className={styles.detailAction}
                        href={data.invitacion.ceremonyMapUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Como llegar
                      </a>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </article>
          ) : null}
          {data.showReception ? (
            <article className={styles.detailSurface}>
              <h3>Recepcion</h3>
              <dl>
                <div>
                  <dt>Lugar</dt>
                  <dd>{data.invitacion?.lugarRecepcion || 'Pendiente por definir'}</dd>
                </div>
                <div>
                  <dt>Fecha</dt>
                  <dd>{recepcion?.date || ceremonia?.date || 'Pendiente por definir'}</dd>
                </div>
                <div>
                  <dt>Hora</dt>
                  <dd className={styles.detailValueWithAction}>
                    <span>{recepcion?.time || 'Pendiente por definir'}</span>
                    {data.invitacion?.receptionMapUrl ? (
                      <a
                        className={styles.detailAction}
                        href={data.invitacion.receptionMapUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Como llegar
                      </a>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
