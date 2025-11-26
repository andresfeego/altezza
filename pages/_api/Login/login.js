import styles from './login.module.scss';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { loginUsuario } from '@/components/initialized/data/helpersGetDB';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import { getHomePathByRole, ROLE_IDS } from '@/components/constants/roles';

export default function Login() {
  const setUsuario = useUsuarioStore((state) => state.setUsuario);
  const setDataUsuario = useUsuarioStore((state) => state.setDataUsuario);
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);
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
    setError(null);
    try {
      const result = await loginUsuario(correo, pass);
      const userData = result?.usuario || result; // backend retorna { success, userId, usuario }
      const userId = result?.userId ?? userData?.id;

      if (!userId) {
        setError('Credenciales inválidas');
        return;
      }

      setDataUsuario(userData || null);
      setUsuario(userId);
      let destino;
      if (userData?.rol === ROLE_IDS.CLIENTE) {
        const idEvento = userData?.idEventoAsignado || 'evento_no_asignado';
        destino = `/evento/feed/${idEvento}`;
      } else {
        destino = getHomePathByRole(userData?.rol);
      }
      router.push(destino);
    } catch (err) {
      console.error('Error al iniciar sesión', err.message);
      setError('Hubo un error. Intenta de nuevo.');
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
                {cargando ? 'Cargando...' : 'Iniciar sesión'}
              </button>
              {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>

        <img src="/images/curva1.svg" className={`${styles.curva} ${styles.curvaDerecha}`} />
      </div>
    </div>
  );
}
