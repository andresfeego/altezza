import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  FiCheckCircle,
  FiImage,
  FiLayers,
  FiMapPin,
} from 'react-icons/fi';
import shellStyles from '@/components/admin/shared/AdminModuleShell.module.scss';
import AdminEventoModulesManager from '@/components/admin/eventos/AdminEventoModulesManager';
import { ADMIN_EVENT_SECTIONS, getAdminEventoSectionHref } from '@/components/admin/eventos/adminEventoSections';
import { getDetalleEvento } from '@/components/initialized/data/helpersGetDB';
import { showError } from '@/components/initialized/Toast';
import styles from './AdminEventoWorkspace.module.scss';

function formatDate(value) {
  if (!value) return 'Sin fecha definida';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha definida';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

export default function AdminEventoWorkspace({ idEvento }) {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idEvento) return;

    let cancelled = false;

    async function loadEvento() {
      try {
        setLoading(true);
        const response = await getDetalleEvento(idEvento);
        if (cancelled) return;

        const detail = Array.isArray(response) ? response[0] : response;
        setEvento(detail || null);
      } catch (error) {
        if (cancelled) return;
        setEvento(null);
        showError('No fue posible cargar el workspace del evento.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvento();

    return () => {
      cancelled = true;
    };
  }, [idEvento]);

  const summaryItems = useMemo(() => {
    if (!evento) return [];

    return [
      {
        id: 'estado',
        icon: <FiCheckCircle />,
        metric: evento.estado ? 'Activo' : 'Inactivo',
        label: 'Estado del evento',
      },
      {
        id: 'fecha',
        icon: <FiLayers />,
        metric: formatDate(evento.fechaHoraRecepcion),
        label: 'Recepcion',
      },
      {
        id: 'lugar',
        icon: <FiMapPin />,
        metric: evento.nombreLugarRecepcion || 'Sin lugar definido',
        label: 'Lugar principal',
      },
    ];
  }, [evento]);

  const hasImage = Boolean(evento?.imagenPrincipal && evento.imagenPrincipal.length > 10);

  return (
    <div className={`${styles.page} ${shellStyles.page}`}>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {hasImage ? (
            <Image
              src={evento.imagenPrincipal}
              alt={`Imagen del evento ${evento.nombre}`}
              fill
              unoptimized
            />
          ) : (
            <div className={styles.mediaPlaceholder}>
              <FiImage />
            </div>
          )}

          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>{evento?.nombre || idEvento}</h1>
          </div>
        </div>
      </section>

      <section className={`${styles.sectionCard} ${shellStyles.sectionCard} ${styles.overlapCard}`}>
        <div className={shellStyles.sectionHeader}>
          <h2 className={shellStyles.sectionTitle}>Resumen</h2>
        </div>

        {loading ? (
          <div className={styles.inlineState}>
            <p>Cargando informacion del evento...</p>
          </div>
        ) : evento ? (
          <>
            <div className={styles.summaryBadges}>
              <span className={styles.metaPill}>{evento?.id || idEvento}</span>
              <span className={styles.metaPill}>{evento?.nombreTipoEvento || evento?.tipoEvento || 'Sin tipo definido'}</span>
              <span className={`${styles.metaPill} ${evento?.estado ? styles.metaPillActive : ''}`}>
                {evento?.estado ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className={styles.summaryRow}>
              {summaryItems.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryTop}>
                    <span className={styles.metricIcon}>{item.icon}</span>
                    <strong>{item.metric}</strong>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.inlineState}>
            <p>No encontramos el detalle del evento solicitado.</p>
          </div>
        )}
      </section>

      <section className={`${styles.sectionCard} ${shellStyles.sectionCard}`}>
        <div className={shellStyles.sectionHeader}>
          <h2 className={shellStyles.sectionTitle}>Accesos</h2>
        </div>

        <div className={styles.actionGrid}>
          {ADMIN_EVENT_SECTIONS.map((action) => (
            <Link
              key={action.id}
              href={getAdminEventoSectionHref(idEvento, action.id)}
              className={styles.actionItem}
            >
              <div className={styles.actionHead}>
                <span className={styles.actionIcon}>{action.icon}</span>
                <h3>{action.title}</h3>
              </div>
              <div className={styles.actionDivider} />
              <span className={styles.actionState}>{action.state}</span>
              <p>{action.message}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.sectionCard} ${shellStyles.sectionCard}`}>
        <div className={shellStyles.sectionHeader}>
          <h2 className={shellStyles.sectionTitle}>Modulos del cliente</h2>
        </div>

        {evento ? (
          <AdminEventoModulesManager evento={evento} />
        ) : (
          <div className={styles.inlineState}>
            <p>No fue posible cargar la configuracion de modulos sin un evento valido.</p>
          </div>
        )}
      </section>
    </div>
  );
}
