import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import styles from './ModalMenuEvento.module.scss';
import MenuItem from '@/components/ui/MenuItem';
import { MdEventNote, MdPalette, MdChecklist, MdCameraAlt, MdAttachMoney , MdEvent} from 'react-icons/md';
import { GiPartyPopper, GiCakeSlice  } from 'react-icons/gi';
import { FaCouch } from 'react-icons/fa';
import { basico } from '@/components/ui/ModalStyles';

export default function ModalMenuEvento({ open, onClose }) {
  const modulos = [
    { label: 'Datos del evento', icon: <MdEventNote className={styles.icono}/>, onClick: () => alert('Datos del evento') },
    { label: 'Paletas de colores', icon: <MdPalette className={styles.icono}/>, onClick: () => alert('Paletas de colores') },
    { label: 'Inspiración', icon: <MdCameraAlt className={styles.icono}/>, onClick: () => alert('Inspiración') },
    { label: 'Presupuesto', icon: <MdAttachMoney className={styles.icono}/>, onClick: () => alert('Presupuesto') },
    { label: 'Mobiliario', icon: <FaCouch className={styles.icono}/>, onClick: () => alert('Mobiliario') },
    { label: 'Alquiler', icon: <MdEvent  className={styles.icono}/>, onClick: () => alert('Alquiler') },
    { label: 'Pendientes', icon: <MdChecklist className={styles.icono}/>, onClick: () => alert('Pendientes') },
    { label: 'Pastel', icon: <GiCakeSlice className={styles.icono}/>, onClick: () => alert('Pastel') },
    { label: 'Tips boda', icon: <GiPartyPopper className={styles.icono}/>, onClick: () => alert('Tips boda') },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={basico}>
        <h3 className={styles.titulo}>Menú del evento</h3>
        <div className={styles.lista}>
          {modulos.map((mod, i) => {
  console.log(`Renderizando:`, mod);
  return <MenuItem key={i} icon={mod.icon} label={mod.label} onClick={mod.onClick} />;
})}
        </div>
        <button className={styles.cerrar} onClick={onClose}>Cerrar</button>
      </Box>
    </Modal>
  );
}
