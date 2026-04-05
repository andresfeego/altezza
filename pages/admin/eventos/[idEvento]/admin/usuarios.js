import { useRouter } from 'next/router';
import AdminEventWorkspaceLayout from '@/components/admin/eventos/AdminEventWorkspaceLayout';
import { AdminEventoUsuariosPanel } from '@/components/admin/eventos/AdminEventoUsuariosView';

export default function AdminEventUsersPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <AdminEventWorkspaceLayout idEvento={idEvento}>
      {({ evento, loading }) => (
        <AdminEventoUsuariosPanel
          idEvento={idEvento}
          evento={evento}
          loading={loading}
        />
      )}
    </AdminEventWorkspaceLayout>
  );
}
