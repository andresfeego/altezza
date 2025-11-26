import { useState } from 'react';
import AdminEventos from '@/components/home/AdminEventos';
import styles from './AdminHome.module.scss';

export default function AdminHome() {
  const [selected, setSelected] = useState('home');
  const title = 'Administración Altezza';

  const renderContent = () => {
    if (selected === 'eventos') return <AdminEventos />;

    return (
      <div className={styles.placeholder}>
        <h2>{title}</h2>
        <p>Selecciona una sección en el menú para comenzar.</p>
      </div>
    );
  };

  return (
    <>
      <div className={styles.content}>{renderContent()}</div>
    </>
  );
}
