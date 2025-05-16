import Link from 'next/link';
import styles from './resumenDatosEvento.module.scss';

export default function ResumenDatosEvento({ evento }) {
  return (
    <Link href={`/datos_evento/${evento.idEvento}`} className={styles.linkResumen}>
      <div className={styles.contenedorResumen}>
        <section>
          <h3> Datos del evento</h3>
          <p><strong>Nombre:</strong> {evento.nombreEvento}</p>
          <p><strong>Lugar:</strong> {evento.nombreLugarRecepcion}</p>
          <p>
            <strong>Fecha:</strong>{' '}
            {(() => {
              const valor = evento.fechaEvento;
              if (!valor || isNaN(new Date(valor))) return 'Sin definir';

              const fecha = new Date(valor);
              const dia = String(fecha.getDate()).padStart(2, '0');
              const mes = fecha.toLocaleString('es-CO', { month: 'short' }).replace('.', '');
              const anio = fecha.getFullYear();
              return `${dia}-${mes.charAt(0).toUpperCase() + mes.slice(1)}-${anio}`;
            })()}
          </p>
        </section>
      </div>
    </Link>
  );
}
