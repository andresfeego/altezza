import styles from './ListaEventos.module.scss';
import EventoCard from './EventoCard';

export default function ListaEventos({ eventos = [] }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.titulo}>Eventos Altezza</h2>
      <div className={styles.grid}>
        {eventos.map((evento) => (
          <EventoCard key={evento.id} evento={evento} />
        ))}
      </div>
    </div>
  );
}
