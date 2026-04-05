import { useEffect, useState } from 'react';
import Button from '@/components/ui/actions/Button';
import styles from './CrearEvento.module.scss';
import { showError, showSuccess } from '@/components/initialized/Toast';

import { getTiposEvento, getLugares } from '@/components/initialized/data/helpersGetDB';
import { crearEventoBasico } from '@/components/initialized/data/helpersSetDB';

export default function CrearEvento({ cerrar }) {
  const [idPersonalizado, setIdPersonalizado] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [lugarRecepcion, setLugarRecepcion] = useState('');
  const [fechaRecepcion, setFechaRecepcion] = useState('');
  const [tiposEvento, setTiposEvento] = useState([]);
  const [lugares, setLugares] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      const tipos = await getTiposEvento();
      setTiposEvento(tipos || []);
      const lugaresBD = await getLugares();
      setLugares(lugaresBD || []);
    }
    cargarDatos();
  }, []);

  const obtenerPrefijoPorTipo = (idTipo) => {
    switch (parseInt(idTipo)) {
      case 1: return 'xv';
      case 2: return 'bod';
      case 3: return 'baut';
      case 4: return 'pc';
      case 5: return 'bdy';
      case 6: return 'emp';
      default: return 'ev';
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    if (!idPersonalizado || !nombre || !tipoEvento || !lugarRecepcion || !fechaRecepcion) {
      showError('Por favor completa todos los campos obligatorios');
      return;
    }

    const prefijo = obtenerPrefijoPorTipo(tipoEvento);
    const idEvento = (prefijo + idPersonalizado.toLowerCase().replace(/[^a-z0-9]/g, '')).substring(0, 10);

    const res = await crearEventoBasico({
      id: idEvento,
      nombre,
      idTipoEvento: tipoEvento,
      fechaHoraRecepcion: fechaRecepcion,
      idLugarRecepcion: lugarRecepcion
    });

    if (res?.success) {
      showSuccess(`Evento creado con ID: ${idEvento}`);
      cerrar();
    } else {
      showError('Ocurrio un error al crear el evento');
    }
  };

  return (
    <form className={styles.formCrear} onSubmit={handleCrear}>
      <label>ID del evento</label>
      <div className={styles.idPreview}>
        <span className={styles.prefijoPreview}>
          {obtenerPrefijoPorTipo(tipoEvento)}
        </span>
        <input
          type="text"
          value={idPersonalizado}
          onChange={(e) => setIdPersonalizado(e.target.value)}
          placeholder="cym"
          maxLength={7}
          required
        />
      </div>

      <label>Nombre del evento *</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <label>Tipo de evento *</label>
      <select value={tipoEvento} onChange={(e) => setTipoEvento(e.target.value)} required>
        <option value="">Selecciona</option>
        {tiposEvento.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
        ))}
      </select>

      <label>Lugar de recepción *</label>
      <select value={lugarRecepcion} onChange={(e) => setLugarRecepcion(e.target.value)} required>
        <option value="">Selecciona</option>
        {lugares.map((lugar) => (
          <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
        ))}
      </select>

      <label>Fecha y hora de la recepción *</label>
      <input
        type="datetime-local"
        value={fechaRecepcion}
        onChange={(e) => setFechaRecepcion(e.target.value)}
        required
      />

      <div className={styles.actions}>
        <Button variant="secondary" onClick={cerrar}>Cancelar</Button>
        <Button type="submit">Crear evento</Button>
      </div>
    </form>
  );
}
