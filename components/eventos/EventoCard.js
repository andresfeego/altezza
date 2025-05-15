import styles from './EventoCard.module.scss';
import Image from 'next/image';
import { MdImage } from 'react-icons/md';
import Link from 'next/link';

export default function EventoCard({ evento }) {
  return (
    <Link href={`/feed/${evento.id}`} className={styles.card}>

        <div className={styles.imagen}>
          {evento?.tieneImagen ? (
            <Image
              src={`/images/eventos/${evento.id}.jpg`}
              alt={`Imagen del evento ${evento.nombre}`}
              layout="fill"
              objectFit="cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '';
                evento.tieneImagen = false;
              }}
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
