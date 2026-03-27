import Image from 'next/image';
import { useRouter } from 'next/router';
import { MdImage } from 'react-icons/md';
import shellStyles from './AdminHome.module.scss';
import styles from './ClienteHome.module.scss';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import useEventoStore from '@/components/initialized/stored/useEventoStore';
import { getAssignedEvents } from '@/components/constants/eventContext';

export default function ClienteHome() {
  const router = useRouter();
  const dataUsuario = useUsuarioStore((state) => state.dataUsuario);
  const setEventoActivoById = useEventoStore((state) => state.setEventoActivoById);
  const eventosAsignados = getAssignedEvents(dataUsuario);
  const nombreUsuario = dataUsuario?.nombres || dataUsuario?.user || 'Cliente';
  const totalEventos = eventosAsignados.length;

  return (
    <div className={shellStyles.content}>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Cliente Home</p>
            <h1>Mis eventos</h1>
            <p className={styles.lead}>
              {totalEventos === 0
                ? `Hola, ${nombreUsuario}. Aun no tienes eventos asignados, pero esta sera tu entrada principal cuando el equipo vincule tu cuenta.`
                : `Hola, ${nombreUsuario}. Selecciona el evento con el que quieres continuar para cargar su navegacion y sus modulos activos.`}
            </p>
          </div>

          {totalEventos > 0 ? (
            <div className={styles.eventBadge}>
              <span className={styles.badgeLabel}>Eventos disponibles</span>
              <strong>{totalEventos}</strong>
            </div>
          ) : (
            <div className={`${styles.eventBadge} ${styles.eventBadgeMuted}`}>
              <span className={styles.badgeLabel}>Estado actual</span>
              <strong>Sin eventos asignados</strong>
            </div>
          )}
        </section>

        {totalEventos > 1 ? (
          <section className={styles.eventGrid}>
            {eventosAsignados.map((evento) => {
              const tieneImagen = Boolean(evento?.imagenPrincipal);

              return (
                <article key={evento.id} className={styles.eventCard}>
                  <div className={styles.eventMedia}>
                    {tieneImagen ? (
                      <Image
                        src={evento.imagenPrincipal}
                        alt={`Imagen del evento ${evento.nombre || evento.id}`}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className={styles.eventPlaceholder}>
                        <MdImage size={40} />
                      </div>
                    )}
                  </div>

                  <div className={styles.eventBody}>
                    <div className={styles.eventHeader}>
                      <h3>{evento.nombre || evento.id}</h3>
                      <span className={styles.eventTag}>
                        {evento.estado ? 'Activo' : 'Pendiente'}
                      </span>
                    </div>
                    <p>
                      {evento.tipoEvento
                        ? `${evento.tipoEvento}.`
                        : 'Evento disponible para tu cuenta.'}
                    </p>
                    <button
                      type="button"
                      className={styles.primaryAction}
                      onClick={() => {
                        setEventoActivoById(evento.id);
                        router.push(`/evento/feed/${evento.id}`);
                      }}
                    >
                      Ir al feed del evento
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              AE
            </div>
            <div className={styles.emptyCopy}>
              <h2>Aun no tienes eventos asignados</h2>
              <p>
                Cuando el equipo administrativo vincule tu usuario a un evento, este espacio mostrara
                tus accesos disponibles o te llevara de forma directa al feed si solo existe un evento.
              </p>
            </div>
            <div className={styles.emptyGuidance}>
              <h3>Mientras tanto</h3>
              <ul className={styles.list}>
                <li>Tu sesion ya esta lista y persistida.</li>
                <li>El menu se mantiene sin modulos hasta tener un evento activo.</li>
                <li>Las rutas de evento deben redirigir aqui hasta tener una seleccion valida.</li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
