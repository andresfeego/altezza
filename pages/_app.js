import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDataStore } from '@/components/initialized/stored/useDataStore';
import { validarSesion } from '@/components/initialized/data/helpersGetDB';
import './app.scss'
// 🟡 Toastify
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  const setUser = useDataStore((state) => state.setUser);
  const logout = useDataStore((state) => state.logout);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rutasPublicas = ['/_api/login', '/_api/registro'];

    if (rutasPublicas.includes(router.pathname)) {
      setLoading(false);
      return;
    }

    async function checkSession() {
      try {
        const { usuario } = await validarSesion();
        setUser(usuario);
      } catch (err) {
        logout?.();
        router.push('/_api/login');
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router.pathname]);

  if (loading) return <div>Cargando...</div>;

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        transition={Slide}
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </>
  );
}

export default MyApp;
