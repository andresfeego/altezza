import { useEffect, useState } from 'react';
import { FiCalendar, FiEyeOff, FiLayers } from 'react-icons/fi';
import shellStyles from '@/components/admin/shared/AdminModuleShell.module.scss';
import { getEventosActivos, getEventosInactivos } from '@/components/initialized/data/helpersGetDB';
import PageHeader from '@/components/ui/layout/PageHeader';
import ListaEventos from '@/components/eventos/ListaEventos';
import ModalCrearEvento from '@/components/eventos/ModalCrearEvento';
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
    <div className={`${styles.containerHome} ${shellStyles.page}`}>
      <section className={styles.hero}>
        <PageHeader
          title="Administracion de eventos"
          align="right"
          actions={<ModalCrearEvento label="Nuevo evento" />}
        />

        <div className={`${styles.summaryCard} ${shellStyles.summaryCard}`}>
          <div className={`${styles.summaryItem} ${shellStyles.summaryItem}`}>
            <div className={`${styles.summaryTop} ${shellStyles.summaryTop}`}>
              <span className={`${styles.metricIcon} ${shellStyles.metricIcon}`}><FiLayers size={14} /></span>
              <strong>{activos.length + inactivos.length}</strong>
            </div>
            <span>Total</span>
          </div>
          <div className={`${styles.summaryItem} ${shellStyles.summaryItem}`}>
            <div className={`${styles.summaryTop} ${shellStyles.summaryTop}`}>
              <span className={`${styles.metricIcon} ${shellStyles.metricIcon}`}><FiCalendar size={14} /></span>
              <strong>{activos.length}</strong>
            </div>
            <span>Activos</span>
          </div>
          <div className={`${styles.summaryItem} ${shellStyles.summaryItem}`}>
            <div className={`${styles.summaryTop} ${shellStyles.summaryTop}`}>
              <span className={`${styles.metricIcon} ${shellStyles.metricIcon}`}><FiEyeOff size={14} /></span>
              <strong>{inactivos.length}</strong>
            </div>
            <span>Inactivos</span>
          </div>
        </div>
      </section>

      <section className={`${styles.sectionCard} ${shellStyles.sectionCard}`}>
        <ListaEventos
          eventos={activos}
          titulo="Eventos activos"
          getEventHref={(evento) => `/admin/eventos/${evento.id}`}
          eyebrow="Workspace del evento"
          helperText="Entrar a gestionar modulos, datos y acciones del evento"
        />
      </section>

      <div className={styles.toggleWrap}>
        <button onClick={() => setMostrarInactivos((prev) => !prev)} className={styles.toggleButton}>
          {mostrarInactivos ? 'Ocultar inactivos' : 'Mostrar inactivos'}
        </button>
      </div>

      {mostrarInactivos && (
        <section className={`${styles.sectionCard} ${shellStyles.sectionCard}`}>
          <ListaEventos
            eventos={inactivos}
            titulo="Eventos inactivos"
            inactivos
            getEventHref={(evento) => `/admin/eventos/${evento.id}`}
            eyebrow="Workspace del evento"
            helperText="Entrar a revisar configuracion del evento"
          />
        </section>
      )}
    </div>
  );
}
