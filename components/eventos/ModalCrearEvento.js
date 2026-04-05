// /components/eventos/ModalCrearEvento.js
import { useState } from 'react';
import Button from '@/components/ui/actions/Button';
import ModalShell from '@/components/ui/layout/ModalShell';
import CrearEvento from './CrearEvento';
import styles from './ModalCrearEvento.module.scss';

export default function ModalCrearEvento({ label = 'Nuevo evento', className = '' }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button className={`${styles.btnPrimary} ${className}`.trim()} onClick={handleOpen}>
        {label}
      </Button>

      {open ? (
        <ModalShell
          title="Nuevo evento"
          onClose={handleClose}
        >
          <CrearEvento cerrar={handleClose} />
        </ModalShell>
      ) : null}
    </>
  );
}
