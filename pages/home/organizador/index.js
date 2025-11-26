import { useState } from 'react';
import styles from '@/components/home/AdminHome.module.scss';

const TITLES = {
  organizador: 'Organizador',
  agenda: 'Agenda',
  catalogo: 'Catálogo',
  pendientes: 'Pendientes',
  ajustes: 'Ajustes',
};

export default function OrganizadorHome() {
  const [selected, setSelected] = useState('organizador');

  return (
    <>
      <div className={styles.content}>
        <main style={{ padding: '2rem' }}>
          <h1>Home - Organizador</h1>
          <p>Sección: {TITLES[selected] || 'Organizador'}</p>
        </main>
      </div>
    </>
  );
}
