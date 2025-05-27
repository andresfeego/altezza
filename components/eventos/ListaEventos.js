import styles from './ListaEventos.module.scss';
import EventoCard from './EventoCard';
import ModalCrearEvento from '@/components/eventos/ModalCrearEvento';

export default function ListaEventos({ eventos = [], titulo = '', inactivos = false }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        {titulo && <h2 className={styles.titulo}>{titulo}</h2>}
        {!inactivos && <ModalCrearEvento/>}
      </div>

      <div className={styles.grid}>
        {eventos.map((evento) => (
          <EventoCard key={evento.id} evento={evento} inactivo={inactivos} />
        ))}
      </div>
    </div>
  );
}
