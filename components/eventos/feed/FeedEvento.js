import { useState, useEffect } from 'react';
import BarraEvento from './BarraEvento';
import ResumenDatosEvento from '@/components/eventos/modulos/datos_evento/ResumenDatosEvento';
import LoadingScreen from '@/components/ui/LoadingScreen';
import styles from './feedEvento.module.scss';

export default function FeedEvento({ evento }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);
console.log(evento);
  if (!evento || !evento.idEvento) {
    return <LoadingScreen mensaje="Cargando evento..." />;
  }

  return (
    <div className={styles.contenedorFeed}>
      <BarraEvento
        tipo={evento.nombreTipoEvento}
        nombre={evento.nombreEvento}
      />

      <div className={styles.gridModulos}>
        <ResumenDatosEvento evento={evento} />
      </div>
    </div>
  );
}
