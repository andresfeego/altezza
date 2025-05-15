import styles from './login.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUsuario } from '@/components/initialized/data/helpersGetDB';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';

export default function Login() {
  const setUsuario = useUsuarioStore((state) => state.setUsuario);
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    setCargando(true);
    setError(null);
    try {
      const result = await loginUsuario(correo, pass);
      console.log(result);
      if (!result?.userId) {
        setError('Credenciales inválidas');
        return;
      }

      setUsuario( result.userId );
      router.push('/'); // o a donde quieras redirigir
    } catch (err) {
      console.error('Error al iniciar sesión', err.message);
      setError('Hubo un error. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
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
          <div className={styles.form}>
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
            <button onClick={handleLogin} disabled={cargando}>
              {cargando ? 'Cargando...' : 'Iniciar sesión'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>

        <img src="/images/curva1.svg" className={`${styles.curva} ${styles.curvaDerecha}`} />
      </div>
    </div>
  );
}
