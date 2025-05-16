import { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { FaImage, FaEdit, FaTimes } from 'react-icons/fa';
import getCroppedImgURL from './utils/getCroppedImgURL';
import styles from './CropImagen.module.scss';

export default function CropImagen({
  imagenActual = null,
  onCorteFinalizado,
  multiples = false,
  cantidadMaxima = 1,
  aspectRatio = 1 / 1,       // para recorte
  visualRatio = '1 / 1',     // para preview
}) {

  const inputRef = useRef();
  const [srcList, setSrcList] = useState([]);
  const [actualIndex, setActualIndex] = useState(0);
  const [src, setSrc] = useState(null);

  const [mostrarEditor, setMostrarEditor] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleSeleccion = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      setSrcList(results);
      setActualIndex(0);
      setSrc(results[0]);
      setMostrarEditor(true);
    });
  };

  const onCropComplete = (_, cropped) => {
    setCroppedAreaPixels(cropped);
  };

  const handleCorte = async () => {
    const img = await getCroppedImgURL(src, croppedAreaPixels, rotation);
    onCorteFinalizado(img);
    const next = actualIndex + 1;
    if (next < srcList.length) {
      setActualIndex(next);
      setSrc(srcList[next]);
    } else {
      setSrc(null);
      setSrcList([]);
      setMostrarEditor(false);
    }
  };

  const cancelarEdicion = () => {
    setMostrarEditor(false);
    setSrc(null);
    setSrcList([]);
  };

  return (
    <div className={styles.wrapper}>
<div className={styles.vistaImagen} style={{ aspectRatio: visualRatio }}>
        {imagenActual && !src && <img src={imagenActual} key={imagenActual + Date.now()} alt="Actual" />}
        {!imagenActual && !src && <FaImage size={60} className={styles.placeholderIcon} />}

        <button className={styles.botonEditar} onClick={() => inputRef.current.click()}>
          <FaEdit />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiples}
          onChange={handleSeleccion}
          style={{ display: 'none' }}
        />
      </div>

      {mostrarEditor && (
        <div className={styles.overlay}>
          <button className={styles.cerrar} onClick={cancelarEdicion}>
            <FaTimes />
          </button>

          <div className={styles.cropContainer}>
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onRotationChange={setRotation}
              onZoomChange={setZoom}
            />
          </div>

          <div className={styles.controles}>
            <div className={styles.sliderControl}>
              <Typography variant="caption">Zoom</Typography>
              <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, z) => setZoom(z)} />
            </div>
            <div className={styles.sliderControl}>
              <Typography variant="caption">Rotación</Typography>
              <Slider value={rotation} min={0} max={360} step={1} onChange={(e, r) => setRotation(r)} />
            </div>

            <button className={styles.botonRecortar} onClick={handleCorte}>
              Usar imagen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
