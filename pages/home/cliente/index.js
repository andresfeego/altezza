import Link from 'next/link';
import styles from '@/components/home/AdminHome.module.scss';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';

export default function ClienteHome() {
  const dataUsuario = useUsuarioStore((state) => state.dataUsuario);
  const idEventoAsignado = dataUsuario?.idEventoAsignado;

  return (
    <div className={styles.content}>
      <main style={{ padding: '2rem' }}>
        <h1>Mi evento</h1>
        {idEventoAsignado ? (
          <>
            <p>Tienes un evento asignado y puedes continuar al feed principal.</p>
            <Link href={`/evento/feed/${idEventoAsignado}`}>Ir al feed del evento</Link>
          </>
        ) : (
          <p>Aun no tienes un evento vinculado. Debes comunicarte con el administrador.</p>
        )}
      </main>
    </div>
  );
}
