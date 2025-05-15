import "./stylesGlobal.scss"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import './app.scss';
import LoadingScreen from '@/components/ui/LoadingScreen';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const usuario = useUsuarioStore((state) => state.usuario);
  const clearUsuario = useUsuarioStore((state) => state.clearUsuario);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // ✅ Esperar que Zustand hidrate desde localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const rutasPublicas = ['/_api/Login/login', '/_api/registro/registro'];

    if (rutasPublicas.includes(router.pathname)) {
      setLoading(false);
      return;
    }

    if (!usuario) {
      clearUsuario?.();
      router.push('/_api/Login/login');
    } else {
      setLoading(false);
    }
  }, [router.pathname, usuario, hydrated]);

  if (!hydrated || loading) return <LoadingScreen />;

  return <Component {...pageProps} />;
}

export default MyApp;
