import styles from './EventoCard.module.scss';
import Image from 'next/image';
import { MdImage } from 'react-icons/md';
import Link from 'next/link';

export default function EventoCard({
  evento,
  inactivo = false,
  href = null,
  eyebrow = '',
  helperText = '',
}) {
  const tieneImagen = evento?.imagenPrincipal && evento.imagenPrincipal.length > 10;
  const targetHref = href || `/evento/feed/${evento.id}`;

  return (
    <Link href={targetHref} className={`${styles.card} ${inactivo ? styles.inactivo : ''}`}>
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
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <h3>{evento.nombre}</h3>
        <p>{evento.tipoEvento}</p>
        {helperText ? <span className={styles.helper}>{helperText}</span> : null}
      </div>
    </Link>
  );
}
