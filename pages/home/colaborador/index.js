import { useState } from 'react';
import styles from '@/components/home/AdminHome.module.scss';

const TITLES = {
  colaborador: 'Colaborador',
  agenda: 'Agenda',
  catalogo: 'Catálogo',
  pendientes: 'Pendientes',
  ajustes: 'Ajustes',
};

export default function ColaboradorHome() {
  const [selected, setSelected] = useState('colaborador');

  return (
    <>
      <div className={styles.content}>
        <main style={{ padding: '2rem' }}>
          <h1>Home - Colaborador</h1>
          <p>Sección: {TITLES[selected] || 'Colaborador'}</p>
        </main>
      </div>
    </>
  );
}
