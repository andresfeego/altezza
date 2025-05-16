import styles from './datosEvento.module.scss';
import { useState } from 'react';
import CropImagen from '@/components/ui/CropImagen/CropImagen';
import { uploadImagenEvento } from '@/components/initialized/data/helpersSetDB';
import { base64ToFile } from "@/components/utils/base64ToFile";
export default function DatosEvento({ evento }) {
  const [imagenPreview, setImagenPreview] = useState(evento.imagenPrincipal || null);

const handleCorteFinalizado = async (base64) => {
  const file = await base64ToFile(base64, 'imagen_recortada.webp');

  const nuevaURL = await uploadImagenEvento(file, evento.id, 'datos_evento');
  console.log(nuevaURL);
  if (nuevaURL) setImagenPreview(nuevaURL);
};

  return (
    <div className={styles.datosEvento}>
      <h2>Datos de evento</h2>
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
              })()}</li>
          <li><span>Estado:</span> {evento.estado === 1 ? 'Activo' : 'Inactivo'}</li>
        </ul>
      </div>
      <br />
      <br />
      <span>Mi queri aqui irían todos los datos del evento como los usuarios que tienen acceso, crear usuarios, la cotizacion final, nombres de los papás de los novios osea eso esta por definir bien </span>
      <br />
      <br />
      <span>También puedes cambiar la imagen del evento si quieres.... desde el icono de la esquina inferior derecha de la imagen... te amo 😘😘😘🥰</span>
    </div>
  );
}
