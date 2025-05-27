// /components/eventos/ModalCrearEvento.js
import { useState } from 'react';
import { Box, Modal } from '@mui/material';
import { FiPlus } from 'react-icons/fi';
import CrearEvento from './CrearEvento';
import { transparent } from '@components/ui/ModalStyles';
import styles from './ModalCrearEvento.module.scss';

export default function ModalCrearEvento() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button className={styles.btnCircular} onClick={handleOpen}>
        <FiPlus size={20} />
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={transparent}>
          <CrearEvento cerrar={handleClose} />
        </Box>
      </Modal>
    </>
  );
}
