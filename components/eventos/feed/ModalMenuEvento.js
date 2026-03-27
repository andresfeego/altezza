import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import styles from './ModalMenuEvento.module.scss';
import MenuItem from '@/components/ui/MenuItem';
import { basico } from '@/components/ui/ModalStyles';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import { getMenuItemsByRole } from '@/components/navigation/menuItems';

export default function ModalMenuEvento({ open, onClose }) {
  const router = useRouter();
  const rol = useUsuarioStore((state) => state.dataUsuario?.rol);
  const modulos = getMenuItemsByRole(rol).filter((item) => item.url !== '/home/cliente');

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={basico}>
        <h3 className={styles.titulo}>Menú del evento</h3>
        <div className={styles.lista}>
          {modulos.map((mod, i) => (
            <MenuItem
              key={mod.id || i}
              icon={mod.icon}
              label={mod.label}
              onClick={() => {
                router.push(mod.url);
                onClose?.();
              }}
            />
          ))}
        </div>
        <button className={styles.cerrar} onClick={onClose}>Cerrar</button>
      </Box>
    </Modal>
  );
}
