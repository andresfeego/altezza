import shellStyles from '@/components/admin/shared/AdminModuleShell.module.scss';
import styles from './ListaEventos.module.scss';
import EventoCard from './EventoCard';

export default function ListaEventos({
  eventos = [],
  titulo = '',
  inactivos = false,
  getEventHref = null,
  eyebrow = '',
  helperText = '',
}) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.titleWrapper} ${shellStyles.sectionHeader}`}>
        {titulo && <h2 className={`${styles.titulo} ${shellStyles.sectionTitle}`}>{titulo}</h2>}
      </div>

      {eventos.length ? (
        <div className={styles.grid}>
          {eventos.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              inactivo={inactivos}
              href={typeof getEventHref === 'function' ? getEventHref(evento) : null}
              eyebrow={eyebrow}
              helperText={helperText}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>{inactivos ? 'Sin eventos inactivos' : 'Sin eventos activos'}</h3>
          <p>Este bloque estara listo cuando existan eventos en esta categoria.</p>
        </div>
      )}
    </div>
  );
}
