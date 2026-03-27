import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CiUser } from 'react-icons/ci';
import { FiArrowLeft, FiLogOut } from 'react-icons/fi';
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
  const rolDisplay = dataUsuario?.rolNombre || rol || 'Sin rol';
  const showBackToEvents = router.pathname.startsWith('/admin/eventos/[idEvento]');

  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  if (router.pathname === LOGIN_ROUTE) return null;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.leftSlot}>
          {showBackToEvents ? (
            <Link href="/admin/eventos" className={styles.backLink}>
              <FiArrowLeft size={16} />
              Volver a eventos
            </Link>
          ) : null}
        </div>

        <div className={styles.account}>
          <div className={styles.identity}>
            <span className={styles.name}>{displayName}</span>
            <span className={styles.role}>{rolDisplay}</span>
          </div>

          <div className={styles.menuAnchor}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Abrir menu de usuario"
              aria-expanded={open}
            >
              <CiUser size={22} />
            </button>

            {open ? (
              <div className={styles.menu}>
                <button type="button" className={styles.menuButton} onClick={handleLogout}>
                  <span className={styles.menuButtonIcon}>
                    <FiLogOut size={16} />
                  </span>
                  Cerrar sesion
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
