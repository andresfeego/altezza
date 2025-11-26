import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CiUser } from 'react-icons/ci';
import { FiLogOut } from 'react-icons/fi';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import styles from './UserMenuButton.module.scss';

const LOGIN_ROUTE = '/_api/Login/login';

export default function UserMenuButton() {
  const router = useRouter();
  const clearUsuario = useUsuarioStore((state) => state.clearUsuario);
  const clearDataUsuario = useUsuarioStore((state) => state.clearDataUsuario);
  const dataUsuario = useUsuarioStore((state) => state.dataUsuario);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearUsuario?.();
    clearDataUsuario?.();
    router.push(LOGIN_ROUTE);
  };

  const nombre =
    dataUsuario?.nombres ||
    dataUsuario?.nombre ||
    dataUsuario?.name ||
    dataUsuario?.user ||
    dataUsuario?.usuario;
  const apellidos = dataUsuario?.apellidos || dataUsuario?.apellido || dataUsuario?.lastName;
  const displayName = [nombre, apellidos].filter(Boolean).join(' ').trim() || 'Usuario';
  const rol = dataUsuario?.rol || dataUsuario?.role || dataUsuario?.rolNombre || null;
  const rolDisplay = dataUsuario?.rolNombre || rol;

  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  if (router.pathname === LOGIN_ROUTE) return null;

  return (
    <div className={styles.container}>
      {open && (
        <div className={styles.menu}>
          <div className={styles.userInfo}>
            <div className={styles.name}>{displayName}</div>
            {rolDisplay && <div className={styles.role}>{rolDisplay}</div>}
          </div>
          <hr className={styles.divider} />
          <button className={styles.menuButton} onClick={handleLogout}>
            <span className={styles.menuButtonIcon}>
              <FiLogOut size={16} />
            </span>
            Cerrar sesión
          </button>
        </div>
      )}
      <button className={styles.fab} onClick={() => setOpen((prev) => !prev)} aria-label="Menú de usuario">
        <CiUser size={26} />
      </button>
    </div>
  );
}
