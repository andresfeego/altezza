import styles from './EventoCard.module.scss';
import Image from 'next/image';
import { MdImage } from 'react-icons/md';
import Link from 'next/link';

export default function EventoCard({ evento, inactivo = false  }) {
  const tieneImagen = evento?.imagenPrincipal && evento.imagenPrincipal.length > 10;

  return (
    <Link href={`/feed/${evento.id}`} className={`${styles.card} ${inactivo ? styles.inactivo : ''}`}>
      <div className={styles.imagen}>
        {tieneImagen ? (
          <Image
            src={evento.imagenPrincipal}
            alt={`Imagen del evento ${evento.nombre}`}
            layout="fill"
            objectFit="cover"
            unoptimized // necesario si las imágenes están en un dominio diferente sin configuración en next.config.js
          />
        ) : (
          <div className={styles.placeholder}>
            <MdImage size={60} color="#aaa" />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3>{evento.nombre}</h3>
        <p>{evento.tipoEvento}</p>
      </div>
    </Link>
  );
}
