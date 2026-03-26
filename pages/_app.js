import "./stylesGlobal.scss"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import './app.scss';
import '@/components/ui/governance/tokens.scss';
import LoadingScreen from '@/components/ui/LoadingScreen';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import UserMenuButton from '@/components/ui/UserMenuButton';
import { getDefaultPathByUser, getRoleHomePath, ROLE_IDS } from '@/components/constants/roles';
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

    const rutasPublicas = ['/_api/Login/login', '/_api/Login/cambiar-password', '/_api/registro/registro', '/ui-governance-lab'];

    const isManual = router.pathname === '/manual' || router.pathname.startsWith('/manual/');
    const isGovernanceLab = router.pathname === '/ui-governance-lab';

    if (rutasPublicas.includes(router.pathname) || isManual || isGovernanceLab) {
      setLoading(false);
      return;
    }

    if (!usuario) {
      clearUsuario?.();
      router.push('/_api/Login/login');
    } else {
      setLoading(false);
    }
  }, [clearUsuario, hydrated, router, router.pathname, usuario]);

  useEffect(() => {
    if (!hydrated || !usuario) return;
    const roleHome = getRoleHomePath(dataUsuario?.rol);
    const defaultPath = getDefaultPathByUser(dataUsuario);
    const isCliente = dataUsuario?.rol === ROLE_IDS.CLIENTE;
    const hasEventoAsignado = Boolean(dataUsuario?.idEventoAsignado);
    const isRoleHomeRoute =
      router.pathname.startsWith('/home/admin') ||
      router.pathname.startsWith('/home/cliente') ||
      router.pathname.startsWith('/home/organizador') ||
      router.pathname.startsWith('/home/colaborador');
    const isEventoRoute = router.pathname.startsWith('/evento/');

    if (router.pathname === '/' && defaultPath && router.pathname !== defaultPath) {
      router.replace(defaultPath);
      return;
    }

    if (isCliente) {
      if (isRoleHomeRoute && !router.pathname.startsWith('/home/cliente')) {
        router.replace(defaultPath);
        return;
      }

      if (hasEventoAsignado && router.pathname.startsWith('/home/cliente')) {
        router.replace(defaultPath);
        return;
      }

      if (!hasEventoAsignado && isEventoRoute) {
        router.replace('/home/cliente');
      }
      return;
    }

    if (isRoleHomeRoute && roleHome && !router.pathname.startsWith(roleHome)) {
      router.replace(roleHome);
    }
  }, [dataUsuario, hydrated, router, router.pathname, usuario]);

  if (!hydrated || loading) return <LoadingScreen />;
  const isManual = router.pathname === '/manual' || router.pathname.startsWith('/manual/');
  const isGovernanceLab = router.pathname === '/ui-governance-lab';

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
  <Toaster
    position="top-center"
    toastOptions={{
      duration: 3500,
      style: {
        background: '#fffaf7',
        color: '#453b34',
        border: '1px solid #ecdcd2',
        borderRadius: '14px',
        boxShadow: '0 14px 32px rgba(0, 0, 0, 0.08)',
      },
      success: {
        iconTheme: {
          primary: '#5b9b6c',
          secondary: '#fff',
        },
      },
      error: {
        iconTheme: {
          primary: '#c96e6e',
          secondary: '#fff',
        },
      },
    }}
  />
  {usuario && !isManual && !isGovernanceLab && <SideMenu />}
  <Component {...pageProps} />
  {usuario && !isManual && !isGovernanceLab && <UserMenuButton />}
  </>
  );
}

export default MyApp;
