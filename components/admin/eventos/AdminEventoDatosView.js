import AdminEventoSectionLayout from './AdminEventoSectionLayout';
import styles from './AdminEventoSections.module.scss';

function formatDate(value) {
  if (!value) return 'Sin definir';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Sin definir';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

function buildRows(evento) {
  return [
    ['Nombre del evento', evento?.nombre || 'Sin definir'],
    ['Tipo de evento', evento?.nombreTipoEvento || evento?.tipoEvento || 'Sin definir'],
    ['Fecha ceremonia', formatDate(evento?.fechaHoraCeremonia)],
    ['Fecha recepcion', formatDate(evento?.fechaHoraRecepcion)],
    ['Fecha limite de confirmacion', formatDate(evento?.fechaHoraLimiteConfirmar)],
    ['Lugar ceremonia', evento?.nombreLugarCeremonia || 'Sin definir'],
    ['Lugar recepcion', evento?.nombreLugarRecepcion || 'Sin definir'],
    ['Invitados esperados', evento?.numeroInvitados || 'Sin definir'],
    ['Estado', evento?.estado ? 'Activo' : 'Inactivo'],
  ];
}

export default function AdminEventoDatosView({ idEvento }) {
  return (
    <AdminEventoSectionLayout idEvento={idEvento} sectionId="datos" sectionTitle="Datos del evento">
      {({ evento, loading }) => {
        if (loading) {
          return <div className={styles.inlineState}>Cargando datos del evento...</div>;
        }

        if (!evento) {
          return <div className={styles.inlineState}>No fue posible cargar los datos del evento.</div>;
        }

        return (
          <div className={styles.infoList}>
            {buildRows(evento).map(([label, value]) => (
              <div key={label} className={styles.infoRow}>
                <span className={styles.infoLabel}>{label}</span>
                <strong className={styles.infoValue}>{value}</strong>
              </div>
            ))}
          </div>
        );
      }}
    </AdminEventoSectionLayout>
  );
}
