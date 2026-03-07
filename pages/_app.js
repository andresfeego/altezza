import "./stylesGlobal.scss"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import './app.scss';
import LoadingScreen from '@/components/ui/LoadingScreen';
import NextTopLoader from 'nextjs-toploader';
import UserMenuButton from '@/components/ui/UserMenuButton';
import { getHomePathByRole } from '@/components/constants/roles';
import SideMenu from '@/components/navigation/SideMenu';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const usuario = useUsuarioStore((state) => state.usuario);
  const clearUsuario = useUsuarioStore((state) => state.clearUsuario);
  const dataUsuario = useUsuarioStore((state) => state.dataUsuario);
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

  useEffect(() => {
    if (!hydrated || !usuario) return;
    const roleHome = getHomePathByRole(dataUsuario?.rol);
    const isRoleHomeRoute =
      router.pathname.startsWith('/home/admin') ||
      router.pathname.startsWith('/home/cliente') ||
      router.pathname.startsWith('/home/organizador') ||
      router.pathname.startsWith('/home/colaborador');

    if (router.pathname === '/' && roleHome && router.pathname !== roleHome) {
      router.replace(roleHome);
      return;
    }

    if (isRoleHomeRoute && roleHome && !router.pathname.startsWith(roleHome)) {
      router.replace(roleHome);
    }
  }, [router.pathname, hydrated, usuario, dataUsuario?.rol]);

  if (!hydrated || loading) return <LoadingScreen />;

  const hiddenMenuPaths = ['/_api/Login/login', '/_api/registro/registro',
    '/manual',
    '/manual/','
];

  return (
  <>
  <NextTopLoader
            color="#E6B7B1"
            initialPosition={0.5}
            crawlSpeed={200}
            height={5}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 13px #E6B7B1,0 0 8px #C48C96"
            zIndex={1600}
            showAtBottom={false}
          />
  {usuario && <SideMenu hiddenPaths={hiddenMenuPaths} />}
  <Component {...pageProps} />
  {usuario && <UserMenuButton />}
  </>
  );
}

export default MyApp;
