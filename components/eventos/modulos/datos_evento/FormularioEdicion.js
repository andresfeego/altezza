import styles from './FormularioEdicion.module.scss';
import { useState } from 'react';
import EditorPersonalizado from './EditorPersonalizado'; // subcomponente por tipo de evento
import { toast } from 'react-toastify';

export default function FormularioEdicion({ evento, cerrar }) {
  const [nombre, setNombre] = useState(evento.nombre || '');
  const [fechaCeremonia, setFechaCeremonia] = useState(evento.fechaHoraCeremonia?.slice(0, 16) || '');
  const [fechaRecepcion, setFechaRecepcion] = useState(evento.fechaHoraRecepcion?.slice(0, 16) || '');
  const [fechaLimite, setFechaLimite] = useState(evento.fechaHoraLimiteConfirmar?.slice(0, 16) || '');
  const [hashtag, setHashtag] = useState(evento.hashtag || '');
  const [numInvitados, setNumInvitados] = useState(evento.numeroInvitados || '');

  const handleGuardar = async () => {
    // Aquí iría la lógica para guardar en backend (no implementada todavía)
    toast.success('Cambios guardados');
    cerrar(); // cerrar modo edición
  };

  return (
    <div className={styles.formularioEdicion}>
      <h3>Editar datos del evento</h3>

      <label>Nombre del evento</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <label>Fecha y hora de la ceremonia</label>
      <input type="datetime-local" value={fechaCeremonia} onChange={(e) => setFechaCeremonia(e.target.value)} />

      <label>Fecha y hora de la recepción</label>
      <input type="datetime-local" value={fechaRecepcion} onChange={(e) => setFechaRecepcion(e.target.value)} />

      <label>Fecha límite de confirmación</label>
      <input type="datetime-local" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} />

      <label>Hashtag</label>
      <input value={hashtag} onChange={(e) => setHashtag(e.target.value)} />

      <label>Número estimado de invitados</label>
      <input type="number" value={numInvitados} onChange={(e) => setNumInvitados(e.target.value)} />

      <label>Tipo de evento</label>
      <input value={evento.nombreTipoEvento} disabled />

      <hr />

      <EditorPersonalizado tipo={evento.idTipoEvento} idEvento={evento.id} />

      <div className={styles.botones}>
        <button onClick={cerrar}>Cancelar</button>
        <button onClick={handleGuardar}>Guardar</button>
      </div>
    </div>
  );
}
