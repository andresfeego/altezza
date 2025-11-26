import { useState } from 'react';
import styles from '@/components/home/AdminHome.module.scss';

const TITLES = {
  'mi-evento': 'Mi evento',
  agenda: 'Agenda',
  catalogo: 'Catálogo',
  pendientes: 'Pendientes',
  ajustes: 'Ajustes',
};

export default function ClienteHome() {
  const [selected, setSelected] = useState('mi-evento');

  return (
    <>
      <div className={styles.content}>
        <main style={{ padding: '2rem' }}>
          <h1>Home - Cliente</h1>
          <p>Sección: {TITLES[selected] || 'Mi evento'}</p>
        </main>
      </div>
    </>
  );
}
