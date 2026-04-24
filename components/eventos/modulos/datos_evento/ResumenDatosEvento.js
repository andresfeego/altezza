import Link from 'next/link';
import { formatDateInColombia, getDatePartsInColombia } from '@/components/utils/datetimeColombia';
import styles from './resumenDatosEvento.module.scss';

export default function ResumenDatosEvento({ evento }) {
  return (
    <Link href={`/evento/datos_evento/${evento.idEvento}`} className={styles.linkResumen}>
      <div className={styles.contenedorResumen}>
        <section>
          <h3> Datos del evento</h3>
          <p><strong>Nombre:</strong> {evento.nombreEvento}</p>
          <p><strong>Lugar:</strong> {evento.nombreLugarRecepcion}</p>
          <p>
            <strong>Fecha:</strong>{' '}
            {(() => {
              const valor = evento.fechaEvento;
              const parts = getDatePartsInColombia(valor);
              if (!parts) return 'Sin definir';
              const mes = formatDateInColombia(valor, {
                options: { month: 'short' },
                fallback: '',
              }).replace('.', '');
              const dia = parts.dayLabel;
              const anio = parts.year;
              return `${dia}-${mes.charAt(0).toUpperCase() + mes.slice(1)}-${anio}`;
            })()}
          </p>
        </section>
      </div>
    </Link>
  );
}
