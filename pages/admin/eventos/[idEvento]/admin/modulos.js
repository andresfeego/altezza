import { useRouter } from 'next/router';
import AdminEventWorkspaceLayout from '@/components/admin/eventos/AdminEventWorkspaceLayout';
import AdminEventoModulesManager from '@/components/admin/eventos/AdminEventoModulesManager';

export default function AdminEventModulesPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <AdminEventWorkspaceLayout idEvento={idEvento}>
      {({ evento, loading, syncModuleState }) => {
        if (loading) {
          return <div>Cargando modulos del evento...</div>;
        }

        return (
          <AdminEventoModulesManager
            evento={evento}
            onModulesChange={(nextModules) => syncModuleState(nextModules)}
          />
        );
      }}
    </AdminEventWorkspaceLayout>
  );
}
