import styles from './ListaEventos.module.scss';
import EventoCard from './EventoCard';

export default function ListaEventos({ eventos = [], titulo = '', inactivos = false }) {
  return (
    <div className={styles.wrapper}>
      {titulo && <h2 className={styles.titulo}>{titulo}</h2>}
      <div className={styles.grid}>
        {eventos.map((evento) => (
          <EventoCard key={evento.id} evento={evento} inactivo={inactivos} />
        ))}
      </div>
    </div>
  );
}
