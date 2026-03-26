import styles from './login.module.scss';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { loginUsuario } from '@/components/initialized/data/helpersGetDB';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import { getDefaultPathByUser, getLoginErrorMessage } from '@/components/constants/roles';
import { showError, showSuccess } from '@/components/initialized/Toast';

export default function Login() {
  const setUsuario = useUsuarioStore((state) => state.setUsuario);
  const setDataUsuario = useUsuarioStore((state) => state.setDataUsuario);
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
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
      return;
    }
  }, []);

  const handleLogin = async () => {
    setCargando(true);
    try {
      const result = await loginUsuario(correo, pass);
      const userData = result?.usuario || result; // backend retorna { success, userId, usuario }
      const userId = result?.userId ?? userData?.id;

      if (!userId || !userData?.rol) {
        showError(getLoginErrorMessage());
        return;
      }

      setDataUsuario(userData || null);
      setUsuario(userId);
      const destino = getDefaultPathByUser(userData);
      showSuccess('Ingreso correcto.');
      router.push(destino);
    } catch (err) {
      console.error('Error al iniciar sesión', err.message);
      const errorCode = err?.status || err?.data?.error;
      if (errorCode === 409) {
        showError('Debes actualizar la contraseña temporal antes de continuar.');
        router.push({
          pathname: '/_api/Login/cambiar-password',
          query: { user: correo },
        });
        return;
      }

      showError(getLoginErrorMessage(errorCode));
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cargando) {
      handleLogin();
    }
  };

  return (
    <div className={`${styles.loginContainer} ${platformClass}`}>
      <div className={styles.overlay}>
        <img src="/images/curva1.svg" className={`${styles.curva} ${styles.curvaIzquierda}`} />

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
              <input
                type="text"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <label>Contraseña</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <button type="submit" disabled={cargando}>
                {cargando ? 'Cargando...' : <u>Iniciar sesión</u>}
              </button>
          </form>
        </div>

        <img src="/images/curva1.svg" className={`${styles.curva} ${styles.curvaDerecha}`} />
      </div>
    </div>
  );
}
