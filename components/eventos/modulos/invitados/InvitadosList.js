import InvitadoCard from './InvitadoCard';
import styles from './invitados.module.scss';

export default function InvitadosList({
  invitados = [],
  onEdit,
  onDelete,
  onOpenInvitation,
  openMenuId = null,
  onToggleMenu,
  onCloseMenu,
  busy = false,
}) {
  if (!invitados.length) {
    return (
      <div className={styles.emptyCard}>
        <h3>No hay invitados para mostrar</h3>
        <p>Ajusta la busqueda o crea el primer invitado del evento para comenzar.</p>
      </div>
    );
  }

  return (
    <section className={styles.invitedGrid}>
      {invitados.map((invitado) => (
        <InvitadoCard
          key={invitado.id}
          invitado={invitado}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpenInvitation={onOpenInvitation}
          menuOpen={openMenuId === invitado.id}
          onToggleMenu={() => onToggleMenu?.(invitado.id)}
          onCloseMenu={onCloseMenu}
          busy={busy}
        />
      ))}
    </section>
  );
}
