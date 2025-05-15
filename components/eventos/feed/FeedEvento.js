import { useState } from 'react';
import BarraEvento from './BarraEvento';

export default function FeedEvento({ evento }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);
console.log(evento)
  return (
    <>
      <BarraEvento
        tipo={evento.nombreTipoEvento}
        nombre={evento.nombreEvento}
      />

      <div style={{ padding: '1rem' }}>
        <section>
          <h3 style={{ marginBottom: '0.5rem' }}>Resumen: Datos del evento</h3>
          <p><strong>Nombre:</strong> {evento.nombreEvento}</p>
          <p><strong>Lugar:</strong> {evento.nombreLugarRecepcion}</p>
          <p>
            <strong>Fecha:</strong>{' '}
            {(() => {
              const fecha = new Date(evento.fechaHoraCeremonia);
              const dia = String(fecha.getDate()).padStart(2, '0');
              const mes = fecha.toLocaleString('es-CO', { month: 'short' }).replace('.', '');
              const anio = fecha.getFullYear();
              return `${dia}-${mes.charAt(0).toUpperCase() + mes.slice(1)}-${anio}`;
            })()}
          </p>
        </section>
      </div>

    </>
  );
}
