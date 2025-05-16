// components/ui/LoadingScreen.js
import styles from './LoadingScreen.module.scss';
import Image from 'next/image';
import { BarLoader } from 'react-spinners';

export default function LoadingScreen({ mensaje = "Cargando..." }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.logoWrapper}>
        <Image
          src="/images/logo_altezza_negro.png"
          width={150}
          height={90}
          alt="Altezza Logo"
        />
        <span className={styles.cargando}>{mensaje}</span>
        <BarLoader color="#000" size={40} />
      </div>
    </div>
  );
}
