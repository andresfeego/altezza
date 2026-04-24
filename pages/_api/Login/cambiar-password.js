import styles from './login.module.scss';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { cambiarPasswordTemporal } from '@/components/initialized/data/helpersSetDB';
import { showError, showSuccess } from '@/components/initialized/Toast';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import { getDefaultPathByUser } from '@/components/constants/roles';

export default function CambiarPasswordTemporal() {
  const router = useRouter();
  const setUsuario = useUsuarioStore((state) => state.setUsuario);
  const setDataUsuario = useUsuarioStore((state) => state.setDataUsuario);
  const [user, setUser] = useState('');
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [platformClass, setPlatformClass] = useState('');

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) {
      setPlatformClass(styles.ios);
      return;
    }
    if (/Android/.test(ua)) {
      setPlatformClass(styles.android);
    }
  }, []);

  useEffect(() => {
    if (router.query?.user) {
      setUser(String(router.query.user));
    }
  }, [router.query?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !passActual || !passNueva || !confirmacion) {
      showError('Completa todos los campos.');
      return;
    }

    if (passNueva.length < 8) {
      showError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (passNueva !== confirmacion) {
      showError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    setCargando(true);
    try {
      const result = await cambiarPasswordTemporal({
        user,
        passActual,
        passNueva,
      });

      if (!result?.success) {
        showError('No fue posible actualizar la contraseña.');
        return;
      }

      const userData = result?.usuario || result;
      const userId = result?.userId ?? userData?.id;

      if (!userId || !userData?.rol) {
        showError('La contraseña se actualizo, pero no fue posible iniciar la sesión automáticamente.');
        router.push('/_api/Login/login');
        return;
      }

      setDataUsuario(userData);
      setUsuario(userId);

      showSuccess('Contraseña actualizada. Has iniciado sesión correctamente.');
      router.push(getDefaultPathByUser(userData));
    } catch (error) {
      console.error(error);
      const code = error?.status || error?.data?.error;
      switch (code) {
        case 400:
          showError(error?.data?.message || 'Faltan datos requeridos.');
          break;
        case 401:
          showError('La contraseña temporal es incorrecta.');
          break;
        case 404:
          showError('El usuario no existe.');
          break;
        case 409:
          showError('Este usuario ya no tiene un cambio de contraseña temporal pendiente.');
          break;
        default:
          showError('Ocurrio un error al actualizar la contraseña.');
          break;
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={`${styles.loginContainer} ${platformClass}`}>
      <div className={styles.overlay}>
        <img src="/images/curva1.svg" className={`${styles.curva} ${styles.curvaIzquierda}`} alt="" />

        <div className={styles.card}>
          <Image
            src="/images/logo_altezza_negro.png"
            width={130}
            height={80}
            layout="intrinsic"
            alt="Altezza Logo"
            className={styles.logo}
          />
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Usuario</label>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />

            <label>Contraseña temporal</label>
            <input type="password" value={passActual} onChange={(e) => setPassActual(e.target.value)} />

            <label>Nueva contraseña</label>
            <input type="password" value={passNueva} onChange={(e) => setPassNueva(e.target.value)} />

            <label>Confirmar nueva contraseña</label>
            <input type="password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} />

            <button type="submit" disabled={cargando}>
              {cargando ? 'Guardando...' : <u>Actualizar contraseña</u>}
            </button>
          </form>
        </div>

        <img src="/images/curva1.svg" className={`${styles.curva} ${styles.curvaDerecha}`} alt="" />
      </div>
    </div>
  );
}
