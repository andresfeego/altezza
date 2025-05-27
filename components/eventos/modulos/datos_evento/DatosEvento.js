import styles from './datosEvento.module.scss';
import { useState } from 'react';
import CropImagen from '@/components/ui/CropImagen/CropImagen';
import { uploadImagenEvento } from '@/components/initialized/data/helpersSetDB';
import { base64ToFile } from "@/components/utils/base64ToFile";
import { IconButton, Menu, MenuItem } from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';
import FormularioEdicion from './FormularioEdicion'; // este lo creamos después
import { BsArrowLeft } from 'react-icons/bs';
import MenuOpcionesEvento from './MenuOpcionesEvento';

export default function DatosEvento({ evento }) {
  console.log("Renderizado DatosEvento");
  const [imagenPreview, setImagenPreview] = useState(evento.imagenPrincipal || null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCorteFinalizado = async (base64) => {
    const file = await base64ToFile(base64, 'imagen_recortada.webp');
    const nuevaURL = await uploadImagenEvento(file, evento.id, 'datos_evento');
    if (nuevaURL) setImagenPreview(nuevaURL);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.datosEvento}>
      <div className={styles.header}>
        <h2>Datos de evento</h2>
        <div className={styles.menuSuperior}>
        {modoEdicion ? (
  <IconButton onClick={() => setModoEdicion(false)}>
    <BsArrowLeft />
  </IconButton>
) : (
  <MenuOpcionesEvento onEditar={() => setModoEdicion(true)} />
)}
      </div>
      </div>

      {modoEdicion ? (
        <FormularioEdicion evento={evento} cerrar={() => setModoEdicion(false)} />
      ) : (
        <div className={styles.contentDatosEvento}>
          <CropImagen
            imagenActual={imagenPreview}
            onCorteFinalizado={handleCorteFinalizado}
            multiples={false}
            aspectRatio={1 / 1}
            visualRatio={'1 / 1'}
          />

          <ul>
            <li><span>Nombre:</span> {evento.nombre}</li>
            <li><span>Tipo de evento:</span> {evento.nombreTipoEvento}</li>
            <li><span>Lugar recepción:</span> {evento.nombreLugarRecepcion}</li>
            <li><span>Fecha:</span>{' '}
              {(() => {
                const valor = evento.fechaHoraCeremonia;
                if (!valor || isNaN(new Date(valor))) return 'Sin definir';
                const fecha = new Date(valor);
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = fecha.toLocaleString('es-CO', { month: 'short' }).replace('.', '');
                const anio = fecha.getFullYear();
                return `${dia}-${mes.charAt(0).toUpperCase() + mes.slice(1)}-${anio}`;
              })()}
            </li>
            <li><span>Estado:</span> {evento.estado === 1 ? 'Activo' : 'Inactivo'}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
