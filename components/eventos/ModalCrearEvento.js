// /components/eventos/ModalCrearEvento.js
import { useState } from 'react';
import { Box, Modal } from '@mui/material';
import CrearEvento from './CrearEvento';
import { transparent } from '@components/ui/ModalStyles';
import styles from './ModalCrearEvento.module.scss';

export default function ModalCrearEvento({ label = 'Nuevo evento', className = '' }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button className={`${styles.btnPrimary} ${className}`.trim()} onClick={handleOpen}>
        {label}
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={transparent}>
          <CrearEvento cerrar={handleClose} />
        </Box>
      </Modal>
    </>
  );
}
