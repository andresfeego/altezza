import { useEffect, useState } from 'react';
import { getEventosActivos, getEventosInactivos } from '@/components/initialized/data/helpersGetDB';
import ListaEventos from '@/components/eventos/ListaEventos';
import styles from './AdminEventos.module.scss';

export default function AdminEventos() {
  const [activos, setActivos] = useState([]);
  const [inactivos, setInactivos] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  useEffect(() => {
    async function cargarEventos() {
      const dataActivos = await getEventosActivos();
      setActivos(dataActivos || []);
      const dataInactivos = await getEventosInactivos();
      setInactivos(dataInactivos || []);
    }
    cargarEventos();
  }, []);

  return (
    <div className={styles.containerHome}>
      <ListaEventos eventos={activos} titulo="Eventos activos" />
      <button onClick={() => setMostrarInactivos((prev) => !prev)} className={styles.toggleButton}>
        {mostrarInactivos ? 'Ocultar inactivos' : 'Mostrar inactivos'}
      </button>

      {mostrarInactivos && (
        <ListaEventos eventos={inactivos} titulo="Eventos inactivos" inactivos />
      )}
    </div>
  );
}
