import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import useEventoStore from '@/components/initialized/stored/useEventoStore';
import './app.scss';
import '@/components/ui/governance/tokens.scss';
import LoadingScreen from '@/components/ui/LoadingScreen';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import UserMenuButton from '@/components/ui/UserMenuButton';
import { getDefaultPathByUser, getRoleHomePath, ROLE_IDS } from '@/components/constants/roles';
import {
  canAccessClientRoute,
  getAssignedEventCount,
  getAssignedEvents,
  hasAssignedEvent,
  isClienteEventRoute,
} from '@/components/constants/eventContext';
import SideMenu from '@/components/navigation/SideMenu';
import { getModulosClientePorEvento, getUsuarioSesion } from '@/components/initialized/data/helpersGetDB';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const usuario = useUsuarioStore((state) => state.usuario);
  const clearUsuario = useUsuarioStore((state) => state.clearUsuario);
  const dataUsuario = useUsuarioStore((state) => state.dataUsuario);
  const setDataUsuario = useUsuarioStore((state) => state.setDataUsuario);
  const setEventoActivo = useEventoStore((state) => state.setEventoActivo);
  const setEventoActivoById = useEventoStore((state) => state.setEventoActivoById);
  const clearEventoActivo = useEventoStore((state) => state.clearEventoActivo);
  const idEventoActivo = useEventoStore((state) => state.idEventoActivo);
  const setLoadingModulosCliente = useEventoStore((state) => state.setLoadingModulosCliente);
  const setErrorModulosCliente = useEventoStore((state) => state.setErrorModulosCliente);
  const modulosCliente = useEventoStore((state) => state.modulosCliente);
  const hasResolvedModulosCliente = useEventoStore((state) => state.hasResolvedModulosCliente);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // ✅ Esperar que Zustand hidrate desde localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const rutasPublicas = ['/_api/Login/login', '/_api/Login/cambiar-password', '/_api/registro/registro', '/ui-governance-lab'];
    const isPublicInvitation = router.pathname === '/invitacion/[idInvitacion]/[idInvitado]';

    const isManual = router.pathname === '/manual' || router.pathname.startsWith('/manual/');
    const isGovernanceLab = router.pathname === '/ui-governance-lab';

    if (rutasPublicas.includes(router.pathname) || isManual || isGovernanceLab || isPublicInvitation) {
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
    const hasEventoAsignado = hasAssignedEvent(dataUsuario);
    const eventosAsignados = getAssignedEvents(dataUsuario);
    const totalEventosAsignados = getAssignedEventCount(dataUsuario);
    const isRoleHomeRoute =
      router.pathname.startsWith('/home/admin') ||
      router.pathname.startsWith('/home/cliente') ||
      router.pathname.startsWith('/home/organizador') ||
      router.pathname.startsWith('/home/colaborador');
    const isEventoRoute = isClienteEventRoute(router.pathname);

    if (router.pathname === '/' && defaultPath && router.pathname !== defaultPath) {
      router.replace(defaultPath);
      return;
    }

    if (isCliente) {
      if (isRoleHomeRoute && !router.pathname.startsWith('/home/cliente')) {
        router.replace(defaultPath);
        return;
      }

      if (
        router.pathname.startsWith('/home/cliente') &&
        totalEventosAsignados === 1 &&
        defaultPath !== '/home/cliente'
      ) {
        router.replace(defaultPath);
        return;
      }

      const derivedActiveEventId =
        idEventoActivo ||
        (eventosAsignados.length === 1 ? eventosAsignados[0].id : null) ||
        (typeof router.query?.idEvento === 'string' &&
        eventosAsignados.some((evento) => evento.id === router.query.idEvento)
          ? router.query.idEvento
          : null);

      const routeAccess = canAccessClientRoute({
        pathname: router.pathname,
        user: dataUsuario,
        activeEventId: derivedActiveEventId,
        moduleState: modulosCliente,
        hasResolvedModules: hasResolvedModulosCliente || !hasEventoAsignado,
      });

      if (!routeAccess.allowed && isEventoRoute) {
        router.replace('/home/cliente');
      }
      return;
    }

    if (isEventoRoute) {
      router.replace(roleHome || '/');
      return;
    }

    if (isRoleHomeRoute && roleHome && !router.pathname.startsWith(roleHome)) {
      router.replace(roleHome);
    }
  }, [dataUsuario, hasResolvedModulosCliente, hydrated, idEventoActivo, modulosCliente, router, router.pathname, router.query?.idEvento, usuario]);

  useEffect(() => {
    if (!hydrated) return;

    if (!usuario || dataUsuario?.rol !== ROLE_IDS.CLIENTE) {
      clearEventoActivo();
      return;
    }

    const eventosAsignados = getAssignedEvents(dataUsuario);
    if (!eventosAsignados.length) {
      clearEventoActivo();
      return;
    }

    let nextEventoActivoId = null;
    const hasSingleEvent = eventosAsignados.length === 1;

    if (hasSingleEvent) {
      nextEventoActivoId = eventosAsignados[0].id;
    } else if (idEventoActivo && eventosAsignados.some((evento) => evento.id === idEventoActivo)) {
      nextEventoActivoId = idEventoActivo;
    } else if (
      typeof router.query?.idEvento === 'string' &&
      eventosAsignados.some((evento) => evento.id === router.query.idEvento)
    ) {
      nextEventoActivoId = router.query.idEvento;
    }

    if (!nextEventoActivoId) {
      clearEventoActivo();
      return;
    }

    if (nextEventoActivoId !== idEventoActivo) {
      setEventoActivoById(nextEventoActivoId);
    }

    let cancelled = false;

    async function cargarContextoEvento() {
      try {
        setLoadingModulosCliente(true);
        const response = await getModulosClientePorEvento(nextEventoActivoId);
        if (cancelled) return;

        setEventoActivo({
          idEventoActivo: response?.idEvento || nextEventoActivoId,
          modulosCliente: response?.modules || [],
        });
      } catch (error) {
        if (cancelled) return;
        clearEventoActivo();
        setErrorModulosCliente(error?.message || 'No fue posible cargar los modulos del evento.');
      } finally {
        if (!cancelled) {
          setLoadingModulosCliente(false);
        }
      }
    }

    cargarContextoEvento();

    return () => {
      cancelled = true;
    };
  }, [
    clearEventoActivo,
    dataUsuario,
    hydrated,
    idEventoActivo,
    router.query?.idEvento,
    setErrorModulosCliente,
    setEventoActivo,
    setEventoActivoById,
    setLoadingModulosCliente,
    usuario,
  ]);

  useEffect(() => {
    if (!hydrated || !usuario || dataUsuario?.rol !== ROLE_IDS.CLIENTE) return undefined;
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return undefined;

    const streamUrl = `${process.env.HOST_NAME}/stream/usuarios/${usuario}`;
    const source = new EventSource(streamUrl);
    let cancelled = false;

    async function refreshUsuarioSesion() {
      try {
        const response = await getUsuarioSesion(usuario);
        if (cancelled) return;
        const refreshedUser = response?.usuario || response;
        if (refreshedUser) {
          setDataUsuario(refreshedUser);
        }
      } catch (error) {
        if (cancelled) return;
        console.error('No fue posible refrescar la sesion del usuario.', error);
      }
    }

    source.onmessage = async (event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (payload?.type === 'usuario_eventos_actualizados' && Number(payload?.idUsuario) === Number(usuario)) {
          await refreshUsuarioSesion();
        }
      } catch (error) {
        console.error('No fue posible procesar el evento SSE del usuario.', error);
      }
    };

    source.onerror = (error) => {
      if (cancelled) return;
      console.error('Se perdio la conexion SSE del usuario.', error);
    };

    return () => {
      cancelled = true;
      source.close();
    };
  }, [dataUsuario?.rol, hydrated, setDataUsuario, usuario]);

  if (!hydrated || loading) return <LoadingScreen />;
  const isManual = router.pathname === '/manual' || router.pathname.startsWith('/manual/');
  const isGovernanceLab = router.pathname === '/ui-governance-lab';
  const isAdminEventWorkspaceRoute = router.pathname.startsWith('/admin/eventos/[idEvento]');
  const isPublicInvitation = router.pathname === '/invitacion/[idInvitacion]/[idInvitado]';

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
  {usuario && !isManual && !isGovernanceLab && !isAdminEventWorkspaceRoute && !isPublicInvitation && <SideMenu />}
  {usuario && !isManual && !isGovernanceLab && !isPublicInvitation && <UserMenuButton />}
  <Component {...pageProps} />
  </>
  );
}

export default MyApp;
