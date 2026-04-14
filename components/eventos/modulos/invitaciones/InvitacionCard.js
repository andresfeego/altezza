import {
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiEdit3,
  FiHelpCircle,
  FiStar,
  FiTrash2,
  FiUsers,
  FiXCircle,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import ActionMenu from '@/components/ui/actions/ActionMenu';
import Button from '@/components/ui/actions/Button';
import { showError, showSuccess } from '@/components/initialized/Toast';
import styles from './invitaciones.module.scss';

function getInvitacionTitle(invitacion, index) {
  const label = String(invitacion?.label || '').trim();
  if (label) return label;
  return `Invitacion ${String(index + 1).padStart(2, '0')}`;
}

function getPrincipal(invitacion) {
  const integrantes = Array.isArray(invitacion?.listaInvitadosOriginal)
    ? invitacion.listaInvitadosOriginal
    : Array.isArray(invitacion?.listaInvitados)
      ? invitacion.listaInvitados
      : [];
  return integrantes.find((item) => Boolean(item?.principal)) || null;
}

function getEstadoAsistenciaMeta(value) {
  switch (Number(value)) {
    case 1:
      return {
        label: 'Asistire',
        icon: <FiCheckCircle />,
        toneClass: styles.statusSuccess,
      };
    case 2:
      return {
        label: 'Quiza',
        icon: <FiHelpCircle />,
        toneClass: styles.statusWarning,
      };
    case 3:
      return {
        label: 'No asistire',
        icon: <FiXCircle />,
        toneClass: styles.statusDanger,
      };
    case 0:
    default:
      return {
        label: 'Sin confirmar',
        icon: <GoDotFill />,
        toneClass: styles.statusNeutral,
      };
  }
}

function buildInvitacionLink(idInvitacion, idInvitado) {
  return `https://www.altezzaeventos.in/invitacion/${idInvitacion}/${idInvitado}`;
}

function buildWhatsappUrl(invitacion, invitado) {
  const rawPhone = String(invitado?.telefono || '').trim();
  if (!rawPhone) return null;

  const digits = rawPhone.replace(/\D/g, '');
  const normalized = rawPhone.startsWith('+')
    ? digits
    : digits.startsWith('57')
      ? digits
      : `57${digits}`;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(buildInvitacionShareMessage(invitacion, invitado))}`;
}

function buildInvitacionShareMessage(invitacion, invitado) {
  const eventName = String(invitacion?.nombre || '').trim();
  const dateSource = invitacion?.fechaHoraCeremonia || invitacion?.fechaHoraRecepcion;
  const inviteUrl = buildInvitacionLink(invitacion?.id, invitado?.id);

  let fecha = '';
  let hora = '';

  if (dateSource) {
    const date = new Date(dateSource);
    fecha = date.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    hora = date.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const saludo = invitado?.nombre ? `Hola ${invitado.nombre},` : 'Hola,';
  const intro = eventName
    ? ` queremos celebrar contigo ${eventName}.`
    : ' queremos celebrar contigo este momento tan especial.';
  const schedule = fecha
    ? `\nLa invitacion corresponde al ${fecha}${hora ? ` a las ${hora}` : ''}.`
    : '';
  const label = String(invitacion?.label || '').trim();
  const labelText = label ? `\nReferencia: ${label}.` : '';
  const custom = String(invitacion?.mensaje_personalizado || '').trim();
  const customText = custom ? `\n${custom}` : '';

  return `${saludo}${intro}${schedule}${labelText}${customText}\n\nConfirma tu asistencia aqui:\n${inviteUrl}`;
}

export default function InvitacionCard({
  invitacion,
  index,
  openMenu = false,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onDelete,
  onManageMembers,
  busy = false,
}) {
  const integrantes = Array.isArray(invitacion?.listaInvitados) ? invitacion.listaInvitados : [];
  const principal = getPrincipal(invitacion);
  const message = String(invitacion?.mensaje_personalizado || '').trim();
  const invitadoShare = principal || integrantes[0] || null;

  async function handleCopyInvitation() {
    if (!invitadoShare?.id || !invitacion?.id) {
      showError('No hay un invitado disponible para copiar esta invitacion.');
      return;
    }

    try {
      await navigator.clipboard.writeText(buildInvitacionShareMessage(invitacion, invitadoShare));
      showSuccess('Invitacion copiada al portapapeles.');
      onCloseMenu?.();
    } catch (error) {
      showError('No fue posible copiar la invitacion.');
    }
  }

  return (
    <article className={styles.invitationCard}>
      <div className={styles.invitationCardTop}>
        <div className={styles.invitationIdentity}>
          <strong>{getInvitacionTitle(invitacion, index)}</strong>
          <span>{integrantes.length} integrante{integrantes.length === 1 ? '' : 's'}</span>
        </div>

        <ActionMenu
          open={openMenu}
          onToggle={onToggleMenu}
          onClose={onCloseMenu}
          items={[
            {
              id: 'edit',
              label: 'Editar',
              icon: <FiEdit3 />,
              onClick: onEdit,
              disabled: busy,
            },
            {
              id: 'members',
              label: 'Gestionar integrantes',
              icon: <FiUsers />,
              onClick: onManageMembers,
              disabled: busy,
            },
            {
              id: 'copy',
              label: 'Copiar invitacion',
              icon: <FiCopy />,
              onClick: handleCopyInvitation,
              disabled: busy || !invitadoShare?.id,
            },
            {
              id: 'delete',
              label: 'Eliminar',
              icon: <FiTrash2 />,
              onClick: onDelete,
              disabled: busy,
            },
          ]}
          triggerLabel="Abrir acciones de la invitacion"
        />
      </div>

      <div className={styles.invitationStats}>
        <div className={styles.invitationStat}>
          <span className={styles.statValue}>{integrantes.length}</span>
          <span className={styles.statLabel}>Integrantes</span>
        </div>
        <div className={styles.invitationStat}>
          <span className={`${styles.statValue} ${styles.statValueEllipsis}`}>{principal?.nombre || 'Pendiente'}</span>
          <span className={styles.statLabel}>Principal</span>
        </div>
      </div>

      <div className={styles.invitationTextGroup}>
        <span className={styles.detailLabel}>Mensaje personalizado</span>
        <p className={styles.supportMuted}>
          {message || 'Sin mensaje personalizado'}
        </p>
      </div>

      <div className={styles.memberListPreview}>
        {integrantes.length ? integrantes.slice(0, 4).map((item) => {
          const estado = getEstadoAsistenciaMeta(item?.confirmado);
          const whatsappUrl = buildWhatsappUrl(invitacion, item);

          return (
            <div key={item.id} className={styles.memberPreviewRow}>
              <span className={styles.memberPreviewName}>{item?.nombre || 'Invitado sin nombre'}</span>
              <div className={styles.memberPreviewActions}>
                {item?.principal ? (
                  <span
                    className={`${styles.statusIconBadge} ${styles.primaryMemberPill}`}
                    title="Principal"
                    aria-label="Principal"
                    data-tooltip="Principal"
                  >
                    <FiStar aria-hidden="true" />
                  </span>
                ) : null}
                {whatsappUrl ? (
                  <a
                    className={styles.memberWhatsappButton}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Enviar invitacion por WhatsApp a ${item?.nombre || 'este invitado'}`}
                    data-tooltip="Enviar por WhatsApp"
                  >
                    <FaWhatsapp aria-hidden="true" />
                  </a>
                ) : null}
                <span
                  className={`${styles.statusIconBadge} ${estado.toneClass}`}
                  title={estado.label}
                  aria-label={estado.label}
                  data-tooltip={estado.label}
                >
                  {estado.icon}
                </span>
              </div>
            </div>
          );
        }) : (
          <div className={styles.emptyInnerState}>
            <p>Agrega invitados existentes del evento para estructurar esta invitacion.</p>
          </div>
        )}
      </div>

      <Button variant="secondary" className={styles.manageMembersButton} onClick={onManageMembers} disabled={busy}>
        Gestionar integrantes
      </Button>
    </article>
  );
}
