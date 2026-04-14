import { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiPhone, FiXCircle } from 'react-icons/fi';
import Button from '@/components/ui/actions/Button';
import ModalShell from '@/components/ui/layout/ModalShell';
import { getInvitacionDetalle } from '@/components/initialized/data/helpersGetDB';
import { showError } from '@/components/initialized/Toast';
import styles from './invitados.module.scss';

function resolveParentescoLabel(value, parentescos) {
  const match = parentescos.find((item) => Number(item?.id) === Number(value));
  return match?.parentesco || 'Parentesco sin definir';
}

function resolveGrupoEdadLabel(value, gruposEdad) {
  const match = gruposEdad.find((item) => Number(item?.id) === Number(value));
  return match?.grupo || 'Grupo sin definir';
}

function resolveEstadoAsistenciaLabel(value) {
  switch (Number(value)) {
    case 1:
      return 'Asistire';
    case 2:
      return 'Quiza';
    case 3:
      return 'No asistire';
    case 0:
    default:
      return 'Sin confirmar';
  }
}

function getEstadoAsistenciaMeta(value) {
  switch (Number(value)) {
    case 1:
      return {
        label: 'Asistire',
        tone: 'success',
        icon: <FiCheckCircle />,
      };
    case 2:
      return {
        label: 'Quiza',
        tone: 'warning',
        icon: <FiClock />,
      };
    case 3:
      return {
        label: 'No asistire',
        tone: 'danger',
        icon: <FiXCircle />,
      };
    case 0:
    default:
      return {
        label: 'Sin confirmar',
        tone: 'info',
        icon: <FiAlertCircle />,
      };
  }
}

export default function InvitacionDetailModal({
  open,
  idInvitacion,
  invitadoNombre,
  parentescos = [],
  gruposEdad = [],
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [invitacion, setInvitacion] = useState(null);

  useEffect(() => {
    if (!open || !idInvitacion) {
      setInvitacion(null);
      return;
    }

    let cancelled = false;

    async function loadInvitacion() {
      try {
        setLoading(true);
        const response = await getInvitacionDetalle(idInvitacion);
        if (cancelled) return;
        const invitacionDetail = Array.isArray(response)
          ? response[0]
          : response?.invitacion || response;
        setInvitacion(invitacionDetail || null);
      } catch (error) {
        if (cancelled) return;
        setInvitacion(null);
        showError('No fue posible cargar el detalle de la invitacion.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInvitacion();

    return () => {
      cancelled = true;
    };
  }, [idInvitacion, open]);

  if (!open) return null;

  const listaInvitados = Array.isArray(invitacion?.listaInvitados) ? invitacion.listaInvitados : [];
  const labelInvitacion = String(invitacion?.label || '').trim();
  const mensajePersonalizadoInvitacion = String(invitacion?.mensaje_personalizado || '').trim();

  return (
    <ModalShell
      onClose={onClose}
      title={invitadoNombre ? `Invitacion de ${invitadoNombre}` : 'Detalle de invitacion'}
      description="Aqui puedes revisar como esta conformada actualmente la invitacion asociada a este invitado."
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            onClick={() => window.alert('En construccion')}
            data-pending-feature="editar-invitacion-desde-modal-detalle"
          >
            Editar
          </Button>
        </>
      )}
    >
      {loading ? (
        <div className={styles.emptyCard}>
          <h3>Cargando invitacion...</h3>
          <p>Estamos consultando la composicion actual de esta invitacion.</p>
        </div>
      ) : !idInvitacion || !invitacion ? (
        <div className={styles.emptyCard}>
          <h3>Sin detalle disponible</h3>
          <p>No encontramos informacion suficiente para mostrar esta invitacion.</p>
        </div>
      ) : (
        <div className={styles.invitationDetailGrid}>
          <section className={styles.invitationDetailSection}>
            <span className={styles.detailLabel}>Label de la invitacion</span>
            <div className={styles.invitationTextBlock}>
              <p className={styles.invitationMessage}>
                {labelInvitacion || 'Esta invitacion todavia no tiene un label definido.'}
              </p>
            </div>
          </section>

          <section className={styles.invitationDetailSection}>
            <span className={styles.detailLabel}>Mensaje personalizado</span>
            <div className={styles.invitationTextBlock}>
              <p className={styles.invitationMessage}>
                {mensajePersonalizadoInvitacion || 'Esta invitacion todavia no tiene un mensaje personalizado definido.'}
              </p>
            </div>
          </section>

          <section className={styles.invitationDetailSection}>
            <span className={styles.detailLabel}>Integrantes</span>
            <div className={styles.invitationMembersPanel}>
              {listaInvitados.map((item) => (
                <article key={item.id} className={styles.invitationMemberRow}>
                  <div className={styles.invitationMemberTop}>
                    <strong>{item?.nombre || 'Invitado sin nombre'}</strong>
                    {item?.principal ? (
                      <span className={styles.primaryMemberPill}>Principal</span>
                    ) : null}
                  </div>
                  <div className={styles.invitationMemberBadges}>
                    <span className={`${styles.metaPill} ${styles.relationshipPill}`}>
                      {resolveParentescoLabel(item?.parentesco, parentescos)}
                    </span>
                    <span className={`${styles.metaPill} ${styles.agePill}`}>
                      {resolveGrupoEdadLabel(item?.grupoEdad, gruposEdad)}
                    </span>
                    <span
                      className={`${styles.metaPill} ${styles.statusPill} ${styles[`statusPill${getEstadoAsistenciaMeta(item?.confirmado).tone.charAt(0).toUpperCase()}${getEstadoAsistenciaMeta(item?.confirmado).tone.slice(1)}`]}`}
                    >
                      <span className={styles.statusIcon} aria-hidden="true">
                        {getEstadoAsistenciaMeta(item?.confirmado).icon}
                      </span>
                      {getEstadoAsistenciaMeta(item?.confirmado).label}
                    </span>
                  </div>
                  <div className={styles.invitationMemberSupport}>
                    {item?.telefono ? (
                      <span className={styles.contactMuted}>
                        <span className={styles.supportIcon} aria-hidden="true">
                          <FiPhone />
                        </span>
                        Telefono: {item.telefono}
                      </span>
                    ) : (
                      <span className={styles.contactMuted}>Sin telefono</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </ModalShell>
  );
}
