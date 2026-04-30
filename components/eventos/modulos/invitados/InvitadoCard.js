import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import ActionMenu from '@/components/ui/actions/ActionMenu';
import styles from './invitados.module.scss';

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function buildWhatsappUrl(countryCode, phone) {
  const digits = `${normalizePhone(countryCode)}${normalizePhone(phone)}`;
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export default function InvitadoCard({
  invitado,
  onEdit,
  onDelete,
  onOpenInvitation,
  menuOpen = false,
  onToggleMenu,
  onCloseMenu,
  busy = false,
}) {
  const countryCode = String(invitado?.codigoPaisTelefono || '').trim();
  const phoneDisplay = [countryCode, invitado?.telefono].filter(Boolean).join(' ').trim();
  const phoneDigits = `${normalizePhone(countryCode)}${normalizePhone(invitado?.telefono)}`;
  const whatsappUrl = buildWhatsappUrl(countryCode, invitado?.telefono);

  return (
    <article className={styles.invitedCard}>
      <div className={styles.invitedTop}>
        <div className={styles.invitedIdentity}>
          <strong>{invitado?.nombre || 'Invitado sin nombre'}</strong>
          <span>{invitado?.parentescoLabel || 'Parentesco sin definir'}</span>
        </div>

        <ActionMenu
          open={menuOpen}
          onToggle={onToggleMenu}
          onClose={onCloseMenu}
          triggerLabel={`Acciones para ${invitado?.nombre || 'invitado'}`}
          items={[
            {
              id: 'edit',
              label: 'Editar',
              onClick: () => {
                onCloseMenu?.();
                onEdit(invitado);
              },
              disabled: busy,
            },
            {
              id: 'delete',
              label: 'Eliminar',
              onClick: () => {
                onCloseMenu?.();
                onDelete(invitado);
              },
              disabled: busy,
            },
          ]}
        />
      </div>

      <div className={styles.invitedMeta}>
        <span className={styles.metaPill}>{invitado?.grupoEdadLabel || 'Grupo sin definir'}</span>
        {invitado?.idInvitacion ? (
          <button
            type="button"
            className={`${styles.metaPill} ${styles.metaPillButton}`}
            onClick={() => onOpenInvitation?.(invitado)}
          >
            Ver invitacion
          </button>
        ) : (
          <span className={`${styles.metaPill} ${styles.metaMuted}`}>Sin invitacion</span>
        )}
      </div>

      <div className={styles.invitedContactRow}>
        {invitado?.telefono ? (
          <a href={`tel:${phoneDigits}`} className={styles.phoneBadge}>
            <span className={styles.phoneIcon}>
              <FiPhone />
            </span>
            <span>{phoneDisplay}</span>
          </a>
        ) : (
          <span className={styles.contactMuted}>Sin telefono</span>
        )}

        {whatsappUrl && invitado?.wp ? (
          <a
            href={whatsappUrl}
            className={styles.whatsappBadge}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir WhatsApp para ${invitado.nombre}`}
          >
            <span className={styles.whatsappIcon}>
              <FaWhatsapp />
            </span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
