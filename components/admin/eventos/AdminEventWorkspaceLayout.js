import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import EventContextRail from '@/components/navigation/EventContextRail';
import { buildClientModuleState } from '@/components/constants/clientModules';
import useEventoStore from '@/components/initialized/stored/useEventoStore';
import { getDetalleEvento, getModulosClientePorEvento } from '@/components/initialized/data/helpersGetDB';
import { showError } from '@/components/initialized/Toast';
import styles from './AdminEventWorkspaceLayout.module.scss';

export default function AdminEventWorkspaceLayout({ idEvento, children }) {
  const [evento, setEvento] = useState(null);
  const [loadingEvento, setLoadingEvento] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [moduleState, setModuleState] = useState({});
  const setEventoActivo = useEventoStore((state) => state.setEventoActivo);

  function syncModuleState(nextModules = []) {
    const nextModuleState = buildClientModuleState(nextModules);
    setModuleState(nextModuleState);
    setEventoActivo({
      idEventoActivo: idEvento,
      modulosCliente: nextModules,
    });
  }

  useEffect(() => {
    if (!idEvento) return undefined;

    const currentStore = useEventoStore.getState();
    const previousState = {
      idEventoActivo: currentStore.idEventoActivo,
      modulosCliente: currentStore.modulosCliente,
      loadingModulosCliente: currentStore.loadingModulosCliente,
      hasResolvedModulosCliente: currentStore.hasResolvedModulosCliente,
      errorModulosCliente: currentStore.errorModulosCliente,
    };

    let cancelled = false;

    async function loadWorkspace() {
      try {
        setLoadingEvento(true);
        setLoadingModules(true);

        const [detalleResponse, modulosResponse] = await Promise.all([
          getDetalleEvento(idEvento),
          getModulosClientePorEvento(idEvento),
        ]);

        if (cancelled) return;

        const detail = Array.isArray(detalleResponse) ? detalleResponse[0] : detalleResponse;
        setEvento(detail || null);
        syncModuleState(modulosResponse?.modules || []);
      } catch (error) {
        if (cancelled) return;
        setEvento(null);
        setModuleState({});
        showError('No fue posible cargar el workspace administrativo del evento.');
      } finally {
        if (!cancelled) {
          setLoadingEvento(false);
          setLoadingModules(false);
        }
      }
    }

    loadWorkspace();

    return () => {
      cancelled = true;
      useEventoStore.setState(previousState);
    };
  }, [idEvento, setEventoActivo]);

  const loading = loadingEvento || loadingModules;
  const eventLabel = useMemo(() => {
    if (!evento) return idEvento || 'Evento';
    return evento.nombre || evento.id || idEvento;
  }, [evento, idEvento]);

  return (
    <div className={styles.workspace}>
      <aside className={styles.primaryRail} aria-label="Retorno al admin">
        <Link href="/home/admin" className={styles.homeBackButton} aria-label="Volver al home admin">
          <FiArrowLeft size={18} />
        </Link>
      </aside>

      <div className={styles.contextRail}>
        <EventContextRail
          idEvento={idEvento}
          moduleState={moduleState}
          className={styles.contextRailMenu}
        />
      </div>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.eventIdentity}>
            <strong>{eventLabel}</strong>
            <span>{evento?.estado ? 'Evento activo' : 'Workspace administrativo'}</span>
          </div>
        </header>

        <main className={styles.canvas}>
          {children({ evento, loading, moduleState, syncModuleState })}
        </main>
      </div>
    </div>
  );
}
