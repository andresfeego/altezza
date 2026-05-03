import {
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiEdit3,
  FiExternalLink,
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

function resolveInvitationOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }

  const configuredOrigin = String(process.env.NEXT_PUBLIC_SITE_ORIGIN || '').trim();
  return configuredOrigin.replace(/\/$/, '');
}

function buildInvitacionLink(idInvitacion, idInvitado) {
  const origin = resolveInvitationOrigin();
  const path = `/invitacion/${idInvitacion}/${idInvitado}`;

  if (!origin) return path;
  return `${origin}${path}`;
}

function normalizeDialCode(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/[^\d]/g, '');
  return digits ? `+${digits}` : '';
}

function resolveGuestDialCode(invitado, paisesTelefonoMap = null) {
  const fromGuest = normalizeDialCode(invitado?.codigoPaisTelefono || invitado?.codigoPais);
  if (fromGuest) return fromGuest;

  const idPaisTelefono = Number(invitado?.idPaisTelefono || 0);
  if (idPaisTelefono > 0 && paisesTelefonoMap instanceof Map) {
    const fromMap = normalizeDialCode(paisesTelefonoMap.get(idPaisTelefono));
    if (fromMap) return fromMap;
  }

  return '+57';
}

function buildWhatsappUrl(invitacion, invitado, paisesTelefonoMap = null) {
  const rawPhone = String(invitado?.telefono || '').trim();
  if (!rawPhone) return null;

  const phoneDigits = rawPhone.replace(/\D/g, '');
  if (!phoneDigits) return null;

  const dialCodeDigits = resolveGuestDialCode(invitado, paisesTelefonoMap).replace(/\D/g, '');
  let normalized = phoneDigits;
  if (dialCodeDigits && !phoneDigits.startsWith(dialCodeDigits)) {
    normalized = `${dialCodeDigits}${phoneDigits}`;
  }

  return `https://wa.me/${normalized}?text=${encodeURIComponent(buildInvitacionShareMessage(invitacion, invitado))}`;
}

function buildInvitacionShareMessage(invitacion, invitado) {
  const eventName = String(invitacion?.nombre || '').trim();
  const guestName = String(invitado?.nombre || '').trim();
  const inviteUrl = buildInvitacionLink(invitacion?.id, invitado?.id);
  const title = eventName || 'Nos casamos';
  const totalGuests = Array.isArray(invitacion?.listaInvitadosOriginal)
    ? invitacion.listaInvitadosOriginal.length
    : Array.isArray(invitacion?.listaInvitados)
      ? invitacion.listaInvitados.length
      : 0;
  const audienceText = totalGuests <= 1 ? 'contigo' : 'con ustedes';
  const greeting = guestName
    ? `Hola ${guestName} Nos casamos !! y nos encantaría compartir este día tan especial ${audienceText}.`
    : `Hola Nos casamos !! y nos encantaría compartir este día tan especial ${audienceText}.`;

  return `${title}\n\n${greeting}\n\nconfirma tu asistencia aqui:\n${inviteUrl}`;
}

async function copyTextWithFallback(value) {
  const text = String(value || '');

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard unavailable');
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Copy command failed');
  }
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
  onToggleSent,
  paisesTelefonoMap = null,
  busy = false,
}) {
  const integrantes = Array.isArray(invitacion?.listaInvitados) ? invitacion.listaInvitados : [];
  const principal = getPrincipal(invitacion);
  const message = String(invitacion?.mensaje_personalizado || '').trim();
  const invitadoShare = principal || integrantes[0] || null;
  const enviada = Boolean(Number(invitacion?.enviada || 0));

  async function handleCopyInvitation() {
    if (!invitadoShare?.id || !invitacion?.id) {
      showError('No hay un invitado disponible para copiar esta invitacion.');
      return;
    }

    try {
      await copyTextWithFallback(buildInvitacionShareMessage(invitacion, invitadoShare));
      showSuccess('Invitacion copiada al portapapeles.');
      onCloseMenu?.();
    } catch (error) {
      showError('No fue posible copiar la invitacion.');
    }
  }

  function handleViewInvitation() {
    if (!invitadoShare?.id || !invitacion?.id) {
      showError('No hay un invitado disponible para abrir esta invitacion.');
      return;
    }

    const inviteUrl = buildInvitacionLink(invitacion.id, invitadoShare.id);
    const popup = window.open(inviteUrl, '_blank');
    if (!popup) {
      showError('El navegador bloqueo la nueva pestaña. Habilita popups para este sitio.');
      return;
    }
    popup.opener = null;
    onCloseMenu?.();
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
              id: 'view',
              label: 'Ver invitacion',
              icon: <FiExternalLink />,
              onClick: handleViewInvitation,
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

      <div className={styles.invitationSentBlock}>
        <div className={styles.invitationSentRow}>
          <span className={styles.statLabel}>Enviada</span>
          <span className={styles.switchControl}>
            <input
              type="checkbox"
              checked={enviada}
              onChange={(event) => onToggleSent?.(event.target.checked)}
              disabled={busy}
            />
            <span className={styles.switchTrack} aria-hidden="true">
              <span className={styles.switchThumb} />
            </span>
          </span>
        </div>
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
          const whatsappUrl = buildWhatsappUrl(invitacion, item, paisesTelefonoMap);

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
