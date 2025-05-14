import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import './app.scss';

// 🟡 Toastify
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const usuario = useUsuarioStore((state) => state.usuario);
  const clearUsuario = useUsuarioStore((state) => state.clearUsuario);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rutasPublicas = ['/_api/login', '/_api/registro'];

    if (rutasPublicas.includes(router.pathname)) {
      setLoading(false);
      return;
    }

    if (!usuario?.id) {
      clearUsuario?.();
      router.push('/_api/login');
    } else {
      setLoading(false);
    }
  }, [router.pathname, usuario]);

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
