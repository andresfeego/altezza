import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getEnabledClientModules } from '@/components/constants/clientModules';
import { getModulosClientePorEvento } from '@/components/initialized/data/helpersGetDB';
import { buildClientModuleState } from '@/components/constants/clientModules';
import { resolveAdminEventClientModuleHref } from '@/components/navigation/buildEventContextNav';
import PageShell from '@/components/ui/layout/PageShell';

export default function AdminEventoWorkspacePage() {
  const router = useRouter();
  const { idEvento } = router.query;
  const [status, setStatus] = useState('Preparando workspace del evento...');

  useEffect(() => {
    if (!idEvento) return;

    let cancelled = false;

    async function redirectToWorkspace() {
      try {
        const response = await getModulosClientePorEvento(idEvento);
        if (cancelled) return;

        const moduleState = buildClientModuleState(response?.modules || []);
        const firstEnabledModule = getEnabledClientModules(moduleState)[0];
        const nextPath = firstEnabledModule
          ? resolveAdminEventClientModuleHref(idEvento, firstEnabledModule.key)
          : `/admin/eventos/${idEvento}/admin/modulos`;

        router.replace(nextPath);
      } catch (error) {
        if (cancelled) return;
        setStatus('No fue posible resolver el destino inicial del evento.');
      }
    }

    redirectToWorkspace();

    return () => {
      cancelled = true;
    };
  }, [idEvento, router]);

  return (
    <PageShell surface="basic">
        <main>
          <h1>Workspace del evento</h1>
          <p>{status}</p>
        </main>
    </PageShell>
  );
}
